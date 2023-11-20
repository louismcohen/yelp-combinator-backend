import dotenv from 'dotenv';
dotenv.config();

export const API_URL_PREFIX: string = 'api/';
export const API_VERSION: string = 'v1/';
export const API_BASE_PATH: string = `/${API_URL_PREFIX}${API_VERSION}`; 

export const YELP_TIME_ZONE: string = 'America/Los_Angeles';
export const YELP_BIZ_API_URI: string = 'https://api.yelp.com/v3/businesses/';
export const YELP_COLLECTION_URI: string = 'https://www.yelp.com/collection/';
export const YELP_RENDERED_ITEMS_URI: string = 'https://www.yelp.com/collection/user/rendered_items';
export const YELP_AXIOS_OPTIONS = {
  method: 'get',
  headers: {
    'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
    'Access-Control-Allow-Origin': '*'
  }
};