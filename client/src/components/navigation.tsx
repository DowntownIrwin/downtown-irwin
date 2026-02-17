import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import {
  Menu,
  Sun,
  Moon,
  Home,
  Calendar,
  Building2,
  Info,
  Mail,
  ChevronDown,
  ExternalLink,
  Moon as MoonIcon,
  ShoppingBag,
  Store,
  Shield,
} from "lucide-react";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/businesses", label: "Directory", icon: Building2 },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

const eventItems = [
  { href: "https://irwincarcruise.org", label: "Car Cruise", icon: Calendar, external: true },
  { href: "/night-market", label: "Night Market", icon: MoonIcon, external: false },
  { href: "/street-market", label: "Street Market", icon: Store, external: false },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const isEventsActive = location.startsWith("/night-market") || location.startsWith("/street-market");

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
          {mainNavItems.filter(i => i.href === "/").map((item) => (
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

          <Link href="/events">
            <Button
              variant={location === "/events" ? "secondary" : "ghost"}
              size="sm"
              data-testid="nav-link-events"
              className={location === "/events" ? "font-semibold" : ""}
            >
              Events
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isEventsActive ? "secondary" : "ghost"}
                size="sm"
                data-testid="nav-dropdown-event-programs"
                className={isEventsActive ? "font-semibold" : ""}
              >
                Event Programs
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {eventItems.map((item) => (
                item.external ? (
                  <DropdownMenuItem key={item.href} asChild>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      data-testid={`nav-event-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2"
                      data-testid={`nav-event-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {mainNavItems.filter(i => i.href !== "/").map((item) => (
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
          <div className="hidden lg:block">
            <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
              <Button
                variant={location.startsWith("/admin") ? "secondary" : "ghost"}
                size="sm"
                data-testid="nav-link-admin"
              >
                <Shield className="w-4 h-4 mr-1" />
                {isAuthenticated ? "Dashboard" : "Admin"}
              </Button>
            </Link>
          </div>

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
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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
                    <Link href="/" onClick={() => setOpen(false)}>
                      <Button
                        variant={location === "/" ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 ${location === "/" ? "font-semibold" : ""}`}
                        data-testid="mobile-nav-home"
                      >
                        <Home className="w-4 h-4" />
                        Home
                      </Button>
                    </Link>

                    <Link href="/events" onClick={() => setOpen(false)}>
                      <Button
                        variant={location === "/events" ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 ${location === "/events" ? "font-semibold" : ""}`}
                        data-testid="mobile-nav-events"
                      >
                        <Calendar className="w-4 h-4" />
                        Events
                      </Button>
                    </Link>

                    <div className="pl-4 flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-2">
                        Event Programs
                      </p>
                      {eventItems.map((item) => (
                        item.external ? (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-3"
                              data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </Button>
                          </a>
                        ) : (
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
                        )
                      ))}
                    </div>

                    {mainNavItems.filter(i => i.href !== "/").map((item) => (
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

                    <div className="border-t my-2" />

                    <Link href={isAuthenticated ? "/admin" : "/admin/login"} onClick={() => setOpen(false)}>
                      <Button
                        variant={location.startsWith("/admin") ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 ${location.startsWith("/admin") ? "font-semibold" : ""}`}
                        data-testid="mobile-nav-admin"
                      >
                        <Shield className="w-4 h-4" />
                        {isAuthenticated ? "Dashboard" : "Admin"}
                      </Button>
                    </Link>
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
