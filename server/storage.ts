import type { AdminData, Event, CarCruiseSponsors, ContactForm } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_DATA_FILE = path.join(DATA_DIR, "admin-data.json");

export interface IStorage {
  getAdminData(): Promise<AdminData>;
  saveAdminData(data: AdminData): Promise<void>;
  getEvents(): Promise<Event[]>;
  getCarCruiseSponsors(): Promise<CarCruiseSponsors>;
  saveContactMessage(form: ContactForm): Promise<void>;
}

const defaultAdminData: AdminData = {
  announcements: [
    {
      id: "1",
      title: "Summer Events",
      content: "Check out our upcoming summer events including the famous Irwin Car Cruise!",
      active: true,
    },
  ],
  featuredEvents: [
    {
      id: "1",
      title: "Irwin Car Cruise 2026",
      date: "August 15, 2026",
      description: "Join us for the biggest car cruise in the region! Classic cars, live music, and family fun.",
    },
    {
      id: "2",
      title: "Summer Farmers Market",
      date: "Every Saturday",
      description: "Fresh local produce, artisan goods, and community connection in Downtown Irwin.",
    },
    {
      id: "3",
      title: "Fall Harvest Festival",
      date: "October 10, 2026",
      description: "Celebrate the harvest season with local vendors, pumpkin decorating, and autumn treats.",
    },
  ],
};

const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Irwin Car Cruise 2026",
    date: "August 15, 2026",
    time: "4:00 PM - 9:00 PM",
    location: "Main Street, Irwin PA",
    description: "The biggest car cruise in the region! Featuring hundreds of classic and custom cars, live music, food vendors, and family activities.",
    featured: true,
  },
  {
    id: "2",
    title: "Summer Farmers Market",
    date: "Every Saturday, June - September",
    time: "9:00 AM - 1:00 PM",
    location: "Downtown Irwin",
    description: "Fresh local produce, baked goods, artisan crafts, and more from local vendors.",
    featured: true,
  },
  {
    id: "3",
    title: "Fall Harvest Festival",
    date: "October 10, 2026",
    time: "11:00 AM - 6:00 PM",
    location: "Main Street, Irwin PA",
    description: "Celebrate autumn with pumpkin decorating, apple cider, live entertainment, and local vendors.",
    featured: false,
  },
  {
    id: "4",
    title: "Holiday Market",
    date: "December 5-6, 2026",
    time: "10:00 AM - 5:00 PM",
    location: "Downtown Irwin",
    description: "Shop for unique holiday gifts from local artisans and enjoy festive treats and entertainment.",
    featured: false,
  },
];

const defaultSponsors: CarCruiseSponsors = {
  presenting: [],
  gold: [],
  silver: [],
  supporting: [],
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export class FileStorage implements IStorage {
  private events: Event[];
  private carCruiseSponsors: CarCruiseSponsors;
  private contactMessages: ContactForm[];

  constructor() {
    ensureDataDir();
    this.events = [...defaultEvents];
    this.carCruiseSponsors = { ...defaultSponsors };
    this.contactMessages = [];
    
    if (!fs.existsSync(ADMIN_DATA_FILE)) {
      writeJsonFile(ADMIN_DATA_FILE, defaultAdminData);
    }
  }

  async getAdminData(): Promise<AdminData> {
    return readJsonFile(ADMIN_DATA_FILE, defaultAdminData);
  }

  async saveAdminData(data: AdminData): Promise<void> {
    writeJsonFile(ADMIN_DATA_FILE, data);
  }

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async getCarCruiseSponsors(): Promise<CarCruiseSponsors> {
    return this.carCruiseSponsors;
  }

  async saveContactMessage(form: ContactForm): Promise<void> {
    this.contactMessages.push(form);
    console.log("Contact message received:", form);
  }
}

export const storage = new FileStorage();
