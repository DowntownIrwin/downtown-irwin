import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Mail, Phone, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
  { href: "/vendors", label: "Vendors" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/car-cruise", label: "Irwin Car Cruise" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <span
        onClick={onClick}
        className={`text-sm font-medium transition-colors cursor-pointer ${
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {label}
      </span>
    </Link>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer" data-testid="logo-home-link">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary leading-tight">Downtown Irwin</span>
                <span className="text-xs text-muted-foreground leading-tight">IBPA</span>
              </div>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <div>
                      <NavLink
                        href={link.href}
                        label={link.label}
                        onClick={() => setIsOpen(false)}
                      />
                    </div>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Downtown Irwin / IBPA</h3>
            <p className="text-sm text-muted-foreground">
              The Irwin Business & Professional Association promotes community growth 
              and brings neighbors together through events and local commerce.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about"><span className="text-muted-foreground hover:text-foreground cursor-pointer">About Us</span></Link></li>
              <li><Link href="/events"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Events</span></Link></li>
              <li><Link href="/car-cruise"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Irwin Car Cruise</span></Link></li>
              <li><Link href="/vendors"><span className="text-muted-foreground hover:text-foreground cursor-pointer">Become a Vendor</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Main Street, Irwin, PA 15642</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@downtownirwin.com" className="hover:text-foreground">
                  info@downtownirwin.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+17247777777" className="hover:text-foreground">
                  (724) 777-7777
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/downtownirwin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/downtownirwin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Downtown Irwin / IBPA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
