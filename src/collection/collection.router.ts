import CollectionController from './collection.controller';

import { Router } from 'express';
export const collectionRouter: Router = Router();

collectionRouter.route('/collection/:yelp_collection_id').get(CollectionController.getCollectionByYelpCollectionId);
collectionRouter.route('/collection').get(CollectionController.getAllCollections);

collectionRouter.route('/collection/:yelp_collection_id').post(CollectionController.createOrUpdateCollection);