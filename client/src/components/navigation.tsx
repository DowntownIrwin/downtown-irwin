import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import {
  Menu,
  Sun,
  Moon,
  Home,
  Calendar,
  Car,
  Handshake,
  Building2,
  Info,
  Mail,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/car-cruise", label: "Car Cruise", icon: Car },
  { href: "/sponsorship", label: "Sponsors", icon: Handshake },
  { href: "/businesses", label: "Directory", icon: Building2 },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" data-testid="link-home-logo">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-serif">DI</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm leading-tight">Downtown</p>
              <p className="text-xs text-muted-foreground leading-tight">Irwin, PA</p>
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                size="sm"
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                className={location === item.href ? "font-semibold" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm font-serif">DI</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">Downtown Irwin</p>
                      <p className="text-xs text-muted-foreground leading-tight">Pennsylvania</p>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                        <Button
                          variant={location === item.href ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 ${location === item.href ? "font-semibold" : ""}`}
                          data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
