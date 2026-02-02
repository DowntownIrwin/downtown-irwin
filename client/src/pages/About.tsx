import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { SEO } from "@/components/SEO";
import ibpaLogo from "@assets/IBPA_Logo_v3_1770042401362.png";

export default function About() {
  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="About IBPA" 
        description="Learn about the Irwin Business & Professional Association, an all-volunteer group promoting the health and vitality of Irwin for the benefit of surrounding communities."
        path="/about"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <img 
                    src={ibpaLogo} 
                    alt="IBPA Logo" 
                    className="w-48 md:w-64 h-auto"
                    data-testid="img-ibpa-logo"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    The Irwin Business & Professional Association (IBPA)
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      The IBPA is an all-volunteer group that promotes the health & vitality of Irwin for the benefit of the surrounding communities.
                    </p>
                    <p>
                      Annually, the IBPA organizes 15+ free community events. These events are open to everyone, not just Irwin residents. The IBPA receives no government funding. All of the events are paid for by sponsorships, business participation fees, and vendor fees. The volunteers are very appreciative of the support they receive from the local businesses and community members.
                    </p>
                    <p>
                      Are you interested in what the IBPA is doing? Do you want to get more involved in the community? If so, then join us at a meeting; all are welcome! Meetings are held every Thursday from 8:00 - 9:00 a.m. in downtown Irwin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-accent p-6 rounded-lg mt-8">
                <p className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    If you are new to our group and plan on attending a meeting, please reach out to{" "}
                    <a 
                      href="mailto:jmsmaligo@gmail.com" 
                      className="text-primary hover:underline font-medium"
                      data-testid="link-ibpa-email"
                    >
                      jmsmaligo@gmail.com
                    </a>{" "}
                    for more information.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
