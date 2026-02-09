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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { CAR_CRUISE_INFO, VEHICLE_CLASSES } from "@/lib/constants";
import { insertVehicleRegistrationSchema } from "@shared/schema";
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";

const formSchema = insertVehicleRegistrationSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone number required"),
  vehicleYear: z.string().min(4, "Vehicle year required"),
  vehicleMake: z.string().min(1, "Vehicle make required"),
  vehicleModel: z.string().min(1, "Vehicle model required"),
  vehicleColor: z.string().min(1, "Vehicle color required"),
  vehicleClass: z.string().min(1, "Select a vehicle class"),
});

export default function CarCruiseRegister() {
  usePageTitle("Vehicle Registration", "Register your vehicle for the Downtown Irwin Car Cruise 2026.");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleClass: "",
      specialRequests: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/vehicle-registrations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicle-registrations"] });
      setSubmitted(true);
      toast({
        title: "Registration Submitted!",
        description: "You're registered for the Downtown Irwin Car Cruise.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center" data-testid="card-registration-success">
          <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-serif mb-2">You're Registered!</h2>
          <p className="text-muted-foreground mb-2">
            Your vehicle has been registered for the {CAR_CRUISE_INFO.name}.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {CAR_CRUISE_INFO.date} &middot; {CAR_CRUISE_INFO.time}
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/car-cruise">
              <Button className="w-full" data-testid="button-back-to-cruise">Back to Car Cruise</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => { setSubmitted(false); form.reset(); }} data-testid="button-register-another">
              Register Another Vehicle
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <Badge variant="secondary" className="mb-3">
            <Car className="w-3 h-3 mr-1" /> Free Registration
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-register-title">
            Vehicle Registration
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Secure your spot at the {CAR_CRUISE_INFO.name}. Registration is free and open to all vehicle types.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {CAR_CRUISE_INFO.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {CAR_CRUISE_INFO.time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {CAR_CRUISE_INFO.location}</span>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6" data-testid="form-vehicle-registration">
            <div>
              <h2 className="font-semibold text-lg mb-4">Owner Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(724) 555-0123" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold text-lg mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="1969" {...field} data-testid="input-vehicle-year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Chevrolet" {...field} data-testid="input-vehicle-make" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Camaro" {...field} data-testid="input-vehicle-model" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Red" {...field} data-testid="input-vehicle-color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="vehicleClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-vehicle-class">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VEHICLE_CLASSES.map((vc) => (
                            <SelectItem key={vc} value={vc} data-testid={`option-${vc.toLowerCase().replace(/[\s()]/g, "-")}`}>
                              {vc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or notes for event organizers..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        value={field.value || ""}
                        data-testid="textarea-special-requests"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-submit-registration">
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 mr-2" />
                  Register Vehicle
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
