export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  featured: boolean;
  imageUrl: string | null;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string | null;
  website: string | null;
  category: string;
}

export interface Sponsor {
  id: number;
  name: string;
  level: string;
  website: string | null;
}
