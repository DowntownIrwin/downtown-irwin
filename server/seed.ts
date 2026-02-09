import { db } from "./db";
import { events, sponsors, businesses, users } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
    });
    console.log("Admin user seeded (username: admin, password: admin123)");
  }

  const existingEvents = await db.select().from(events);
  if (existingEvents.length > 0) return;

  await db.insert(events).values([
    {
      title: "Downtown Irwin Car Cruise",
      description: "A springtime car cruise in the heart of Irwin featuring classic, custom, and modern vehicles. Food, music, and local vendors along Main Street.",
      date: "Saturday, April 25, 2026",
      time: "12:00 PM - 4:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Car Show",
      featured: true,
      imageUrl: "/images/hero-carcruise.png",
    },
    {
      title: "16th Annual Ladies Night",
      description: "An evening of shopping, prizes, dining, and live music in Downtown Irwin. Registration at the Masonic Hall on Main Street. Over 1,000 attendees expected!",
      date: "Thursday, November 6, 2025",
      time: "4:00 PM - 9:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Shopping",
      featured: true,
      imageUrl: "/images/event-ladies-night.png",
    },
    {
      title: "Light Up Night",
      description: "Kick off the holiday season with a parade, tree lighting ceremony, and holiday shopping along Main Street. A magical evening for the whole family.",
      date: "Saturday, December 6, 2025",
      time: "5:00 PM - 9:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Holiday",
      featured: true,
      imageUrl: "/images/event-lightup.png",
    },
    {
      title: "Cookie Tour",
      description: "Visit downtown shops offering cookies and holiday treats while enjoying extended shopping hours. A sweet tradition for the season!",
      date: "Saturday, December 13, 2025",
      time: "11:00 AM - 4:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Holiday",
      featured: false,
      imageUrl: "/images/event-cookie-tour.png",
    },
    {
      title: "Pink Friday",
      description: "Shop local before Black Friday! Downtown Irwin's alternative shopping event featuring special deals and promotions at local businesses.",
      date: "Friday, November 28, 2025",
      time: "10:00 AM - 8:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Shopping",
      featured: false,
      imageUrl: "/images/event-pink-friday.png",
    },
    {
      title: "Summer Sidewalk Sale",
      description: "Local shops bring their best deals outdoors! Browse sidewalk sales, enjoy food vendors, and soak up the summer vibes on Main Street.",
      date: "Saturday, July 19, 2026",
      time: "10:00 AM - 5:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Festival",
      featured: false,
      imageUrl: null,
    },
    {
      title: "Art Walk",
      description: "A community art celebration showcasing local artists, live demonstrations, and interactive art experiences throughout downtown.",
      date: "Saturday, June 14, 2026",
      time: "12:00 PM - 6:00 PM",
      location: "Main Street, Downtown Irwin",
      category: "Community",
      featured: false,
      imageUrl: null,
    },
  ]);

  await db.insert(sponsors).values([
    { name: "Gift Basket World & Candy Shop", level: "Silver", logoUrl: null, websiteUrl: null },
    { name: "Colonial Grille Taproom", level: "Gold", logoUrl: null, websiteUrl: null },
    { name: "The Lamp Theatre", level: "Gold", logoUrl: null, websiteUrl: null },
    { name: "Norwin Chamber of Commerce", level: "Supporting", logoUrl: null, websiteUrl: null },
    { name: "Pure Imagination", level: "Silver", logoUrl: null, websiteUrl: null },
  ]);

  await db.insert(businesses).values([
    {
      name: "The Lamp Theatre",
      description: "A 350-seat intimate live entertainment venue featuring concerts, tribute bands, comedy nights, and community events.",
      address: "222 Main St, Irwin, PA 15642",
      phone: "(724) 863-5267",
      website: "https://www.thelamptheatre.org",
      category: "Entertainment",
      imageUrl: null,
    },
    {
      name: "Colonial Grille Taproom",
      description: "Local restaurant and taproom on Main Street serving American fare. Home of the weekly IBPA meetings every Thursday morning.",
      address: "Main St, Irwin, PA 15642",
      phone: "(724) 864-8800",
      website: null,
      category: "Restaurant",
      imageUrl: null,
    },
    {
      name: "Gift Basket World & Candy Shop",
      description: "Specialty gift shop featuring custom gift baskets, SARRIS Candy, and unique gifts for every occasion.",
      address: "Main St, Irwin, PA 15642",
      phone: "(724) 864-1444",
      website: null,
      category: "Retail",
      imageUrl: null,
    },
    {
      name: "Club Pure Imagination",
      description: "Nightclub and event venue featuring dueling pianos, comedy nights, music bingo, and themed parties.",
      address: "419 Main St, Irwin, PA 15642",
      phone: null,
      website: "https://www.pureimaginationirwin.com",
      category: "Entertainment",
      imageUrl: null,
    },
    {
      name: "Feathers Gift Shop",
      description: "Artist market and gift shop offering unique handmade items, classes, workshops, and seasonal events.",
      address: "4th St, Irwin, PA 15642",
      phone: null,
      website: "https://feathersartistmarket.com",
      category: "Retail",
      imageUrl: null,
    },
    {
      name: "The Firepit Wood Fired Grill",
      description: "Restaurant featuring wood-fired cuisine and live acoustic music nights in a relaxed setting.",
      address: "8933 Lincoln Hwy, Irwin, PA 15642",
      phone: null,
      website: null,
      category: "Restaurant",
      imageUrl: null,
    },
    {
      name: "Irwin Family Wellness Center",
      description: "Community wellness center offering fitness classes, personal training, and family health programs.",
      address: "Main St, Irwin, PA 15642",
      phone: "(724) 864-5000",
      website: null,
      category: "Health & Wellness",
      imageUrl: null,
    },
    {
      name: "Main Street Barber",
      description: "Traditional barbershop providing classic cuts, hot towel shaves, and grooming services in the heart of downtown.",
      address: "Main St, Irwin, PA 15642",
      phone: "(724) 864-2200",
      website: null,
      category: "Services",
      imageUrl: null,
    },
  ]);

  console.log("Database seeded successfully");
}
