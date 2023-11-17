interface Category {
  alias: string,
  title: string,
}

interface Location {
  address1?: string,
  address2?: string,
  address3?: string,
  city?: string,
  state?: string,
  zip_code?: string,
  display_address: string[],
  timezone?: string,
  cross_streets?: string,
}

interface Coordinates {
  latitude: number,
  longitude: number,
}

interface Open {
  is_overnight: boolean,
  start: string,
  end: string,
  day: number,
}

interface Hours {
  open: Open[],
  hours_type: string,
  is_open_now: boolean,
}

interface SpecialHours {
  date: string,
  is_closed?: boolean,
  start?: string,
  end?: string,
  is_overnight?: boolean,
}

export interface BusinessDetails {
  id: string,
  alias: string,
  name: string,
  image_url?: string,
  is_claimed: boolean,
  is_closed?: boolean,
  url?: string,
  phone: string,
  display_phone: string,
  review_count?: number,
  categories?: Category[],
  rating?: number,
  location: Location,
  coordinates: Coordinates,
  photos: string[],
  hours: Hours[],
  transactions: string[],
  price?: string,
  distance?: string,
  special_hours?: SpecialHours[],
}