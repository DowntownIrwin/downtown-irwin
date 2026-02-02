import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (formData: ContactForm) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to send');
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
    } catch {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Contact Us" 
        description="Contact Downtown Irwin and IBPA with questions about events, sponsorships, vendor opportunities, or getting involved in the community."
        path="/contact"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our events, sponsorship opportunities, or want to 
            get involved? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="John Smith"
                    data-testid="input-contact-name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email"
                      }
                    })}
                    placeholder="john@example.com"
                    data-testid="input-contact-email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject"
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="What is this about?"
                    data-testid="input-contact-subject"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    {...register("message", { required: "Message is required" })}
                    placeholder="Tell us more..."
                    rows={5}
                    data-testid="input-contact-message"
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-contact-submit">
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground text-sm">
                        Main Street<br />
                        Irwin, PA 15642
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@downtownirwin.com" className="text-muted-foreground text-sm hover:text-foreground">
                        info@downtownirwin.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+17247777777" className="text-muted-foreground text-sm hover:text-foreground">
                        (724) 777-7777
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-muted-foreground text-sm">
                        We typically respond within 24-48 hours
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-accent">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Specific Inquiries</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Vendor Applications:</strong>{" "}
                    <a href="/vendors" className="text-primary hover:underline">Visit Vendors page</a>
                  </li>
                  <li>
                    <strong className="text-foreground">Sponsorships:</strong>{" "}
                    <a href="/sponsors" className="text-primary hover:underline">View Sponsor packages</a>
                  </li>
                  <li>
                    <strong className="text-foreground">Car Cruise Registration:</strong>{" "}
                    <a href="/car-cruise" className="text-primary hover:underline">Irwin Car Cruise page</a>
                  </li>
                  <li>
                    <strong className="text-foreground">IBPA Membership:</strong>{" "}
                    <a href="/about" className="text-primary hover:underline">Learn about joining</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
