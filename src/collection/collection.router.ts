const CollectionController = require('./collection.controller');

const collectionRouter = require('express').Router();

collectionRouter.route('/collection/:yelp_collection_id').get(CollectionController.getCollectionByYelpCollectionId);
collectionRouter.route('/collection').get(CollectionController.getAllCollections);
collectionRouter.route('/collection').post(CollectionController.addCollection);
collectionRouter.route('/collection/:yelp_collection_id').post(CollectionController.createOrUpdateCollection);

module.exports = collectionRouter;