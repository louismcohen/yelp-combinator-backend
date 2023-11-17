import { BusinessDetails } from "../yelp-fusion/business-details";

export interface BasicBusiness {
  alias: string,
  note: string,
  added_index: number,
  yelp_collection_id: string,
}

export interface Business extends BusinessDetails, BasicBusiness {
  visited: boolean,
  website: string,
}

