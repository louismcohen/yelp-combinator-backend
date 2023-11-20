import { Request, Response } from 'express';
import { Collection } from "./collection";
const CollectionModel = require('./collection.model');

const createCollection = async (req: Request, res: Response) => {
  const newCollection: Collection = req.body;
  
  try {
    const createdCollection: Collection = await CollectionModel.create(newCollection);
    res.send(createdCollection);

  } catch (error) {
    console.error({error});
  }
};

const createOrUpdateCollection = async (req: Request, res: Response) => {
  const collection: Collection = req.body;

  try {
    const savedCollection: Collection = await CollectionModel.findOneAndUpdate(
      { yelp_collection_id: collection.yelp_collection_id },
      collection,
      { new: true, upsert: true },
      (error: any, result: any) => {
        if (error) {
          console.error('Error: ', error.response.status);
        } else {
          console.log(`Successfully updated ${collection.title}`);
        }
      }
    );

    res.send(savedCollection);
  } catch (error) {
    console.error({error});
    res.send(error);
  }
}

const getAllCollections = async (req: Request, res: Response) => {
  try {
    const foundCollections: Collection[] = await CollectionModel.find();
    res.send(foundCollections);

  } catch (error) {
    console.error(error);
    res.send(error);
  }
}

const getCollectionByYelpCollectionId = async (req: Request, res: Response) => {
  const yelp_collection_id: String = req.params.yelp_collection_id;

  try {
    const foundCollection: Collection = await CollectionModel.findOne({yelp_collection_id});
    res.send(foundCollection);

  } catch (error) {
    console.error({error});
    res.send(error);
  }

}
  
  module.exports = {
    createCollection,
    getAllCollections,
    getCollectionByYelpCollectionId,
  }