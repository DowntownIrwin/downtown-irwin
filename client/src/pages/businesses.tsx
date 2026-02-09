import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Business } from "@shared/schema";
import { MapPin, Phone, Globe, Search, Store, Building2 } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

const categories = ["All", "Restaurant", "Retail", "Entertainment", "Services", "Health & Wellness"];

export default function Businesses() {
  usePageTitle("Business Directory", "Discover shops, restaurants, entertainment venues, and services in Downtown Irwin.");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  const filtered = businesses?.filter((b) => {
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    const matchesSearch = search === "" || b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Badge variant="secondary" className="mb-3">
            <Building2 className="w-3 h-3 mr-1" /> 50+ Businesses
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-directory-title">
            Business Directory
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover the shops, restaurants, entertainment venues, and services that make Downtown Irwin a vibrant destination.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-businesses"
            />
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-1" data-testid="tabs-business-categories">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} data-testid={`tab-biz-${cat.toLowerCase().replace(/\s/g, "-")}`}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-5 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((biz) => (
              <Card key={biz.id} className="p-5 hover-elevate" data-testid={`card-business-${biz.id}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-xs">{biz.category}</Badge>
                    <h3 className="font-semibold" data-testid={`text-business-name-${biz.id}`}>{biz.name}</h3>
                  </div>
                  <Store className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{biz.description}</p>
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {biz.address}
                  </span>
                  {biz.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {biz.phone}
                    </span>
                  )}
                  {biz.website && (
                    <a href={biz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Globe className="w-3.5 h-3.5 shrink-0" /> Visit Website
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Store className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No Businesses Found</h3>
            <p className="text-sm text-muted-foreground">
              {search ? `No results for "${search}".` : `No ${activeCategory} businesses listed yet.`}
            </p>
            {(search || activeCategory !== "All") && (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
