import { Request, Response, Router } from 'express';
import express = require('express');
import { Business } from '../models/yelp-business.model';
import { processSearch } from '../services/ai-search.service';

const router = Router();
// Type definitions
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Viewport {
  southwest: [number, number]; // [longitude, latitude]
  northeast: [number, number]; // [longitude, latitude]
}

export interface SearchRequest {
  query: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  viewport?: {
    southwest: [number, number]; // [longitude, latitude]
    northeast: [number, number]; // [longitude, latitude]
  };
}

export interface SearchResponse {
  results: Business[];
  searchConfig?: any;
  totalResults: number;
  error?: string;
}

export interface SearchConfiguration {
  textSearch?: string;
  categories?: string[];
  visited?: boolean;
  isClaimed?: boolean;
  shouldCheckHours?: boolean;
  location?: {
    near: [number, number];
    maxDistance?: number;
  };
  viewport?: {
    southwest: [number, number];
    northeast: [number, number];
  };
}

const validateViewport = (viewport: Viewport): boolean => {
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
    req: Request<{}, {}, SearchRequest>,
    res: Response<SearchResponse>
  ) => {
    const { query, userLocation, viewport } = req.body;

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
      } as SearchResponse);
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
        } as SearchResponse);
      });
  }
);

export default router;
