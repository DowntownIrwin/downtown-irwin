import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Events from "@/pages/events";
import NightMarket from "@/pages/night-market";
import StreetMarket from "@/pages/street-market";
import CarCruise from "@/pages/car-cruise";
import CarCruiseRegister from "@/pages/car-cruise-register";
import Sponsorship from "@/pages/sponsorship";
import Businesses from "@/pages/businesses";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/night-market" component={NightMarket} />
      <Route path="/night-market/register" component={NightMarket} />
      <Route path="/street-market" component={StreetMarket} />
      <Route path="/street-market/register" component={StreetMarket} />
      <Route path="/car-cruise" component={CarCruise} />
      <Route path="/car-cruise/register" component={CarCruiseRegister} />
      <Route path="/sponsorship" component={Sponsorship} />
      <Route path="/businesses" component={Businesses} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navigation />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppLayout />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
