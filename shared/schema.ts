import { z } from "zod";

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  active: z.boolean(),
});

export const featuredEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
});

export const adminDataSchema = z.object({
  announcements: z.array(announcementSchema),
  featuredEvents: z.array(featuredEventSchema),
});

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string(),
  imageUrl: z.string().optional(),
  featured: z.boolean().optional(),
});

export const sponsorSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.enum(['presenting', 'gold', 'silver', 'supporting']),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
});

export const carCruiseSponsorsSchema = z.object({
  presenting: z.array(sponsorSchema),
  gold: z.array(sponsorSchema),
  silver: z.array(sponsorSchema),
  supporting: z.array(sponsorSchema),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type Announcement = z.infer<typeof announcementSchema>;
export type FeaturedEvent = z.infer<typeof featuredEventSchema>;
export type AdminData = z.infer<typeof adminDataSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Sponsor = z.infer<typeof sponsorSchema>;
export type CarCruiseSponsors = z.infer<typeof carCruiseSponsorsSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
