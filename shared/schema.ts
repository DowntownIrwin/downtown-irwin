import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  imageUrl: text("image_url"),
  externalLink: text("external_link"),
});

export const vehicleRegistrations = pgTable("vehicle_registrations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  vehicleYear: text("vehicle_year").notNull(),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vehicleColor: text("vehicle_color").notNull(),
  vehicleClass: text("vehicle_class").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorshipInquiries = pgTable("sponsorship_inquiries", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  level: text("level").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  eventType: text("event_type").default("car-cruise"),
  sponsorImageUrl: text("sponsor_image_url"),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  website: text("website"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const photoAlbums = pgTable("photo_albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverPhotoUrl: text("cover_photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const albumPhotos = pgTable("album_photos", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vendorRegistrations = pgTable("vendor_registrations", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  vendorCategory: text("vendor_category").notNull(),
  description: text("description"),
  specialRequests: text("special_requests"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true });

export const insertVehicleRegistrationSchema = createInsertSchema(vehicleRegistrations).omit({ id: true, createdAt: true });

export const insertSponsorshipInquirySchema = createInsertSchema(sponsorshipInquiries).omit({ id: true, createdAt: true });

export const insertSponsorSchema = createInsertSchema(sponsors).omit({ id: true });

export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true });

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });

export const insertPhotoAlbumSchema = createInsertSchema(photoAlbums).omit({ id: true, createdAt: true });

export const insertAlbumPhotoSchema = createInsertSchema(albumPhotos).omit({ id: true, createdAt: true });

export const insertVendorRegistrationSchema = createInsertSchema(vendorRegistrations).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type VehicleRegistration = typeof vehicleRegistrations.$inferSelect;
export type InsertVehicleRegistration = z.infer<typeof insertVehicleRegistrationSchema>;
export type SponsorshipInquiry = typeof sponsorshipInquiries.$inferSelect;
export type InsertSponsorshipInquiry = z.infer<typeof insertSponsorshipInquirySchema>;
export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type PhotoAlbum = typeof photoAlbums.$inferSelect;
export type InsertPhotoAlbum = z.infer<typeof insertPhotoAlbumSchema>;
export type AlbumPhoto = typeof albumPhotos.$inferSelect;
export type InsertAlbumPhoto = z.infer<typeof insertAlbumPhotoSchema>;
export type VendorRegistration = typeof vendorRegistrations.$inferSelect;
export type InsertVendorRegistration = z.infer<typeof insertVendorRegistrationSchema>;
