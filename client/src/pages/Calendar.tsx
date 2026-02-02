import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  List, 
  MapPin, 
  Clock,
  Users,
  ExternalLink,
  Ticket
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { getVisibleEvents, getEventUrls, getEffectiveStatus, shouldShowRegistrationButtons, type CMSEvent } from "@/lib/content";

type ViewMode = "month" | "list";
type StatusFilter = "all" | "open" | "upcoming" | "closed";
type CategoryFilter = "all" | "car-cruise" | "street-market" | "night-market" | "other";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStatusColor(status: string) {
  switch (status) {
    case "open": return "bg-green-500";
    case "upcoming": return "bg-blue-500";
    case "closed": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "open": return "default";
    case "upcoming": return "secondary";
    default: return "outline";
  }
}

function parseEventDate(dateStr: string): Date {
  return new Date(dateStr);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { 
    weekday: "long", 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function isEventOnDate(event: CMSEvent, date: Date): boolean {
  const startDate = parseEventDate(event.startDate);
  if (event.endDate) {
    const endDate = parseEventDate(event.endDate);
    return date >= startDate && date <= endDate;
  }
  return isSameDay(startDate, date);
}

function EventModal({ event, open, onClose }: { event: CMSEvent | null; open: boolean; onClose: () => void }) {
  if (!event) return null;
  
  const urls = getEventUrls(event);
  const startDate = parseEventDate(event.startDate);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            <Badge variant="outline">
              {event.eventType.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(startDate)}</span>
            </div>
            {event.timeText && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.timeText}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description.replace(/[#*_]/g, "")}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={`/events/${event.slug}`}>
              <Button size="sm" data-testid="button-event-details">
                View Details
              </Button>
            </Link>
            {urls.attendeeUrl && (
              <a href={urls.attendeeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" data-testid="button-register">
                  <Ticket className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </a>
            )}
            {urls.vendorUrl && (
              <a href={urls.vendorUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" data-testid="button-vendor">
                  <Users className="h-4 w-4 mr-1" />
                  Vendor
                </Button>
              </a>
            )}
            {urls.sponsorUrl && (
              <a href={urls.sponsorUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" data-testid="button-sponsor">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Sponsor
                </Button>
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MonthView({ 
  events, 
  currentDate, 
  onEventClick 
}: { 
  events: CMSEvent[]; 
  currentDate: Date;
  onEventClick: (event: CMSEvent) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const calendarDays: (Date | null)[] = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  
  const today = new Date();
  
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {DAYS.map(day => (
          <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dayEvents = date ? events.filter(e => isEventOnDate(e, date)) : [];
          const isToday = date && isSameDay(date, today);
          
          return (
            <div 
              key={index} 
              className={`min-h-[100px] md:min-h-[120px] p-1 md:p-2 border-b border-r ${
                date ? "bg-background" : "bg-muted/20"
              }`}
            >
              {date && (
                <>
                  <div className={`text-sm mb-1 ${
                    isToday 
                      ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold" 
                      : "text-muted-foreground"
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button
                        key={event.slug}
                        onClick={() => onEventClick(event)}
                        className={`w-full text-left text-xs p-1 rounded truncate text-white ${getStatusColor(event.status)} hover:opacity-80 transition-opacity`}
                        data-testid={`calendar-event-${event.slug}`}
                      >
                        {event.title}
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListView({ 
  events, 
  onEventClick 
}: { 
  events: CMSEvent[];
  onEventClick: (event: CMSEvent) => void;
}) {
  const sortedEvents = [...events].sort((a, b) => 
    parseEventDate(a.startDate).getTime() - parseEventDate(b.startDate).getTime()
  );
  
  if (sortedEvents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No events match your filters.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => {
        const startDate = parseEventDate(event.startDate);
        const urls = getEventUrls(event);
        
        return (
          <Card 
            key={event.slug} 
            className="hover-elevate cursor-pointer"
            onClick={() => onEventClick(event)}
            data-testid={`list-event-${event.slug}`}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0 text-center md:w-20">
                  <div className="text-2xl font-bold text-primary">{startDate.getDate()}</div>
                  <div className="text-sm text-muted-foreground uppercase">
                    {MONTHS[startDate.getMonth()].slice(0, 3)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge variant={getStatusBadgeVariant(event.status)} className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {event.timeText && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.timeText}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/events/${event.slug}`} onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" data-testid={`button-details-${event.slug}`}>
                      Details
                    </Button>
                  </Link>
                  {urls.attendeeUrl && (
                    <a 
                      href={urls.attendeeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" data-testid={`button-register-${event.slug}`}>
                        Register
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Calendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedEvent, setSelectedEvent] = useState<CMSEvent | null>(null);
  
  const visibleEvents = useMemo(() => getVisibleEvents(), []);
  
  const filteredEvents = useMemo(() => {
    return visibleEvents.filter(event => {
      const effectiveStatus = getEffectiveStatus(event);
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) return false;
      if (categoryFilter !== "all" && event.eventType !== categoryFilter) return false;
      return true;
    });
  }, [visibleEvents, statusFilter, categoryFilter]);
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Event Calendar" 
        description="View our full calendar of community events, meetings, and activities happening in Downtown Irwin throughout the year."
        path="/calendar"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-calendar-title">Event Calendar</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View our full calendar of community events in Downtown Irwin.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
              data-testid="button-view-month"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 md:ml-auto">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-[140px]" data-testid="select-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-[160px]" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="car-cruise">Car Cruise</SelectItem>
                <SelectItem value="street-market">Street Market</SelectItem>
                <SelectItem value="night-market">Night Market</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "month" && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)} data-testid="button-prev-month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth(1)} data-testid="button-next-month">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday} data-testid="button-today">
                Today
              </Button>
            </div>
            <h2 className="text-xl font-semibold" data-testid="text-current-month">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
        )}

        {viewMode === "month" ? (
          <MonthView 
            events={filteredEvents} 
            currentDate={currentDate}
            onEventClick={setSelectedEvent}
          />
        ) : (
          <ListView 
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} shown
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500"></span>
              Open
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              Upcoming
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-400"></span>
              Closed
            </span>
          </div>
        </div>
      </div>
      
      <EventModal 
        event={selectedEvent} 
        open={selectedEvent !== null} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
