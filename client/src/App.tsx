import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Calendar from "@/pages/Calendar";
import Vendors from "@/pages/Vendors";
import Sponsors from "@/pages/Sponsors";
import CarCruise from "@/pages/CarCruise";
import StreetMarket from "@/pages/StreetMarket";
import NightMarket from "@/pages/NightMarket";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Galleries from "@/pages/Galleries";
import GalleryDetail from "@/pages/GalleryDetail";
import NotFound from "@/pages/not-found";
import Preview from "@/pages/Preview";

function AppRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/events" component={Events} />
        <Route path="/events/:slug" component={EventDetail} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/vendors" component={Vendors} />
        <Route path="/sponsors" component={Sponsors} />
        <Route path="/car-cruise" component={CarCruise} />
        <Route path="/street-market" component={StreetMarket} />
        <Route path="/night-market" component={NightMarket} />
        <Route path="/contact" component={Contact} />
        <Route path="/galleries" component={Galleries} />
        <Route path="/galleries/:slug" component={GalleryDetail} />
        <Route path="/preview/:type" component={Preview} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

const BASE_PATH = import.meta.env.PROD ? "/downtown-irwin" : "";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router base={BASE_PATH}>
          <Toaster />
          <AppRouter />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
