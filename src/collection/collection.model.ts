const mongoose = require('mongoose');
import { Schema } from 'mongoose';
import { Collection } from './collection'
import { basicBusiness } from '../business/business.model';

const collection: Schema = new Schema<Collection>({
  yelp_collection_id: {
    type: String,
    require: true,
    unique: false,
    trim: true
  },
  last_updated: Number,
  title: String,
  item_count: Number, 
  items: [String],
  businesses: [{
    alias: String,
    note: String,
    added_index: Number,
    yelp_collection_id: String,
  }]
}, { collection: 'collections'});

const CollectionModel = mongoose.model('Collection', collection);

module.exports = CollectionModel;