import { Link } from "wouter";
import { IBPA_INFO } from "@/lib/constants";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs font-serif">DI</span>
              </div>
              <div>
                <p className="font-bold text-sm">Downtown Irwin</p>
                <p className="text-xs text-muted-foreground">Pennsylvania</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {IBPA_INFO.tagline}. An all-volunteer organization creating vibrant Main Street experiences for everyone.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-events">Events</Link>
              <Link href="/car-cruise" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-carcruise">Car Cruise</Link>
              <Link href="/car-cruise/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-register">Vehicle Registration</Link>
              <Link href="/sponsorship" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-sponsors">Sponsorship</Link>
              <Link href="/businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-directory">Business Directory</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">About IBPA</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{IBPA_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{IBPA_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{IBPA_INFO.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Irwin Business & Professional Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
