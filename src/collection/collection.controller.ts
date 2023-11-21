import { Request, Response } from 'express';
import { Collection } from "./collection";
import YelpScrapingController from '../yelp-scraping/yelp-scraping.controller';
import { CollectionModel } from './collection.model';
import yelpScrapingService from '../yelp-scraping/yelp-scraping.service';

class CollectionController {
  createOrUpdateCollection = async (req: Request, res: Response) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
    const collection = await yelpScrapingService.loadCollectionPageDocument(yelp_collection_id);
  
    try {
      const savedCollection: Collection = await CollectionModel.findOneAndUpdate(
        { yelp_collection_id },
        collection,
        { new: true, upsert: true },
      );
  
      res.send(savedCollection);
    } catch (error) {
      console.error({error});
      res.send(error);
    }
  }
  
  getAllCollections = async (req: Request, res: Response) => {
    try {
      const foundCollections: Collection[] | null = await CollectionModel.find();
      res.send(foundCollections);
  
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }
  
  getCollectionByYelpCollectionId = async (req: Request, res: Response) => {
    const yelp_collection_id: String = req.params.yelp_collection_id;
  
    try {
      const foundCollection: Collection | null = await CollectionModel.findOne({yelp_collection_id});
      res.send(foundCollection);
  
    } catch (error) {
      console.error({error});
      res.send(error);
    }
  
  }
}

export default new CollectionController();