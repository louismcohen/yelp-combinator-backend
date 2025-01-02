import mongoose from 'mongoose';

export interface Category {
  alias: string;
  title: string;
}

export interface Location {
  address1: string;
  address2: string | null;
  address3: string | null;
  city: string;
  zip_code: string;
  country: string;
  state: string;
  display_address: string[];
  timezone: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OpenHours {
  is_overnight: boolean;
  start: string;
  end: string;
  day: number;
}

export interface Hours {
  open: OpenHours[];
  hours_type: string;
  is_open_now: boolean;
}

export interface SpecialHours {
  date: string;
  is_closed: boolean;
  start: string | null;
  end: string | null;
  is_overnight: boolean;
}

export interface Business {
  alias: string;
  name: string;
  image_url: string;
  phone: string;
  display_phone: string;
  review_count: number;
  categories: Category[];
  rating: number;
  location: Location;
  coordinates: Coordinates;
  photos: string[];
  yelpCollectionId?: string; // Optional since `trim` is not relevant to TypeScript
  note?: string; // Optional since it might not always be present
  addedIndex?: number; // Optional since it might not always be present
  hours?: Hours[]; // Optional since it might not always be present
  special_hours?: SpecialHours[]; // Optional since it might not always be present
  visited?: boolean; // Optional since it might not always be present
  website?: string; // Optional since it might not always be present
  is_claimed: boolean;
  is_closed: boolean;
}

const yelpBusinessSchema = new mongoose.Schema<Business>(
  {
    alias: {
      type: String,
      unique: true,
    },
    name: String,
    image_url: String,
    phone: String,
    display_phone: String,
    review_count: Number,
    categories: [
      {
        alias: String,
        title: String,
      },
    ],
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
      timezone: String,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    photos: [String],
    yelpCollectionId: {
      type: String,
      trim: true,
    },
    note: String,
    addedIndex: Number,
    hours: [
      {
        open: [
          {
            is_overnight: Boolean,
            start: String,
            end: String,
            day: Number,
          },
        ],
        hours_type: String,
        is_open_now: Boolean,
      },
    ],
    special_hours: [
      {
        date: String,
        is_closed: Boolean,
        start: String,
        end: String,
        is_overnight: Boolean,
      },
    ],
    visited: Boolean,
    website: String,
    is_claimed: Boolean,
    is_closed: Boolean,
  },
  {
    timestamps: true,
  }
);

const YelpBusiness = mongoose.model('YelpBusiness', yelpBusinessSchema);

export default YelpBusiness;
