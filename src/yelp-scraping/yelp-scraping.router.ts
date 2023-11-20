import { Router } from "express";
const yelpScrapingRouter: Router = require('express').Router();

const YelpScrapingController = require('./yelp-scraping.controller');

yelpScrapingRouter.route('/yelp-scraping/collection/:yelp_collection_id').get(YelpScrapingController.loadCollectionPageDocument);

// yelpScrapingRouter.route('/yelp-scraping/')

module.exports = yelpScrapingRouter;