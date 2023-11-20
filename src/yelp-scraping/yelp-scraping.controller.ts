const jsdom = require('jsdom');
const axios = require('axios');
const { YELP_AXIOS_OPTIONS, YELP_RENDERED_ITEMS_URI, YELP_COLLECTION_URI, YELP_TIME_ZONE } = require('../config/config');

import { Request, Response } from "express";
import { CollectionPage, ScrapedCollection } from "./yelp-scraping";
const YelpScrapingService = require('./yelp-scraping.service');

const getScrapedCollection = async (collectionPage: CollectionPage): Promise<ScrapedCollection> => {
  try {
    const scrapedCollection: ScrapedCollection = await YelpScrapingService.populateRenderedItems(collectionPage);
    return scrapedCollection;

  } catch (error) {
    throw error;
  }
}

const loadCollectionPageDocumentByYelpCollectionId = async (yelp_collection_id: string): Promise<ScrapedCollection> => {
  try {
    const response: any = await axios.get(`${YELP_COLLECTION_URI}${yelp_collection_id}`, YELP_AXIOS_OPTIONS);
    const dom: typeof jsdom = new jsdom.JSDOM(response.data); 

    const doc: Document = dom.window.document;
    const collectionPage: CollectionPage = YelpScrapingService.populateCollectionPageDetails(yelp_collection_id, doc);

    const scrapedCollection = await getScrapedCollection(collectionPage);

    return scrapedCollection;

  } catch (error) {
    console.error({error});
    throw error;
  }
}

const loadCollectionPageDocument = async (req: Request, res: Response) => {
  const yelp_collection_id: string = req.params.yelp_collection_id;

  try {
    const collectionPage: ScrapedCollection = await loadCollectionPageDocumentByYelpCollectionId(yelp_collection_id);
    res.send(collectionPage);

  } catch (error) {
    console.error(error);
    res.send(error);
  }
  
}

module.exports = {
  loadCollectionPageDocument,
  loadCollectionPageDocumentByYelpCollectionId,
}