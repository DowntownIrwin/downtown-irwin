import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Event, Business, Sponsor, VehicleRegistration, ContactMessage, SponsorshipInquiry, PhotoAlbum, AlbumPhoto, VendorRegistration } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import {
  Calendar,
  Building2,
  Handshake,
  Car,
  Mail,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Upload,
  ClipboardList,
  Image,
  Github,
  ExternalLink,
  Loader2,
  CalendarIcon,
  Link,
  Store,
  Check,
  X,
} from "lucide-react";

type Tab = "events" | "businesses" | "sponsors" | "registrations" | "vendors" | "messages" | "inquiries" | "albums" | "github";

export default function Admin() {
  usePageTitle("Admin Dashboard");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("events");

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const tabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
    { key: "events", label: "Events", icon: Calendar },
    { key: "businesses", label: "Businesses", icon: Building2 },
    { key: "sponsors", label: "Sponsors", icon: Handshake },
    { key: "registrations", label: "Registrations", icon: Car },
    { key: "vendors", label: "Vendors", icon: Store },
    { key: "inquiries", label: "Inquiries", icon: ClipboardList },
    { key: "messages", label: "Messages", icon: Mail },
    { key: "albums", label: "Photo Albums", icon: Image },
    { key: "github", label: "GitHub", icon: Github },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Logged in as {user?.username}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
            data-testid={`tab-${tab.key}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "events" && <EventsManager />}
      {activeTab === "businesses" && <BusinessesManager />}
      {activeTab === "sponsors" && <SponsorsManager />}
      {activeTab === "registrations" && <RegistrationsViewer />}
      {activeTab === "vendors" && <VendorRegistrationsManager />}
      {activeTab === "inquiries" && <InquiriesViewer />}
      {activeTab === "messages" && <MessagesViewer />}
      {activeTab === "albums" && <PhotoAlbumsManager />}
      {activeTab === "github" && <GitHubManager />}
    </div>
  );
}

function ImageUploader({ currentUrl, onUpload }: { currentUrl?: string | null; onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onUpload(url);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {currentUrl && (
        <img src={currentUrl} alt="Current" className="w-24 h-24 object-cover rounded-md" />
      )}
      <Label className="flex items-center gap-2 cursor-pointer">
        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
          <span>
            <Upload className="w-3 h-3 mr-1" />
            {uploading ? "Uploading..." : "Upload Image"}
          </span>
        </Button>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} data-testid="input-image-upload" />
      </Label>
    </div>
  );
}

function EventsManager() {
  const { toast } = useToast();
  const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted" });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Events ({events?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(true)} data-testid="button-add-event">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      <div className="space-y-3">
        {events?.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold" data-testid={`text-event-title-${event.id}`}>{event.title}</h3>
                  <Badge variant="secondary">{event.category}</Badge>
                  {event.featured && <Badge>Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{event.date} | {event.time}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                {event.externalLink && (
                  <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline">
                    <Link className="w-3 h-3" /> {event.externalLink}
                  </a>
                )}
                {event.imageUrl && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Image className="w-3 h-3" /> Has image
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingEvent(event)} data-testid={`button-edit-event-${event.id}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete this event?")) deleteMutation.mutate(event.id); }}
                  data-testid={`button-delete-event-${event.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreate && (
        <EventFormDialog event={null} onClose={() => setShowCreate(false)} />
      )}
      {editingEvent && (
        <EventFormDialog event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
    </div>
  );
}

function EventFormDialog({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEditing = !!event;
  const [form, setForm] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    date: event?.date ?? "",
    time: event?.time ?? "",
    location: event?.location ?? "Main Street, Downtown Irwin",
    category: event?.category ?? "Community",
    featured: event?.featured ?? false,
    imageUrl: event?.imageUrl ?? "",
    externalLink: event?.externalLink ?? "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  function parseExistingDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    try {
      const cleaned = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "");
      const parsed = parse(cleaned, "MMMM d, yyyy", new Date());
      if (!isNaN(parsed.getTime())) return parsed;
      const parsed2 = new Date(dateStr);
      if (!isNaN(parsed2.getTime())) return parsed2;
    } catch {}
    return undefined;
  }

  const selectedDate = parseExistingDate(form.date);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        await apiRequest("PATCH", `/api/admin/events/${event.id}`, form);
      } else {
        await apiRequest("POST", "/api/admin/events", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: isEditing ? "Event updated" : "Event created" });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Failed to save event: " + error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-event-dialog-title">{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="input-event-title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea id="event-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required data-testid="input-event-description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    data-testid="input-event-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.date || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => {
                      if (day) {
                        const formatted = format(day, "EEEE, MMMM d, yyyy");
                        setForm({ ...form, date: formatted });
                      }
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    data-testid="calendar-event-date"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="12:00 PM - 4:00 PM" required data-testid="input-event-time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required data-testid="input-event-location" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="select-event-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Car Show", "Shopping", "Holiday", "Festival", "Community"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded"
                  data-testid="input-event-featured"
                />
                <span className="text-sm">Featured Event</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>External Link</Label>
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={form.externalLink}
                onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
                placeholder="https://example.com/event-page"
                data-testid="input-event-external-link"
              />
            </div>
            <p className="text-xs text-muted-foreground">Optional link to an external website for this event</p>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUploader
              currentUrl={form.imageUrl || null}
              onUpload={(url) => setForm({ ...form, imageUrl: url })}
            />
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Or enter image URL"
              data-testid="input-event-image-url"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-event">
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BusinessesManager() {
  const { toast } = useToast();
  const { data: businesses, isLoading } = useQuery<Business[]>({ queryKey: ["/api/businesses"] });
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/businesses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business deleted" });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Businesses ({businesses?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(true)} data-testid="button-add-business">
          <Plus className="w-4 h-4 mr-2" /> Add Business
        </Button>
      </div>

      <div className="space-y-3">
        {businesses?.map((biz) => (
          <Card key={biz.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold" data-testid={`text-business-name-${biz.id}`}>{biz.name}</h3>
                  <Badge variant="secondary">{biz.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{biz.address}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingBusiness(biz)} data-testid={`button-edit-business-${biz.id}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete this business?")) deleteMutation.mutate(biz.id); }}
                  data-testid={`button-delete-business-${biz.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreate && <BusinessFormDialog business={null} onClose={() => setShowCreate(false)} />}
      {editingBusiness && <BusinessFormDialog business={editingBusiness} onClose={() => setEditingBusiness(null)} />}
    </div>
  );
}

function BusinessFormDialog({ business, onClose }: { business: Business | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEditing = !!business;
  const [form, setForm] = useState({
    name: business?.name ?? "",
    description: business?.description ?? "",
    address: business?.address ?? "",
    phone: business?.phone ?? "",
    website: business?.website ?? "",
    category: business?.category ?? "Retail",
    imageUrl: business?.imageUrl ?? "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        await apiRequest("PATCH", `/api/admin/businesses/${business.id}`, form);
      } else {
        await apiRequest("POST", "/api/admin/businesses", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: isEditing ? "Business updated" : "Business created" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to save business", variant: "destructive" });
    },
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Business" : "Add Business"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="input-business-name" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required data-testid="input-business-description" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required data-testid="input-business-address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="input-business-phone" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="select-business-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Retail", "Restaurant", "Entertainment", "Services", "Health & Wellness"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." data-testid="input-business-website" />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUploader
              currentUrl={form.imageUrl || null}
              onUpload={(url) => setForm({ ...form, imageUrl: url })}
            />
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Or enter image URL"
              data-testid="input-business-image-url"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-business">
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SponsorsManager() {
  const { toast } = useToast();
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({ queryKey: ["/api/sponsors"] });
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/sponsors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sponsors"] });
      toast({ title: "Sponsor deleted" });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Sponsors ({sponsors?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(true)} data-testid="button-add-sponsor">
          <Plus className="w-4 h-4 mr-2" /> Add Sponsor
        </Button>
      </div>

      <div className="space-y-3">
        {sponsors?.map((sponsor) => (
          <Card key={sponsor.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold" data-testid={`text-sponsor-name-${sponsor.id}`}>{sponsor.name}</h3>
                  <Badge variant="secondary">{sponsor.level}</Badge>
                  {sponsor.eventType && (
                    <Badge variant="outline">{sponsor.eventType === "car-cruise" ? "Car Cruise" : sponsor.eventType === "night-market" ? "Night Market" : sponsor.eventType === "street-market" ? "Street Market" : "General"}</Badge>
                  )}
                </div>
                {sponsor.websiteUrl && (
                  <p className="text-sm text-muted-foreground">{sponsor.websiteUrl}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingSponsor(sponsor)} data-testid={`button-edit-sponsor-${sponsor.id}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete this sponsor?")) deleteMutation.mutate(sponsor.id); }}
                  data-testid={`button-delete-sponsor-${sponsor.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreate && <SponsorFormDialog sponsor={null} onClose={() => setShowCreate(false)} />}
      {editingSponsor && <SponsorFormDialog sponsor={editingSponsor} onClose={() => setEditingSponsor(null)} />}
    </div>
  );
}

function SponsorFormDialog({ sponsor, onClose }: { sponsor: Sponsor | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEditing = !!sponsor;
  const [form, setForm] = useState({
    name: sponsor?.name ?? "",
    level: sponsor?.level ?? "Supporting",
    logoUrl: sponsor?.logoUrl ?? "",
    websiteUrl: sponsor?.websiteUrl ?? "",
    eventType: sponsor?.eventType ?? "car-cruise",
    sponsorImageUrl: sponsor?.sponsorImageUrl ?? "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        await apiRequest("PATCH", `/api/admin/sponsors/${sponsor.id}`, form);
      } else {
        await apiRequest("POST", "/api/admin/sponsors", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sponsors"] });
      toast({ title: isEditing ? "Sponsor updated" : "Sponsor created" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to save sponsor", variant: "destructive" });
    },
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="input-sponsor-name" />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger data-testid="select-sponsor-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Supporting", "Silver", "Gold", "Platinum"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Event</Label>
            <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
              <SelectTrigger data-testid="select-sponsor-event-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car-cruise">Car Cruise</SelectItem>
                <SelectItem value="night-market">Night Market</SelectItem>
                <SelectItem value="street-market">Street Market</SelectItem>
                <SelectItem value="general">General / IBPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://..." data-testid="input-sponsor-website" />
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUploader
              currentUrl={form.logoUrl || null}
              onUpload={(url) => setForm({ ...form, logoUrl: url })}
            />
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="Or enter logo URL"
              data-testid="input-sponsor-logo-url"
            />
          </div>
          <div className="space-y-2">
            <Label>Sponsor Image</Label>
            <ImageUploader
              currentUrl={form.sponsorImageUrl || null}
              onUpload={(url) => setForm({ ...form, sponsorImageUrl: url })}
            />
            <Input
              value={form.sponsorImageUrl}
              onChange={(e) => setForm({ ...form, sponsorImageUrl: e.target.value })}
              placeholder="Optional sponsor image URL"
              data-testid="input-sponsor-image-url"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-sponsor">
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Sponsor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RegistrationsViewer() {
  const { data: registrations, isLoading } = useQuery<VehicleRegistration[]>({
    queryKey: ["/api/admin/vehicle-registrations"],
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Vehicle Registrations ({registrations?.length ?? 0})</h2>
      {registrations?.length === 0 && (
        <p className="text-muted-foreground">No vehicle registrations yet.</p>
      )}
      <div className="space-y-3">
        {registrations?.map((reg) => (
          <Card key={reg.id} className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">{reg.firstName} {reg.lastName}</span>
                <p className="text-muted-foreground">{reg.email} | {reg.phone}</p>
              </div>
              <div>
                <span className="font-medium">{reg.vehicleYear} {reg.vehicleMake} {reg.vehicleModel}</span>
                <p className="text-muted-foreground">{reg.vehicleColor} | Class: {reg.vehicleClass}</p>
              </div>
              {reg.specialRequests && (
                <p className="text-muted-foreground col-span-full">Notes: {reg.specialRequests}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VendorRegistrationsManager() {
  const { toast } = useToast();
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: vendors, isLoading } = useQuery<VendorRegistration[]>({
    queryKey: ["/api/admin/vendor-registrations"],
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/vendor-registrations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendor-registrations"] });
      toast({ title: "Vendor status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/vendor-registrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendor-registrations"] });
      toast({ title: "Vendor registration deleted" });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const filtered = vendors?.filter((v) => {
    if (eventFilter !== "all" && v.eventType !== eventFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    return true;
  }) ?? [];

  const pendingCount = vendors?.filter((v) => v.status === "pending").length ?? 0;

  const statusColor = (status: string) => {
    if (status === "approved") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (status === "denied") return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "";
  };

  const eventLabel = (type: string) => {
    if (type === "night-market") return "Night Market";
    if (type === "street-market") return "Street Market";
    return type;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-vendors-title">
            Vendor Registrations ({vendors?.length ?? 0})
          </h2>
          {pendingCount > 0 && (
            <p className="text-sm text-muted-foreground">{pendingCount} pending review</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-vendor-event-filter">
            <SelectValue placeholder="Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="night-market">Night Market</SelectItem>
            <SelectItem value="street-market">Street Market</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]" data-testid="select-vendor-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground">No vendor registrations found.</p>
      )}

      <div className="space-y-3">
        {filtered.map((vendor) => (
          <Card key={vendor.id} className="p-4" data-testid={`card-vendor-${vendor.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold" data-testid={`text-vendor-name-${vendor.id}`}>
                    {vendor.businessName}
                  </h3>
                  <Badge variant="secondary">{eventLabel(vendor.eventType)}</Badge>
                  <Badge variant="secondary">{vendor.vendorCategory}</Badge>
                  <Badge className={statusColor(vendor.status)}>
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {vendor.contactName} | {vendor.email} | {vendor.phone}
                </p>
                <p className="text-sm">{vendor.description}</p>
                {vendor.specialRequests && (
                  <p className="text-sm text-muted-foreground">Notes: {vendor.specialRequests}</p>
                )}
              </div>
              <div className="flex gap-2">
                {vendor.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => statusMutation.mutate({ id: vendor.id, status: "approved" })}
                      disabled={statusMutation.isPending}
                      data-testid={`button-approve-vendor-${vendor.id}`}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => statusMutation.mutate({ id: vendor.id, status: "denied" })}
                      disabled={statusMutation.isPending}
                      data-testid={`button-deny-vendor-${vendor.id}`}
                    >
                      <X className="w-4 h-4 mr-1" /> Deny
                    </Button>
                  </>
                )}
                {vendor.status !== "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => statusMutation.mutate({ id: vendor.id, status: "pending" })}
                    disabled={statusMutation.isPending}
                    data-testid={`button-reset-vendor-${vendor.id}`}
                  >
                    Reset to Pending
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete this vendor registration?")) deleteMutation.mutate(vendor.id); }}
                  data-testid={`button-delete-vendor-${vendor.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InquiriesViewer() {
  const { data: inquiries, isLoading } = useQuery<SponsorshipInquiry[]>({
    queryKey: ["/api/admin/sponsorship-inquiries"],
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sponsorship Inquiries ({inquiries?.length ?? 0})</h2>
      {inquiries?.length === 0 && (
        <p className="text-muted-foreground">No sponsorship inquiries yet.</p>
      )}
      <div className="space-y-3">
        {inquiries?.map((inq) => (
          <Card key={inq.id} className="p-4">
            <div className="text-sm">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-medium">{inq.businessName}</span>
                <Badge variant="secondary">{inq.level}</Badge>
              </div>
              <p className="text-muted-foreground">{inq.contactName} | {inq.email} | {inq.phone}</p>
              {inq.message && <p className="text-muted-foreground mt-1">{inq.message}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MessagesViewer() {
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contact-messages"],
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Contact Messages ({messages?.length ?? 0})</h2>
      {messages?.length === 0 && (
        <p className="text-muted-foreground">No contact messages yet.</p>
      )}
      <div className="space-y-3">
        {messages?.map((msg) => (
          <Card key={msg.id} className="p-4">
            <div className="text-sm">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-medium">{msg.name}</span>
                <Badge variant="secondary">{msg.subject}</Badge>
              </div>
              <p className="text-muted-foreground">{msg.email}</p>
              <p className="text-muted-foreground mt-1">{msg.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GitHubManager() {
  const { toast } = useToast();
  const [owner, setOwner] = useState("DowntownIrwin");
  const [repoName, setRepoName] = useState("downtown-irwin");
  const [description, setDescription] = useState("Downtown Irwin community web app - IBPA & Car Cruise");
  const [isPrivate, setIsPrivate] = useState(false);
  const [useExisting, setUseExisting] = useState(true);
  const [pushResult, setPushResult] = useState<{ repoUrl: string; filesCount: number } | null>(null);

  const { data: ghUser, isLoading: userLoading, error: userError } = useQuery<{ username: string; avatar: string; name: string }>({
    queryKey: ["/api/admin/github/user"],
  });

  const { data: repos, isLoading: reposLoading } = useQuery<{ name: string; full_name: string; html_url: string; private: boolean; description: string }[]>({
    queryKey: ["/api/admin/github/repos"],
    enabled: !!ghUser,
  });

  const pushMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/github/push", { repoName, description, isPrivate, useExisting, owner });
      return res.json();
    },
    onSuccess: (data) => {
      setPushResult(data);
      toast({ title: `Pushed ${data.filesCount} files to GitHub` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/github/repos"] });
    },
    onError: (error: Error) => {
      toast({ title: "Push failed: " + error.message, variant: "destructive" });
    },
  });

  if (userLoading) return <Skeleton className="h-64 w-full" />;

  if (userError) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">GitHub Integration</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">Could not connect to GitHub. Make sure the GitHub connection is set up properly.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold" data-testid="text-github-title">GitHub Integration</h2>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {ghUser?.avatar && (
            <img src={ghUser.avatar} alt="" className="w-10 h-10 rounded-full" data-testid="img-github-avatar" />
          )}
          <div>
            <p className="font-medium" data-testid="text-github-username">{ghUser?.name || ghUser?.username}</p>
            <p className="text-sm text-muted-foreground">@{ghUser?.username}</p>
          </div>
          <Badge variant="secondary">Connected</Badge>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-medium">Push to GitHub Repository</h3>
        <p className="text-sm text-muted-foreground">
          Push all project files to a GitHub repository. You can create a new repo or push to an existing one.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={!useExisting ? "default" : "outline"}
            size="sm"
            onClick={() => setUseExisting(false)}
            data-testid="button-new-repo"
          >
            Create New Repo
          </Button>
          <Button
            variant={useExisting ? "default" : "outline"}
            size="sm"
            onClick={() => setUseExisting(true)}
            data-testid="button-existing-repo"
          >
            Use Existing Repo
          </Button>
        </div>

        {useExisting ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="owner-name">Owner (username or organization)</Label>
              <Input
                id="owner-name"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="DowntownIrwin"
                data-testid="input-owner-name"
              />
              <p className="text-xs text-muted-foreground">For organization repos, enter the org name (e.g. "DowntownIrwin")</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-name-existing">Repository Name</Label>
              <Input
                id="repo-name-existing"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="downtown-irwin"
                data-testid="input-repo-name-existing"
              />
            </div>
            <Card className="p-3 border-dashed">
              <p className="text-sm text-muted-foreground">
                Will push to: <span className="font-medium text-foreground">github.com/{owner}/{repoName}</span>
              </p>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="owner-new">Owner (username or organization)</Label>
              <Input
                id="owner-new"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="DowntownIrwin"
                data-testid="input-owner-new"
              />
              <p className="text-xs text-muted-foreground">Leave as your username for personal repos, or enter an org name</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="downtown-irwin"
                data-testid="input-repo-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-desc">Description</Label>
              <Input
                id="repo-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
                data-testid="input-repo-description"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="private-repo"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked === true)}
                data-testid="checkbox-private-repo"
              />
              <Label htmlFor="private-repo" className="text-sm">Private repository</Label>
            </div>
          </div>
        )}

        <Button
          onClick={() => pushMutation.mutate()}
          disabled={pushMutation.isPending || !repoName}
          data-testid="button-push-github"
        >
          {pushMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Pushing to GitHub...
            </>
          ) : (
            <>
              <Github className="w-4 h-4 mr-2" />
              Push to GitHub
            </>
          )}
        </Button>

        {pushResult && (
          <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <p className="font-medium text-green-700 dark:text-green-300">
              Successfully pushed {pushResult.filesCount} files
            </p>
            <a
              href={pushResult.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1"
              data-testid="link-github-repo"
            >
              <ExternalLink className="w-3 h-3" />
              {pushResult.repoUrl}
            </a>
          </Card>
        )}
      </Card>

      {repos && repos.length > 0 && (
        <Card className="p-6 space-y-3">
          <h3 className="font-medium">Your Repositories</h3>
          <div className="space-y-2">
            {repos.slice(0, 10).map((repo) => (
              <div key={repo.name} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md hover-elevate">
                <div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium flex items-center gap-1"
                    data-testid={`link-repo-${repo.name}`}
                  >
                    {repo.full_name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground">{repo.description}</p>
                  )}
                </div>
                <Badge variant="secondary">{repo.private ? "Private" : "Public"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function PhotoAlbumsManager() {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<PhotoAlbum | null>(null);

  const { data: albums, isLoading } = useQuery<PhotoAlbum[]>({
    queryKey: ["/api/photo-albums"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/photo-albums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums"] });
      toast({ title: "Album deleted" });
      if (selectedAlbum) setSelectedAlbum(null);
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (selectedAlbum) {
    return <AlbumPhotosManager album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Photo Albums ({albums?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(true)} data-testid="button-add-album">
          <Plus className="w-4 h-4 mr-2" /> Create Album
        </Button>
      </div>

      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-visible" data-testid={`card-album-${album.id}`}>
              <div className="overflow-hidden rounded-t-md cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                {album.coverPhotoUrl ? (
                  <img src={album.coverPhotoUrl} alt={album.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold" data-testid={`text-album-title-${album.id}`}>{album.title}</h3>
                  {album.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{album.description}</p>}
                </div>
              </div>
              <div className="px-4 pb-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditingAlbum(album); }} data-testid={`button-edit-album-${album.id}`}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this album and all its photos?")) deleteMutation.mutate(album.id); }} data-testid={`button-delete-album-${album.id}`}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Image className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-1">No Photo Albums</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first album to start uploading photos from past events.</p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Album
          </Button>
        </Card>
      )}

      {showCreate && (
        <AlbumFormDialog album={null} onClose={() => setShowCreate(false)} />
      )}
      {editingAlbum && (
        <AlbumFormDialog album={editingAlbum} onClose={() => setEditingAlbum(null)} />
      )}
    </div>
  );
}

function AlbumFormDialog({ album, onClose }: { album: PhotoAlbum | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEditing = !!album;
  const [form, setForm] = useState({
    title: album?.title ?? "",
    description: album?.description ?? "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        await apiRequest("PATCH", `/api/admin/photo-albums/${album.id}`, form);
      } else {
        await apiRequest("POST", "/api/admin/photo-albums", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums"] });
      toast({ title: isEditing ? "Album updated" : "Album created" });
      onClose();
    },
    onError: (error) => {
      toast({ title: "Failed to save album: " + error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle data-testid="text-album-dialog-title">{isEditing ? "Edit Album" : "Create Album"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="album-title">Title</Label>
            <Input id="album-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Irwin Car Cruise 2025" required data-testid="input-album-title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="album-description">Description (optional)</Label>
            <Textarea id="album-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief description of this album" data-testid="input-album-description" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-album">
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Album"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AlbumPhotosManager({ album, onBack }: { album: PhotoAlbum; onBack: () => void }) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: photos, isLoading } = useQuery<AlbumPhoto[]>({
    queryKey: ["/api/photo-albums", album.id, "photos"],
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: number) => {
      await apiRequest("DELETE", `/api/admin/album-photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums", album.id, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums"] });
      toast({ title: "Photo deleted" });
    },
  });

  const uploadFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(f => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f.name));
    if (imageFiles.length === 0) {
      toast({ title: "No valid image files found", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach(f => formData.append("photos", f));

      const res = await fetch(`/api/admin/photo-albums/${album.id}/photos`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const newPhotos = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums", album.id, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photo-albums"] });
      toast({ title: `Uploaded ${newPhotos.length} photo${newPhotos.length !== 1 ? "s" : ""}` });
    } catch (error: any) {
      toast({ title: "Upload failed: " + error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back-to-albums">
          Back to Albums
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{album.title}</h2>
          {album.description && <p className="text-sm text-muted-foreground">{album.description}</p>}
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="drop-zone-photos"
      >
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading photos...</p>
          </div>
        ) : (
          <>
            <p className="font-medium mb-1">Drag and drop photos here</p>
            <p className="text-sm text-muted-foreground mb-3">or click to browse files</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} data-testid="button-browse-photos">
              Browse Files
            </Button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-photo-files"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-md" />)}
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-md overflow-hidden" data-testid={`photo-${photo.id}`}>
              <img src={photo.url} alt={photo.caption || "Album photo"} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Button
                  size="icon"
                  variant="outline"
                  className="invisible group-hover:visible bg-white/90 dark:bg-black/90"
                  onClick={() => { if (confirm("Delete this photo?")) deletePhotoMutation.mutate(photo.id); }}
                  data-testid={`button-delete-photo-${photo.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">No photos in this album yet. Drag and drop some photos above to get started.</p>
      )}
    </div>
  );
}
