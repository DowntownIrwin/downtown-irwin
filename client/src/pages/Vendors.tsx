import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, FileText, CheckCircle, ExternalLink } from "lucide-react";
import { EXTERNAL_URLS } from "@shared/types";
import { SEO } from "@/components/SEO";

export default function Vendors() {
  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Become a Vendor" 
        description="Join Downtown Irwin community events as a vendor! Apply to sell at the Irwin Car Cruise, farmers markets, and seasonal festivals."
        path="/vendors"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Vendor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community events as a vendor! Whether you're selling handmade crafts, 
            delicious food, or unique products, we'd love to have you at our events.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Vendor Information</h2>
              <p className="text-muted-foreground mb-6">
                Downtown Irwin / IBPA hosts multiple events throughout the year where 
                vendors can showcase their products and services to our community. 
                Our events draw thousands of visitors, providing excellent exposure 
                for your business.
              </p>
              <h3 className="font-semibold mb-3">Available Events:</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Irwin Car Cruise (Annual)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Spring Festival</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Summer Farmers Market (Weekly)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Fall Harvest Festival</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Holiday Market</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
              <p className="text-muted-foreground mb-6">
                Ready to join us? Complete our vendor application form to get started. 
                Our team will review your application and get back to you with next steps.
              </p>
              
              <div className="bg-accent rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2 text-sm">Which event are you applying for?</h4>
                <p className="text-sm text-muted-foreground">
                  When completing the application, please specify which event(s) you'd 
                  like to participate in. Each event has different booth sizes, pricing, 
                  and requirements. Our team will provide event-specific details after 
                  reviewing your application.
                </p>
              </div>

              <h3 className="font-semibold mb-3">Application Requirements:</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Business name and contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Description of products/services</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Photos of your booth/products (recommended)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Valid business license (if applicable)</span>
                </li>
              </ul>

              <a 
                href={EXTERNAL_URLS.vendorSignupForm}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full" data-testid="button-vendor-apply">
                  Apply to Be a Vendor
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Opens external application form
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Vending?</h2>
            <p className="opacity-90 mb-6 max-w-2xl mx-auto">
              Our vendor coordinator is here to help! Contact us with any questions 
              about booth fees, setup requirements, or event details.
            </p>
            <a href="/contact">
              <Button variant="secondary" size="lg" data-testid="button-vendor-contact">
                Contact Vendor Coordinator
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
