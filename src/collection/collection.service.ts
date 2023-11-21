import YelpScrapingService from "../yelp-scraping/yelp-scraping.service";
import { Collection } from "./collection";
import { CollectionModel } from "./collection.model";

class CollectionService {
  createOrUpdateCollection = async (yelp_collection_id: string): Promise<Collection> => {
    const collection = await YelpScrapingService.loadCollectionPageDocument(yelp_collection_id);
    
    try {
      const savedCollection: Collection = await CollectionModel.findOneAndUpdate(
        { yelp_collection_id },
        collection,
        { new: true, upsert: true },
      );
      return savedCollection;
    } catch (error) {
      throw error;
    }
  }

  getAllCollections = async (): Promise<Collection[]> => {
    try {
      const foundCollections: Collection[] = await CollectionModel.find();
      return foundCollections;
    } catch (error) {
      throw error;
    }
  }

  getCollectionByYelpCollectionId = async (yelp_collection_id: string): Promise<Collection | null> => {
    try {
      const foundCollection: Collection | null = await CollectionModel.findOne({yelp_collection_id});
      return foundCollection;
    } catch (error) {
      throw error;
    }
  }
}

export default new CollectionService();