"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone";

import { createItem } from "../server/actions/create-item";
import { createItemSchema } from "../schemas/items";
//import image

const CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Used",
  "Fair",
  "Poor",
];

const SUBCATEGORIES = [
  "Electronics",
  "Furniture",
  "Other"
];

export default function CreateItemForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempItemId] = useState(`temp-${Date.now()}`); // Temporary ID for image organization

  const form = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      subcategory: "",
      is_public: true,
      condition: "",
      quantity: 1,
      estimatedValue: 0,
    },
  });

  // Use the upload hook with a temporary path that we can rename later
  const uploadProps = useSupabaseUpload({
    bucketName: "item-images",
    allowedMimeTypes: ["image/*"],
    path: `${item.id}/`,
    maxFiles: 5,
    maxFileSize: 1000 * 1000 * 10, // 10MB
  });

  async function onSubmit(data: z.infer<typeof createItemSchema>) {
    try {
      setIsSubmitting(true);
      
      // First upload any images
      let uploadedImagePaths: string[] = [];
      if (uploadProps.files.length > 0) {
        await uploadProps.onUpload();
        
        // Get paths of uploaded images
        uploadedImagePaths = uploadProps.files.map(
          file => `temp/${tempItemId}/${file.name}`
        );
      }

      // Create the item with image references
      const createdItem = await createItem({
        ...data,
        images: uploadedImagePaths
      });
      
      toast.success("Item created successfully!");
      
      // Navigate to the item detail page
      router.push(`/items/${createdItem.id}`);
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create New Item</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic item details */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your item in detail"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUBCATEGORIES.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel className="mb-0">Public Listing</FormLabel>
                <FormDescription>
                  Check to make this item visible to everyone.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Image upload section */}
          <div className="space-y-2">
            <FormLabel>Images</FormLabel>
            <Dropzone className="w-full" {...uploadProps}>
              <DropzoneEmptyState />
              <DropzoneContent uploadButton={false} />
            </Dropzone>
            <FormDescription>
              Upload up to 5 images (10MB max per image)
            </FormDescription>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}