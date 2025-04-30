"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

import { completeOnboarding } from "@/features/auth/server/actions/onboarding";
import {
  ArrowRight,
  Check,
  CheckCircle,
  ChevronsUpDown,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Organization } from "@clerk/nextjs/server";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  school: z.string().min(3),
});

type FormTypes = z.infer<typeof formSchema>;

export default function OnboardingForm({
  organizations,
}: {
  organizations: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    hasImage: boolean;
    createdAt: number;
    updatedAt: number;
    publicMetadata: OrganizationPublicMetadata | null;
    privateMetadata: OrganizationPrivateMetadata;
    maxAllowedMemberships: number;
    adminDeleteEnabled: boolean;
    membersCount?: number | undefined;
    createdBy?: string | undefined;
  }[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: "",
    },
  });

  function onSubmit(data: FormTypes) {
    try {
      toast.promise(completeOnboarding(data), {
        success: "Onboarding complete!",
        error: (err) => {
          console.log(err);
          return `Error: ${err}`;
        },
      });

      router.push('/');
    } catch (error) {
      console.log("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <School className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">
                Welcome to AdventShare!
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">
                We're excited to have you join our community. Let's get to know
                you better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 order-2 md:order-1">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Which school are you from?
                    </h3>
                    <p className="text-sm text-slate-500">
                      This helps us connect you with others from your
                      institution.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? organizations.find(
                                      (org) => org.id === field.value
                                    )?.name
                                  : "Select school"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search school..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No school found.</CommandEmpty>
                                <CommandGroup>
                                  {organizations.map((org) => (
                                    <CommandItem
                                      value={org.name}
                                      key={org.id}
                                      onSelect={() => {
                                        form.setValue("school", org.id);
                                      }}
                                    >
                                      {org.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          org.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("school") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center text-sm text-green-600 gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        Great choice!
                      </span>
                    </motion.div>
                  )}
                  <Button className="flex justify-self-end" type="submit" disabled={!form.watch("school")}>
                    Submit
                    <Check className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative order-1 md:order-2">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                    <img
                      src="/Logo.png"
                      alt="Onboarding illustration"
                      className="w-3/4 h-3/4 object-contain rounded-md"
                    />

                    {/* Decorative elements */}
                    <div className="absolute top-6 right-6 h-12 w-12 rounded-full bg-primary/10 animate-pulse"></div>
                    <div
                      className="absolute bottom-10 left-10 h-8 w-8 rounded-full bg-primary/20 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute top-1/2 left-6 h-6 w-6 rounded-full bg-primary/15 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex pt-4 justify-center">
              <p className="text-sm text-slate-500 text-center">
                By clicking "Submit", you agree to our{" "}
                <Link href="/terms" className="text-primary underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary underline">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </Card>
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 max-w-md text-center text-slate-600 text-sm"
          >
            <p className="italic">"This is a testimonial!"</p>
            <p className="mt-2 font-medium">— Could Be You!, AdventShare</p>
          </motion.div>
        </div>
      </form>
    </Form>
  );
}
