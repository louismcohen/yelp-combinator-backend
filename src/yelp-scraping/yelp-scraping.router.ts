import { Router } from "express";

export const yelpScrapingRouter: Router = Router();

import YelpScrapingController from "./yelp-scraping.controller";

yelpScrapingRouter.route('/yelp-scraping/collection/:yelp_collection_id').get(YelpScrapingController.loadCollectionPageDocument);

// yelpScrapingRouter.route('/yelp-scraping/')