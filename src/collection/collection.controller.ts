import { Request, Response } from 'express';
import { Collection } from "./collection";
import { CollectionModel } from './collection.model';
import CollectionService from './collection.service';
import ErrorHandler from '../util/errorHandler';

class CollectionController {
  createOrUpdateCollection = async (req: Request, res: Response) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      if (!yelp_collection_id) {
        res.status(400).send(ErrorHandler.HTTP_ERROR_MESSAGES.noYelpCollectionId);
      } else {
        const savedCollection: Collection = await CollectionService.createOrUpdateCollection(yelp_collection_id);
        res.send(savedCollection);
      }
    } catch (error) {
      console.error({error});
      res.send(error);
    }
  }
  
  getAllCollections = async (req: Request, res: Response) => {
    try {
      const foundCollections: Collection[] | null = await CollectionService.getAllCollections();
      res.send(foundCollections);
  
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }
  
  getCollectionByYelpCollectionId = async (req: Request, res: Response) => {
    const yelp_collection_id: string = req.params.yelp_collection_id;
  
    try {
      const foundCollection: Collection | null = await CollectionService.getCollectionByYelpCollectionId(yelp_collection_id);
      res.send(foundCollection);
  
    } catch (error) {
      console.error({error});
      res.send(error);
    }
  
  }
}

export default new CollectionController();