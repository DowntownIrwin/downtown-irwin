import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SPONSORSHIP_LEVELS, IBPA_INFO } from "@/lib/constants";
import { insertSponsorshipInquirySchema } from "@shared/schema";
import type { Sponsor } from "@shared/schema";
import {
  Handshake,
  CheckCircle2,
  Star,
  Loader2,
  Mail,
  Crown,
  Award,
  Medal,
  Heart,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";

const formSchema = insertSponsorshipInquirySchema.extend({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone required"),
  level: z.string().min(1, "Select a sponsorship level"),
});

const levelIcons: Record<string, typeof Crown> = {
  "Presenting Sponsor": Crown,
  "Gold Sponsor": Award,
  "Silver Sponsor": Medal,
  "Supporting Sponsor": Heart,
  "Custom Trophy Recognition Partner": Trophy,
};

export default function Sponsorship() {
  usePageTitle("Sponsorship Opportunities", "Support Downtown Irwin events and gain visibility with sponsorship packages from $50 to $600.");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const { data: sponsors, isLoading: sponsorsLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/sponsors"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      level: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/sponsorship-inquiries", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sponsorship-inquiries"] });
      setSubmitted(true);
      toast({ title: "Inquiry Submitted!", description: "We'll be in touch soon." });
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
            <Handshake className="w-3 h-3 mr-1" /> Partner With Us
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-sponsorship-title">
            Sponsorship Opportunities
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Support the community and gain visibility with thousands of attendees. All proceeds support the Irwin Business & Professional Association.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12" data-testid="section-sponsorship-levels">
        <h2 className="text-2xl font-bold font-serif text-center mb-2">Sponsorship Levels</h2>
        <p className="text-muted-foreground text-center mb-8">Choose the package that fits your business goals</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPONSORSHIP_LEVELS.map((level) => {
            const Icon = levelIcons[level.name] || Star;
            return (
              <Card
                key={level.name}
                className={`p-6 relative ${level.tag === "Best Value" ? "border-primary" : ""}`}
                data-testid={`card-level-${level.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                {level.tag && (
                  <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground">
                    {level.tag}
                  </Badge>
                )}
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">{level.name}</h3>
                <p className="text-2xl font-bold mb-4">
                  ${level.price}
                  <span className="text-sm text-muted-foreground font-normal"> per event</span>
                </p>
                <ul className="space-y-2">
                  {level.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>

      {sponsors && sponsors.length > 0 && (
        <section className="bg-card border-y" data-testid="section-current-sponsors">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold font-serif text-center mb-8">Current Sponsors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sponsors.map((s) => (
                <Card key={s.id} className="p-5 text-center" data-testid={`card-current-sponsor-${s.id}`}>
                  <Badge variant="secondary" className="mb-2 text-xs">{s.level}</Badge>
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-2xl mx-auto px-4 py-12" data-testid="section-inquiry-form">
        <h2 className="text-2xl font-bold font-serif text-center mb-2">Interested in Sponsoring?</h2>
        <p className="text-muted-foreground text-center mb-8">
          Fill out the form below and our event team will be in touch.
        </p>

        {submitted ? (
          <Card className="p-8 text-center" data-testid="card-inquiry-success">
            <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">Your sponsorship inquiry has been submitted. Our team will contact you soon.</p>
            <p className="text-sm text-muted-foreground">
              Questions? Email us at <a href={`mailto:${IBPA_INFO.eventsEmail}`} className="text-primary underline">{IBPA_INFO.eventsEmail}</a>
            </p>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6" data-testid="form-sponsorship-inquiry">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="Your Business" {...field} data-testid="input-business-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactName" render={({ field }) => (
                  <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} data-testid="input-contact-name" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jane@business.com" {...field} data-testid="input-sponsor-email" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="(724) 555-0123" {...field} data-testid="input-sponsor-phone" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsorship Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger data-testid="select-sponsor-level"><SelectValue placeholder="Select a level" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {SPONSORSHIP_LEVELS.map((l) => (
                        <SelectItem key={l.name} value={l.name}>{l.name} - ${l.price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea placeholder="Questions or special requests..." className="resize-none" rows={4} {...field} value={field.value || ""} data-testid="textarea-sponsor-message" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-submit-inquiry">
                {mutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><Mail className="w-4 h-4 mr-2" />Submit Inquiry</>}
              </Button>
            </form>
          </Form>
        )}
      </section>
    </div>
  );
}
