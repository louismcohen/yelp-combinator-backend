import jsdom from 'jsdom';
import axios from 'axios';

import { YELP_AXIOS_OPTIONS, YELP_COLLECTION_URI } from '../config/config'

import { Request, Response } from "express";
import { CollectionPage, ScrapedCollection } from "./yelp-scraping";
import YelpScrapingService from './yelp-scraping.service';

class YelpScrapingController {
  loadCollectionPageDocument = async (req: Request, res: Response) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      const collectionPage: ScrapedCollection = await YelpScrapingService.loadCollectionPageDocument(yelp_collection_id);
      res.send(collectionPage);
  
    } catch (error) {
      console.error(error);
      res.send(error);
    }
    
  }
}

export default new YelpScrapingController();