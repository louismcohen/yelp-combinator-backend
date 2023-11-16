import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class Categories {
  @Prop()
  alias: string;

  @Prop()
  title: string;
}

class Location {
  @Prop()
  address1: string;

  @Prop()
  address2: string;

  @Prop()
  address3: string;

  @Prop()
  city: string;

  @Prop()
  zip_code: string;

  @Prop()
  country: string;
  
  @Prop()
  state: string;

  @Prop()
  display_address: string[];

  @Prop()
  timezone: string;
}

class Coordinates {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

class Open {
  @Prop()
  is_overnight: boolean;

  @Prop()
  start: string;
  
  @Prop()
  end: string;

  @Prop()
  day: number;
}

class Hours {
  @Prop()
  open: Open[];

  @Prop()
  hours_type: string;

  @Prop()
  is_open_now: boolean;
}

class SpecialHours {
  @Prop()
  date: string;

  @Prop()
  is_closed: boolean;

  @Prop()
  start: string;
  
  @Prop()
  end: string;

  @Prop()
  is_overnight: boolean;
}

export type BusinessDocument = HydratedDocument<Business>;

@Schema({ collection: 'yelp-businesses', timestamps: true })
export class Business {
  @Prop({ required: true, unique: true  })
  alias: string;

  @Prop()
  name: string;

  @Prop()
  image_url: string;

  @Prop()
  phone: string;

  @Prop()
  display_phone: string;

  @Prop()
  review_count: number;

  @Prop()
  categories: Categories[];

  @Prop()
  rating: number;

  @Prop()
  location: Location;

  @Prop()
  coordinates: Coordinates;

  @Prop()
  photos: string[];

  @Prop({ required: true, trim: true })
  yelp_collection_id: string;

  @Prop()
  note: string;

  @Prop()
  addedIndex: number;

  @Prop()
  hours: Hours[];

  @Prop()
  special_hours: SpecialHours[];

  @Prop()
  visited: boolean;

  @Prop()
  website: string;

  @Prop()
  is_claimed: boolean;

  @Prop()
  is_closed: boolean;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
