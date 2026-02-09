import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IBPA_INFO, PARTNERS } from "@/lib/constants";
import {
  Info,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Users,
  Heart,
  Target,
  Megaphone,
  Handshake,
  Building,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import aerialPhoto from "@assets/72dpi_Photo_Oct_19_2024,_5_56_10_AM_Downsized_edited_1770661424918.jpg";
import ibpaLogo from "@assets/IBPA_Logo_v3_1770661661388.avif";

export default function About() {
  usePageTitle("About IBPA", "Learn about the Irwin Business & Professional Association, an all-volunteer organization promoting Downtown Irwin.");
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aerialPhoto}
            alt="Aerial view of Downtown Irwin, Pennsylvania"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-6">
            <img
              src={ibpaLogo}
              alt="IBPA Logo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-md bg-white/10 backdrop-blur-sm p-2 object-contain"
              data-testid="img-ibpa-logo"
            />
            <div>
              <Badge variant="secondary" className="mb-3 bg-primary/20 text-white border-primary/30">
                <Info className="w-3 h-3 mr-1" /> About Us
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-white" data-testid="text-about-title">
                {IBPA_INFO.name}
              </h1>
              <p className="text-white/75 max-w-2xl">
                An all-volunteer organization promoting the health and vitality of Downtown Irwin, Pennsylvania since its founding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section data-testid="section-mission">
              <h2 className="text-2xl font-bold font-serif mb-4">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The Irwin Business & Professional Association (IBPA) is dedicated to creating a vibrant Main Street
                  experience for residents and visitors from surrounding communities. We organize 15+ free community
                  events annually, bringing food, entertainment, shopping, and togetherness to Downtown Irwin.
                </p>
                <p>
                  Downtown Irwin thrives on the concept of "entertailing" -- combining retail shopping with entertainment
                  to create an immersive experience. Our events drive foot traffic and create a vibrant, tight-knit
                  business community where storefronts are in high demand.
                </p>
                <p>
                  We are a 100% volunteer-run organization with no government funding. Our events are supported entirely
                  by sponsorships, business participation fees, and vendor fees from the community.
                </p>
              </div>
            </section>

            <section data-testid="section-values">
              <h2 className="text-2xl font-bold font-serif mb-4">What We Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Calendar, title: "Community Events", desc: "15+ free annual events including Ladies Night, Light Up Night, Cookie Tour, Pink Friday, and more" },
                  { icon: Megaphone, title: "Business Promotion", desc: "Marketing and promotion for downtown businesses to drive foot traffic and visibility" },
                  { icon: Handshake, title: "Networking", desc: "Weekly Thursday meetings connecting business owners and community leaders" },
                  { icon: Target, title: "Revitalization", desc: "Working with partners to strengthen and revitalize the Downtown Irwin corridor" },
                ].map((item) => (
                  <Card key={item.title} className="p-5">
                    <item.icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </section>

            <section data-testid="section-meetings">
              <h2 className="text-2xl font-bold font-serif mb-4">Weekly Meetings</h2>
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Join Us Every Thursday</h3>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" /> {IBPA_INFO.meetingTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0" /> {IBPA_INFO.meetingLocation}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" /> RSVP: {IBPA_INFO.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Meetings are occasionally moved to Zoom. If you're new, please RSVP to confirm the format.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section data-testid="section-partners">
              <h2 className="text-2xl font-bold font-serif mb-4">Community Partners</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PARTNERS.map((p) => (
                  <Card key={p.name} className="p-5">
                    <Users className="w-5 h-5 text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="p-6" data-testid="card-contact-info">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{IBPA_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Mailing Address</p>
                    <p className="text-muted-foreground">{IBPA_INFO.mailingAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{IBPA_INFO.phone}</p>
                    <p className="text-muted-foreground">{IBPA_INFO.altPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{IBPA_INFO.email}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-funding-info">
              <h3 className="font-semibold mb-3">How We're Funded</h3>
              <div className="space-y-3">
                {[
                  { icon: Heart, label: "Sponsorships", desc: "Local business sponsors at various levels" },
                  { icon: Building, label: "Participation Fees", desc: "From businesses joining events" },
                  { icon: Users, label: "Vendor Fees", desc: "From event vendors and participants" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                The IBPA receives no government funding and operates entirely through community support.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
