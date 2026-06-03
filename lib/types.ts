export type City = {
  id: string;
  name_ru: string;
  name_en: string;
  slug: string;
  country_ru: string;
  country_en: string;
  country_slug: string;
  flag_emoji: string | null;
  population: string | null;
  climate: string | null;
  language: string | null;
  currency: string | null;
  flight_from_moscow: string | null;
  is_foreign: boolean;
  difficulty_score: number | null;
  is_popular: boolean;
  seo_title: string | null;
  seo_description: string | null;
  intro_text: string | null;
  lat: number | null;
  lng: number | null;
  unsplash_photo_id: string | null;
  unsplash_url: string | null;
  unsplash_author_name: string | null;
  unsplash_author_url: string | null;
};

export type Price = {
  id: string;
  city_id: string;
  category: PriceCategory;
  item_name_ru: string;
  price_min: number;
  price_max: number;
  is_premium: boolean;
};

export type PriceCategory =
  | "rent"
  | "food"
  | "transport"
  | "utilities"
  | "cafe"
  | "health"
  | "entertainment";

export type CityWithMinRent = City & { min_rent: number };
