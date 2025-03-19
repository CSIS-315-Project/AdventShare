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
import { Input } from "@/components/ui/input";

import { completeOnboarding } from '@/features/auth/server/actions/onboarding'

const formSchema = z.object({
  school: z.string().min(3)
});

type FormTypes = z.infer<typeof formSchema>;

export default function OnboardingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "school": ""
    },
  });

  function onSubmit(data: FormTypes) {
    try {
      toast.promise(completeOnboarding(data), {
        success: "Success",
        error: (err) => {
          return `Error: ${err}`
        }
      })

    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your School</FormLabel>
              <FormControl>
                <Input
                  placeholder="school"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the school you belong to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}