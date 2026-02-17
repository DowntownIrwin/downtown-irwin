import {
  type User, type InsertUser,
  type Event, type InsertEvent,
  type VehicleRegistration, type InsertVehicleRegistration,
  type SponsorshipInquiry, type InsertSponsorshipInquiry,
  type Sponsor, type InsertSponsor,
  type Business, type InsertBusiness,
  type ContactMessage, type InsertContactMessage,
  type PhotoAlbum, type InsertPhotoAlbum,
  type AlbumPhoto, type InsertAlbumPhoto,
  type VendorRegistration, type InsertVendorRegistration,
  users, events, vehicleRegistrations, sponsorshipInquiries, sponsors, businesses, contactMessages,
  photoAlbums, albumPhotos, vendorRegistrations,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  getVehicleRegistrations(): Promise<VehicleRegistration[]>;
  createVehicleRegistration(reg: InsertVehicleRegistration): Promise<VehicleRegistration>;

  getSponsorshipInquiries(): Promise<SponsorshipInquiry[]>;
  createSponsorshipInquiry(inquiry: InsertSponsorshipInquiry): Promise<SponsorshipInquiry>;

  getSponsors(): Promise<Sponsor[]>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(id: number, sponsor: Partial<InsertSponsor>): Promise<Sponsor | undefined>;
  deleteSponsor(id: number): Promise<boolean>;

  getBusinesses(): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;

  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  getPhotoAlbums(): Promise<PhotoAlbum[]>;
  getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined>;
  createPhotoAlbum(album: InsertPhotoAlbum): Promise<PhotoAlbum>;
  updatePhotoAlbum(id: number, album: Partial<InsertPhotoAlbum>): Promise<PhotoAlbum | undefined>;
  deletePhotoAlbum(id: number): Promise<boolean>;

  getAlbumPhotos(albumId: number): Promise<AlbumPhoto[]>;
  createAlbumPhoto(photo: InsertAlbumPhoto): Promise<AlbumPhoto>;
  deleteAlbumPhoto(id: number): Promise<boolean>;

  getVendorRegistrations(eventType?: string): Promise<VendorRegistration[]>;
  createVendorRegistration(reg: InsertVendorRegistration): Promise<VendorRegistration>;
  updateVendorRegistration(id: number, reg: Partial<InsertVendorRegistration>): Promise<VendorRegistration | undefined>;
  deleteVendorRegistration(id: number): Promise<boolean>;

  getSponsorsByEvent(eventType: string): Promise<Sponsor[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  async getVehicleRegistrations(): Promise<VehicleRegistration[]> {
    return db.select().from(vehicleRegistrations);
  }

  async createVehicleRegistration(reg: InsertVehicleRegistration): Promise<VehicleRegistration> {
    const [created] = await db.insert(vehicleRegistrations).values(reg).returning();
    return created;
  }

  async getSponsorshipInquiries(): Promise<SponsorshipInquiry[]> {
    return db.select().from(sponsorshipInquiries);
  }

  async createSponsorshipInquiry(inquiry: InsertSponsorshipInquiry): Promise<SponsorshipInquiry> {
    const [created] = await db.insert(sponsorshipInquiries).values(inquiry).returning();
    return created;
  }

  async getSponsors(): Promise<Sponsor[]> {
    return db.select().from(sponsors);
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const [created] = await db.insert(sponsors).values(sponsor).returning();
    return created;
  }

  async updateSponsor(id: number, sponsor: Partial<InsertSponsor>): Promise<Sponsor | undefined> {
    const [updated] = await db.update(sponsors).set(sponsor).where(eq(sponsors.id, id)).returning();
    return updated;
  }

  async deleteSponsor(id: number): Promise<boolean> {
    const result = await db.delete(sponsors).where(eq(sponsors.id, id)).returning();
    return result.length > 0;
  }

  async getBusinesses(): Promise<Business[]> {
    return db.select().from(businesses);
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [created] = await db.insert(businesses).values(business).returning();
    return created;
  }

  async updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined> {
    const [updated] = await db.update(businesses).set(business).where(eq(businesses.id, id)).returning();
    return updated;
  }

  async deleteBusiness(id: number): Promise<boolean> {
    const result = await db.delete(businesses).where(eq(businesses.id, id)).returning();
    return result.length > 0;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async getPhotoAlbums(): Promise<PhotoAlbum[]> {
    return db.select().from(photoAlbums);
  }

  async getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined> {
    const [album] = await db.select().from(photoAlbums).where(eq(photoAlbums.id, id));
    return album;
  }

  async createPhotoAlbum(album: InsertPhotoAlbum): Promise<PhotoAlbum> {
    const [created] = await db.insert(photoAlbums).values(album).returning();
    return created;
  }

  async updatePhotoAlbum(id: number, album: Partial<InsertPhotoAlbum>): Promise<PhotoAlbum | undefined> {
    const [updated] = await db.update(photoAlbums).set(album).where(eq(photoAlbums.id, id)).returning();
    return updated;
  }

  async deletePhotoAlbum(id: number): Promise<boolean> {
    await db.delete(albumPhotos).where(eq(albumPhotos.albumId, id));
    const result = await db.delete(photoAlbums).where(eq(photoAlbums.id, id)).returning();
    return result.length > 0;
  }

  async getAlbumPhotos(albumId: number): Promise<AlbumPhoto[]> {
    return db.select().from(albumPhotos).where(eq(albumPhotos.albumId, albumId));
  }

  async createAlbumPhoto(photo: InsertAlbumPhoto): Promise<AlbumPhoto> {
    const [created] = await db.insert(albumPhotos).values(photo).returning();
    return created;
  }

  async deleteAlbumPhoto(id: number): Promise<boolean> {
    const result = await db.delete(albumPhotos).where(eq(albumPhotos.id, id)).returning();
    return result.length > 0;
  }

  async getVendorRegistrations(eventType?: string): Promise<VendorRegistration[]> {
    if (eventType) {
      return db.select().from(vendorRegistrations).where(eq(vendorRegistrations.eventType, eventType));
    }
    return db.select().from(vendorRegistrations);
  }

  async createVendorRegistration(reg: InsertVendorRegistration): Promise<VendorRegistration> {
    const [created] = await db.insert(vendorRegistrations).values(reg).returning();
    return created;
  }

  async updateVendorRegistration(id: number, reg: Partial<InsertVendorRegistration>): Promise<VendorRegistration | undefined> {
    const [updated] = await db.update(vendorRegistrations).set(reg).where(eq(vendorRegistrations.id, id)).returning();
    return updated;
  }

  async deleteVendorRegistration(id: number): Promise<boolean> {
    const result = await db.delete(vendorRegistrations).where(eq(vendorRegistrations.id, id)).returning();
    return result.length > 0;
  }

  async getSponsorsByEvent(eventType: string): Promise<Sponsor[]> {
    return db.select().from(sponsors).where(eq(sponsors.eventType, eventType));
  }
}

export const storage = new DatabaseStorage();
