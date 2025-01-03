const router = require('express').Router();
const { processSearch } = require('../services/ai-search.service');

const validateViewport = (viewport) => {
  return (
    Array.isArray(viewport.southwest) &&
    Array.isArray(viewport.northeast) &&
    viewport.southwest.length === 2 &&
    viewport.northeast.length === 2 &&
    viewport.southwest.every((coord) => typeof coord === 'number') &&
    viewport.northeast.every((coord) => typeof coord === 'number') &&
    viewport.northeast[0] > viewport.southwest[0] &&
    viewport.northeast[1] > viewport.southwest[1] &&
    viewport.northeast[0] >= -180 &&
    viewport.northeast[0] <= 180 &&
    viewport.southwest[0] >= -180 &&
    viewport.southwest[0] <= 180
  );
};

router.post(
  '/search',
  async (
    req, res
  ) => {
    const { query, userLocation, viewport } = req.body;

    console.log('/search', req.body)

    // Validate request
    if (!query) {
      return res.status(400).json({
        results: [],
        totalResults: 0,
        error: 'Search query is required',
      });
    }

    if (viewport && !validateViewport(viewport)) {
      return res.status(400).json({
        results: [],
        totalResults: 0,
        error: 'Valid viewport coordinates are required',
      });
    }

    // Process the search
    processSearch(query, viewport, userLocation)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.error('Search error:', error);
        res.status(500).json({
          results: [],
          totalResults: 0,
          error:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        });
      });
  }
);

module.exports = router;