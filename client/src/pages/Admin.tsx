import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { AdminData, Announcement, FeaturedEvent } from "@shared/types";
import { SEO } from "@/components/SEO";

function LoginForm({ onLogin }: { onLogin: (passcode: string) => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (response.ok) {
        onLogin(passcode);
      } else {
        setError("Invalid passcode. Please try again.");
      }
    } catch {
      setError("Error verifying passcode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Enter Admin Passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode"
                data-testid="input-admin-passcode"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-admin-login">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard({ passcode }: { passcode: string }) {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);

  const { data, isLoading } = useQuery<AdminData>({
    queryKey: ['/api/admin/data'],
  });

  useEffect(() => {
    if (data) {
      setAnnouncements(data.announcements || []);
      setFeaturedEvents(data.featuredEvents || []);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (data: AdminData) => {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Passcode': passcode,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/data'] });
      toast({
        title: "Saved!",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ announcements, featuredEvents });
  };

  const addAnnouncement = () => {
    setAnnouncements([
      ...announcements,
      { id: Date.now().toString(), title: "", content: "", active: true },
    ]);
  };

  const updateAnnouncement = (id: string, field: keyof Announcement, value: string | boolean) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const addFeaturedEvent = () => {
    setFeaturedEvents([
      ...featuredEvents,
      { id: Date.now().toString(), title: "", date: "", description: "" },
    ]);
  };

  const updateFeaturedEvent = (id: string, field: keyof FeaturedEvent, value: string) => {
    setFeaturedEvents(featuredEvents.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const deleteFeaturedEvent = (id: string) => {
    setFeaturedEvents(featuredEvents.filter(e => e.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-admin-save">
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>

        <div className="bg-accent rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong>Note:</strong> Changes are saved to local JSON storage. For production, 
          integrate with Google Sheets API to persist data externally.
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Homepage Announcements</CardTitle>
              <Button variant="outline" size="sm" onClick={addAnnouncement} data-testid="button-add-announcement">
                <Plus className="h-4 w-4 mr-2" />
                Add Announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No announcements yet. Add one to display on the homepage.
                </p>
              ) : (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={announcement.active}
                            onCheckedChange={(checked) => 
                              updateAnnouncement(announcement.id, 'active', checked)
                            }
                            data-testid={`switch-announcement-${announcement.id}`}
                          />
                          <Label className="text-sm">Active</Label>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteAnnouncement(announcement.id)}
                          data-testid={`button-delete-announcement-${announcement.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        value={announcement.title}
                        onChange={(e) => updateAnnouncement(announcement.id, 'title', e.target.value)}
                        placeholder="Announcement Title"
                        data-testid={`input-announcement-title-${announcement.id}`}
                      />
                      <Textarea
                        value={announcement.content}
                        onChange={(e) => updateAnnouncement(announcement.id, 'content', e.target.value)}
                        placeholder="Announcement Content"
                        rows={2}
                        data-testid={`input-announcement-content-${announcement.id}`}
                      />
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Featured Events</CardTitle>
              <Button variant="outline" size="sm" onClick={addFeaturedEvent} data-testid="button-add-featured-event">
                <Plus className="h-4 w-4 mr-2" />
                Add Featured Event
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No featured events yet. Add one to highlight on the homepage.
                </p>
              ) : (
                featuredEvents.map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteFeaturedEvent(event.id)}
                          data-testid={`button-delete-event-${event.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          value={event.title}
                          onChange={(e) => updateFeaturedEvent(event.id, 'title', e.target.value)}
                          placeholder="Event Title"
                          data-testid={`input-event-title-${event.id}`}
                        />
                        <Input
                          value={event.date}
                          onChange={(e) => updateFeaturedEvent(event.id, 'date', e.target.value)}
                          placeholder="Event Date (e.g., June 15, 2026)"
                          data-testid={`input-event-date-${event.id}`}
                        />
                      </div>
                      <Textarea
                        value={event.description}
                        onChange={(e) => updateFeaturedEvent(event.id, 'description', e.target.value)}
                        placeholder="Event Description"
                        rows={2}
                        data-testid={`input-event-description-${event.id}`}
                      />
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [passcode, setPasscode] = useState<string | null>(null);

  if (!passcode) {
    return (
      <div className="py-12 md:py-16">
        <SEO 
          title="Admin" 
          description="Admin panel for Downtown Irwin website management."
          path="/admin"
        />
        <div className="container mx-auto px-4">
          <LoginForm onLogin={setPasscode} />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="Manage announcements and featured events for Downtown Irwin website."
        path="/admin"
      />
      <AdminDashboard passcode={passcode} />
    </>
  );
}
