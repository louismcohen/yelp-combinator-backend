const mongoose = require('mongoose');
import { Schema } from 'mongoose';
import { BasicBusiness, Business } from './business';

export const basicBusiness: Schema = new Schema<BasicBusiness>({
  alias: String,
  note: String,
  added_index: Number,
  yelp_collection_id: String,
});

const business: Schema = new Schema<Business>({
  id: String,
  alias: {
    type: String,
    unique: true,
  },
  name: String,
  image_url: String,
  is_claimed: Boolean,
  is_closed: Boolean,
  url: String,
  phone: String,
  display_phone: String,
  review_count: Number,
  categories: [{
    alias: String,
    title: String
  }],
  rating: Number,
  location: {
    address1: String,
    address2: String,
    address3: String,
    city: String,
    zip_code: String,
    country: String,
    state: String,
    display_address: [String],
    timezone: String
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  photos: [String],
  hours: [{
    open: [{
      is_overnight: Boolean,
      start: String,
      end: String,
      day: Number
    }],
    hours_type: String,
    is_open_now: Boolean
  }],
  transactions: [String],
  price: String,
  distance: String,
  special_hours: [{
    date: String,
    is_closed: Boolean,
    start: String,
    end: String,
    is_overnight: Boolean
  }],
  yelp_collection_id: {
    type: String,
    trim: true
  },
  note: String,
  added_index: Number,
  visited: Boolean,
  website: String,
}, {
  timestamps: true
});

const BasicBusinessModel = mongoose.model('BasicBusiness', basicBusiness);
const BusinessModel = mongoose.model('Business', business);

module.exports = {
  BasicBusinessModel,
  BusinessModel,
};