import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  Calendar,
  Car,
  Handshake,
  Building2,
  Info,
  Mail,
  ClipboardList,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { IBPA_INFO } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/businesses", label: "Business Directory", icon: Building2 },
  { href: "/about", label: "About IBPA", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

const carCruiseNav = [
  { href: "/car-cruise", label: "Car Cruise", icon: Car },
  { href: "/car-cruise/register", label: "Register Vehicle", icon: ClipboardList },
  { href: "/sponsorship", label: "Sponsorship", icon: Handshake },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" data-testid="link-sidebar-logo">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm font-serif">DI</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Downtown Irwin</p>
              <p className="text-xs text-muted-foreground leading-tight">Pennsylvania</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Car Cruise 2026</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {carCruiseNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.startsWith("/admin")}
                  data-testid="sidebar-link-admin"
                >
                  <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
                    <Shield className="w-4 h-4" />
                    <span>{isAuthenticated ? "Dashboard" : "Admin Login"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{IBPA_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 shrink-0" />
            <span>{IBPA_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 shrink-0" />
            <span>{IBPA_INFO.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
