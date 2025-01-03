import Anthropic from '@anthropic-ai/sdk';
const YelpBusiness = require('../models/yelp-business.model');

export const processSearch = async (
  query,
  viewport,
  userLocation
) => {
  try {
    // Process natural language query
    const searchConfig = await processNaturalLanguageQuery(query, userLocation);

    // Execute search with viewport
    const results = await searchBusinesses(
      searchConfig,
      viewport,
      userLocation
    );

    return {
      results,
      searchConfig,
      totalResults: results.length,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Search processing failed'
    );
  }
};

export const processNaturalLanguageQuery = async (
  query,
  userLocation
) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = `
    You are helping search a database of Yelp bookmarks. Return a search configuration object with these possible fields:
    {
      textSearch?: string[];     // For searching name, notes, and categories. A note might have information about certain menu items or cuisines at the restaurant, so if a term in the query isn't obviously a name or category, it should be a note. Separate each potential query into its own string.
      categories?: string[];     // Specific category filters, namely the type of business it is (e.g. "coffee shop") or cuisine it might have (e.g. "Italian", "Mexican", "Chinese", etc.)
      visited?: boolean;         // Filter by visited status
      isClaimed?: boolean;       // Filter by claimed status
      shouldCheckHours?: boolean; // Indicates if results need to be filtered by open status
      useProximity?: boolean;    // True if query explicitly mentions location relative to user AND userLocation is provided
      location?: {
        near: [number, number],  // [longitude, latitude]
        maxDistance?: number     // In meters
      }
    }
    
    ${
      userLocation
        ? `Current user location: ${userLocation.latitude}, ${userLocation.longitude}`
        : 'No user location provided'
    }
    IMPORTANT: Only set useProximity to true if the query explicitly mentions location relative to the user 
    AND user location is provided (e.g., "near me", "within 2 miles", "nearby", "close to me", etc.).
    If no user location is provided, ignore any proximity-based requests.
    Return only a valid JSON object matching this schema.
  `;

  console.log(`Processing search query: ${query}`);
  console.log(`System prompt: ${systemPrompt}`);

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    temperature: 0,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Convert this search request to a search configuration: "${query}"`,
      },
    ],
  });

  const contentBlock = response.content[0];
  if (contentBlock.type === 'text') {
    console.log(`Response: ${contentBlock.text}`);
    return JSON.parse(contentBlock.text);
  } else {
    throw new Error(`Response returned unexpected format ${contentBlock}`);
  }
};

export const searchBusinesses = async (
  searchConfig,
  viewport,
  userLocation
) => {
  let mongoQuery = {};

  console.log('searchConfig:', searchConfig);
  console.log('viewport:', viewport);

  let andConditions = [];

  // Build the base MongoDB query
  if (searchConfig.textSearch) {
    mongoQuery.$or = [
      ...(searchConfig.textSearch &&
        searchConfig.textSearch.map((text) => ({
          name: {
            $regex: text,
            $options: 'i',
          },
        }))),
      ...(searchConfig.textSearch &&
        searchConfig.textSearch.map((text) => ({
          note: {
            $regex: text,
            $options: 'i',
          },
        }))),
    ];
  }

  if (searchConfig.categories) {
    andConditions.push({
      $or: searchConfig.categories.map((category) => ({
        'categories.title': { $regex: category, $options: 'i' },
      })),
    });
  }

  if (typeof searchConfig.visited === 'boolean') {
    mongoQuery.visited = searchConfig.visited;
  }

  if (typeof searchConfig.isClaimed === 'boolean') {
    mongoQuery.is_claimed = searchConfig.isClaimed;
  }

  // Location-based search logic
  if (userLocation && searchConfig.useProximity) {
    // Use user location if provided and proximity was requested
    mongoQuery.coordinates = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
        $maxDistance: searchConfig.location?.maxDistance || 2000,
      },
    };
  } else if (viewport) {
    // Always fall back to viewport if no user location or proximity not requested
    mongoQuery['coordinates.latitude'] = {
      $gte: viewport.southwest[1],
      $lte: viewport.northeast[1],
    };
    mongoQuery['coordinates.longitude'] = {
      $gte: viewport.southwest[0],
      $lte: viewport.northeast[0],
    };
  }

  if (andConditions.length > 0) {
    mongoQuery.$and = andConditions;
  }

  console.log('Mongo query:', JSON.stringify(mongoQuery));

  return await YelpBusiness.find(mongoQuery);
};
