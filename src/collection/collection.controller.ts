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

const getAllCollections = async (req: Request, res: Response) => {
  try {
    const foundCollections: Collection[] = await CollectionModel.find();
    res.send(foundCollections);

  } catch (error) {
    console.error(error);
  }
}

const getCollectionByYelpCollectionId = async (req: Request, res: Response) => {
  const yelp_collection_id: String = req.params.yelp_collection_id;

  try {
    const foundCollection: Collection = await CollectionModel.findOne({yelp_collection_id});
    res.send(foundCollection);

  } catch (error) {
    console.error({error});
  }

}
  
  module.exports = {
    createCollection,
    getAllCollections,
    getCollectionByYelpCollectionId,
  }