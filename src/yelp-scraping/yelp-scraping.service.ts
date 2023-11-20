import jsdom from 'jsdom';
import axios from 'axios';
import moment from 'moment-timezone';

import { YELP_AXIOS_OPTIONS, YELP_RENDERED_ITEMS_URI, YELP_TIME_ZONE } from '../config/config'

import { BasicBusiness } from '../business/business';
import { CollectionPage, ScrapedCollection } from './yelp-scraping';

class YelpScrapingService {
  populateCollectionPageDetails = (yelp_collection_id: string, doc: Document): CollectionPage => {
    let collection: CollectionPage = {
      yelp_collection_id,
      item_count: 0,
      last_updated: '',
      title: '',
    };
  
    collection.item_count = Number(doc?.querySelector('.ylist')?.getAttribute('data-item-count'));
    collection.last_updated = moment.tz(doc?.getElementsByTagName('time')[0].dateTime, YELP_TIME_ZONE).toISOString();
    collection.title = doc?.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  
    return collection;
  }
  
  populateBasicBusinessInfo = (items: Element[]): BasicBusiness[] => {
    let businesses: BasicBusiness[] = [];
  
    items.forEach((item: Element) => {
      const business: BasicBusiness = {
        alias: '',
        note: '',
        added_index: 0,
        yelp_collection_id: ''
      };
      
      const url = item?.querySelector('.biz-name')?.getAttribute('href');
      business.alias = url
        ? decodeURI(url.substring(url.lastIndexOf('/') + 1))
        : '';
      business.note = item?.querySelector('.js-info-content')?.textContent || '';
  
      businesses.push(business);
    })
  
    return businesses;
  }
  
  populateRenderedItems = async (collectionPage: CollectionPage): Promise<ScrapedCollection> => {
    const yelp_collection_id = collectionPage.yelp_collection_id;
  
    let scrapedCollection: ScrapedCollection = {
      ...collectionPage,
      businesses: [],
      created_at: '',
      updated_at: '',
    };
    
    console.log('populateRenderedItems', scrapedCollection.title);
  
    let renderedOffset: number  = 0; // ex: 0, 30, 60, 90 ...
    const offsetStep: number = 30; // Yelp render limit
    const maxOffset: number = scrapedCollection.item_count - 1; // ex: 218
  
    while (maxOffset - renderedOffset > 0) {
        const response: any = await axios(`${YELP_RENDERED_ITEMS_URI}?collection_id=${scrapedCollection.yelp_collection_id}&offset=${renderedOffset}&sort_by=date`, YELP_AXIOS_OPTIONS);
        const dom = new jsdom.JSDOM(response.data.list_markup);
        const doc = dom.window.document;
        
        const items: Element[] = Array.from(doc.querySelectorAll('.collection-item'));
        const businesses: BasicBusiness[] = this.populateBasicBusinessInfo(items);
  
        businesses.forEach((biz: BasicBusiness) => {
          biz.yelp_collection_id = yelp_collection_id;
        })
  
        scrapedCollection = {
          ...scrapedCollection,
          businesses: [...scrapedCollection.businesses, ...businesses],
        }
  
        renderedOffset += offsetStep;
    }
  
    console.log({scrapedCollection})
    return scrapedCollection;
  }
}

export default new YelpScrapingService();