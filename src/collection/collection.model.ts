import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Collection } from './collection'

const collection: Schema = new Schema<Collection>({
  yelp_collection_id: {
    type: String,
    require: true,
    unique: false,
    trim: true
  },
  last_updated: String,
  title: String,
  item_count: Number, 
  businesses: [{
    alias: String,
    note: String,
    added_index: Number,
    yelp_collection_id: String,
  }]
}, { 
  collection: 'collections',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

export const CollectionModel = mongoose.model('Collection', collection);