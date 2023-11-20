import jsdom from 'jsdom';
import axios from 'axios';

import { YELP_AXIOS_OPTIONS, YELP_COLLECTION_URI } from '../config/config'

import { Request, Response } from "express";
import { CollectionPage, ScrapedCollection } from "./yelp-scraping";
import YelpScrapingService from './yelp-scraping.service';

class YelpScrapingController {
  getScrapedCollection = async (collectionPage: CollectionPage): Promise<ScrapedCollection> => {
    try {
      const scrapedCollection: ScrapedCollection = await YelpScrapingService.populateRenderedItems(collectionPage);
      return scrapedCollection;
  
    } catch (error) {
      throw error;
    }
  }
  
  loadCollectionPageDocumentByYelpCollectionId = async (yelp_collection_id: string): Promise<ScrapedCollection> => {
    try {
      const response: any = await axios.get(`${YELP_COLLECTION_URI}${yelp_collection_id}`, YELP_AXIOS_OPTIONS);
      const dom = new jsdom.JSDOM(response.data); 
  
      const doc: Document = dom.window.document;
      const collectionPage: CollectionPage = YelpScrapingService.populateCollectionPageDetails(yelp_collection_id, doc);
  
      const scrapedCollection = await this.getScrapedCollection(collectionPage);
  
      return scrapedCollection;
  
    } catch (error) {
      console.error({error});
      throw error;
    }
  }
  
  loadCollectionPageDocument = async (req: Request, res: Response) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      const collectionPage: ScrapedCollection = await this.loadCollectionPageDocumentByYelpCollectionId(yelp_collection_id);
      res.send(collectionPage);
  
    } catch (error) {
      console.error(error);
      res.send(error);
    }
    
  }
}

export default new YelpScrapingController();