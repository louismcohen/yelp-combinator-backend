const jsdom = require('jsdom');
const axios = require('axios');
const moment = require('moment-timezone');
const { YELP_AXIOS_OPTIONS, YELP_RENDERED_ITEMS_URI, YELP_COLLECTION_URI, YELP_TIME_ZONE } = require('../config/config');

import { Request, Response } from "express";
import { CollectionPage } from "./yelp-scraping";

const loadCollectionPage = async (req: Request, res: Response) => {
  const yelp_collection_id = req.params.yelp_collection_id;

  let collection: CollectionPage = {
    yelp_collection_id,
    item_count: 0,
    last_updated: '',
    title: '',
  };
  
  try {
    const response: any = await axios.get(`${YELP_COLLECTION_URI}${collection.yelp_collection_id}`, YELP_AXIOS_OPTIONS);
    const dom: typeof jsdom = new jsdom.JSDOM(response.data); 

    collection.doc = dom.window.document;
    collection.item_count = Number(collection.doc?.querySelector('.ylist')?.getAttribute('data-item-count'));
    collection.last_updated = moment.tz(collection.doc?.getElementsByTagName('time')[0].dateTime, YELP_TIME_ZONE);

    collection.title = collection.doc?.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';

    res.send(collection);
  } catch (error) {
    console.error({error});
    res.send(error);
  }
}

module.exports = {
  loadCollectionPage,
}