import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Building, Target } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="About IBPA" 
        description="Learn about the Irwin Business & Professional Association's mission, history, and commitment to promoting economic vitality and community engagement in Downtown Irwin."
        path="/about"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About IBPA</h1>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            The Irwin Business & Professional Association has been serving our community 
            for over 30 years, fostering growth and connection in Downtown Irwin.
          </p>

          <div className="prose prose-lg max-w-none mb-16 dark:prose-invert">
            <h2>Our Mission</h2>
            <p>
              The Irwin Business & Professional Association (IBPA) is dedicated to promoting 
              economic vitality, community engagement, and quality of life in Downtown Irwin 
              and the surrounding area. We work collaboratively with local businesses, residents, 
              and civic organizations to create a thriving, vibrant community.
            </p>

            <h2>What We Do</h2>
            <p>
              IBPA organizes and supports a variety of community events throughout the year, 
              including our flagship Irwin Car Cruise, seasonal festivals, farmers markets, 
              and holiday celebrations. We also advocate for local businesses, provide networking 
              opportunities, and work with local government on initiatives that benefit the 
              downtown area.
            </p>

            <h2>Our History</h2>
            <p>
              Founded in the early 1990s, IBPA began as a small group of local business owners 
              who wanted to revitalize Downtown Irwin. Over the decades, we've grown into a 
              thriving organization that brings together businesses, residents, and community 
              leaders to make Irwin a great place to live, work, and visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the catalyst for a vibrant, prosperous, and connected Downtown Irwin 
                  that serves as the heart of our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Our Values</h3>
                <p className="text-muted-foreground">
                  Community, collaboration, inclusivity, and a commitment to preserving 
                  the unique character of Downtown Irwin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Membership</h3>
                <p className="text-muted-foreground">
                  IBPA membership is open to all businesses and professionals in the Irwin area. 
                  Join us to connect, grow, and contribute to our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Local Impact</h3>
                <p className="text-muted-foreground">
                  Through our events and initiatives, we generate thousands of visitors 
                  annually, supporting local businesses and the broader economy.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a business owner looking to join IBPA, a community member 
              interested in volunteering, or a potential sponsor, we'd love to hear from you.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover-elevate"
              data-testid="link-contact-about"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
