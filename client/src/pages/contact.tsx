import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { IBPA_INFO } from "@/lib/constants";
import { insertContactMessageSchema } from "@shared/schema";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";

const formSchema = insertContactMessageSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  usePageTitle("Contact Us", "Get in touch with the Irwin Business & Professional Association.");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      setSubmitted(true);
      toast({ title: "Message Sent!", description: "We'll get back to you soon." });
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Badge variant="secondary" className="mb-3">
            <Mail className="w-3 h-3 mr-1" /> Get In Touch
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Have a question about events, sponsorship, or the downtown community? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {submitted ? (
              <Card className="p-8 text-center" data-testid="card-contact-success">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-4">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <Button variant="outline" onClick={() => { setSubmitted(false); form.reset(); }} data-testid="button-send-another">
                  Send Another Message
                </Button>
              </Card>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6" data-testid="form-contact">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" {...field} data-testid="input-contact-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} data-testid="input-contact-email" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="What's this about?" {...field} data-testid="input-contact-subject" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Tell us more..." className="resize-none" rows={6} {...field} data-testid="textarea-contact-message" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" size="lg" disabled={mutation.isPending} data-testid="button-send-message">
                    {mutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Send Message</>}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6" data-testid="card-contact-details">
              <h3 className="font-semibold mb-4">Contact Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{IBPA_INFO.address}</p>
                    <p className="text-muted-foreground mt-1">Mailing: {IBPA_INFO.mailingAddress}</p>
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
                    <p className="text-muted-foreground mt-1">Events: {IBPA_INFO.eventsEmail}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-meeting-info">
              <h3 className="font-semibold mb-4">Weekly Meetings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>{IBPA_INFO.meetingDay}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{IBPA_INFO.meetingTime}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{IBPA_INFO.meetingLocation}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                New to the IBPA? RSVP to {IBPA_INFO.email} to confirm the meeting format (in-person or Zoom).
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
