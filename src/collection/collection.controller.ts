import { NextFunction, Request, Response } from 'express';
import { Collection } from "./collection";
import CollectionService from './collection.service';

class CollectionController {
  createOrUpdateCollection = async (req: Request, res: Response, next: NextFunction) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      const savedCollection: Collection = await CollectionService.createOrUpdateCollection(yelp_collection_id);
      res.send(savedCollection);
    } catch (error) {
      next(error);
    }
  }
  
  getAllCollections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundCollections: Collection[] | null = await CollectionService.getAllCollections();
      res.send(foundCollections);
  
    } catch (error) {
      next(error);
    }
  }
  
  getCollectionByYelpCollectionId = async (req: Request, res: Response, next: NextFunction) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      const foundCollection: Collection | null = await CollectionService.getCollectionByYelpCollectionId(yelp_collection_id);
      res.send(foundCollection);
  
    } catch (error) {
      next(error);
    }
  
  }
}

export default new CollectionController();