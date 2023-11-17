interface 

export interface CollectionPage {
  yelp_collection_id: string,
  doc: Document,
  item_count: number,
  last_updated: string,
  title: string,
}

export interface ScrapedCollection extends CollectionPage {
  // items: 
}