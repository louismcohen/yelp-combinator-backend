import { BasicBusiness } from "../business/business"

export interface Collection {
  yelp_collection_id: string,
  businesses: BasicBusiness[],
  items: String[],
  created_at: string,
  item_count: number,
  last_updated: string,
  title: string,
  updated_at: string, 
}