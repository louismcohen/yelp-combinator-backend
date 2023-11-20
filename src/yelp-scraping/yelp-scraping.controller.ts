const jsdom = require('jsdom');
const axios = require('axios');
const { YELP_AXIOS_OPTIONS, YELP_RENDERED_ITEMS_URI, YELP_COLLECTION_URI, YELP_TIME_ZONE } = require('../config/config');

import { Request, Response } from "express";
import { CollectionPage, ScrapedCollection } from "./yelp-scraping";
const YelpScrapingService = require('./yelp-scraping.service');

const loadCollectionPageDocument = async (req: Request, res: Response) => {
  const yelp_collection_id: string = req.params.yelp_collection_id;

  try {
    const response: any = await axios.get(`${YELP_COLLECTION_URI}${yelp_collection_id}`, YELP_AXIOS_OPTIONS);
    const dom: typeof jsdom = new jsdom.JSDOM(response.data); 

    const doc: Document = dom.window.document;
    const collectionPage: CollectionPage = YelpScrapingService.populateCollectionPageDetails(yelp_collection_id, doc);

    try {
      const scrapedCollection: ScrapedCollection = await YelpScrapingService.populateRenderedItems(collectionPage);
      
      res.send(scrapedCollection);
    } catch (error) {
      console.error({error});
      return error;
    }

  } catch (error) {
    console.error({error});
    res.send(error);
  }
}

module.exports = {
  loadCollectionPageDocument,
}