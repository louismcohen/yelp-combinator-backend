require('dotenv').config();

export const API_URL_PREFIX: String = 'api/';
export const API_VERSION: String = 'v1/';
export const API_BASE_PATH: String = `/${API_URL_PREFIX}${API_VERSION}`; 

export const YELP_TIME_ZONE = 'America/Los_Angeles';
export const YELP_BIZ_API_URI = 'https://api.yelp.com/v3/businesses/';
export const YELP_COLLECTION_URI = 'https://www.yelp.com/collection/';
export const YELP_RENDERED_ITEMS_URI = 'https://www.yelp.com/collection/user/rendered_items';
export const YELP_AXIOS_OPTIONS = {
  method: 'get',
  headers: {
    'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
    'Access-Control-Allow-Origin': '*'
  }
};