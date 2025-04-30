"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { X, ChevronsUpDown, Check } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createItem } from "../server/actions/create-item"
import { ItemSchema } from "../schemas/item"
import ImageDropzone from "./image-dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { CreateItemResult } from "../types"

// Supported item conditions, matching the existing patterns in the app
const CONDITIONS = [
  "New",
  "Like New",
  "Excellent",
  "Barely Used",
  "Good",
  "Used",
  "Fair",
  "Poor",
]

// Form schema that matches the backend itemSchema requirements
const createItemSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subcategory_id: z.string().min(1, { message: "Please select a category" }),
  condition: z.string().min(1, { message: "Please select a condition" }),
  quantity: z.coerce.number().int().positive({ message: "Please enter a valid quantity" }),
  value: z.coerce.number().nonnegative({ message: "Value must be zero or positive" }).optional(),
  is_public: z.boolean(),
  organization_id: z.string().optional()
})

type FormValues = z.infer<typeof createItemSchema>

interface CreateItemFormProps {
  categories: {
    id: string
    name: string
    subcategories: {
      id: string
      name: string
    }[]
  }[]
  organizations?: {
    id: string
    name: string
  }[]
}

export default function CreateItemForm({ categories, organizations }: CreateItemFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemId, setItemId] = useState<string | null>(null)

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      subcategory_id: "",
      condition: "",
      quantity: 1,
      value: undefined,
      is_public: true,
      organization_id: organizations?.[0]?.id
    }
  })

  // Handle file uploads
  const uploadProps = useSupabaseUpload({
    bucketName: "item-images",
    allowedMimeTypes: ["image/*"],
    path: itemId || "temp", // This will be updated after item creation
    maxFiles: 5,
    maxFileSize: 1000 * 1000 * 10 // 10MB
  })

  // Update the path when itemId becomes available
  useEffect(() => {
    if (itemId) {
      uploadProps.setFiles([]) // Reset files
      // Set the correct path for uploads
      const newProps = {
        ...uploadProps,
        path: `${itemId}/`
      }
      Object.assign(uploadProps, newProps)
    }
  }, [itemId])

  function onError(error: any) {
    toast.error("Form submission error", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(error, null, 2)}</code>
        </pre>
      ),
    })
    console.error(error)
  }

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true)
      
      // Create the item in the database
      const result = await createItem(data) as CreateItemResult
      
      if (!result.success || !result.itemId) {
        toast.error(result.message || "Failed to create item")
        return
      }
      
      // Store the item ID for image uploads
      setItemId(result.itemId)
      
      // Upload images if there are any
      if (uploadProps.files.length > 0) {
        // Update the path to include the item ID
        Object.assign(uploadProps, {
          ...uploadProps,
          path: `${result.itemId}/`
        })
        
        // Upload the images
        await uploadProps.onUpload()
        
        if (uploadProps.errors.length > 0) {
          toast.warning("Some images failed to upload", {
            description: "Your item was created, but not all images were uploaded successfully."
          })
        }
      }
      
      // Show success message
      toast.success("Item created successfully!")
      
      // Redirect back to items page
      setTimeout(() => {
        router.push("/items")
      }, 1500)
    } catch (error) {
      console.error("Error creating item:", error)
      toast.error("Failed to create item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create New Item</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
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
                <FormDescription>
                  Be specific about the item's features, age, and any notable details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.flatMap(category => 
                          category.subcategories.map(subcategory => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {category.name} — {subcategory.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                    value={field.value}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value (per unit)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="$0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={e => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Public Listing</FormLabel>
                  <FormDescription>
                    Make this item visible to all users
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {organizations && organizations.length > 0 && (
            <FormField
              control={form.control}
              name="organization_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="space-y-2">
            <FormLabel>Images</FormLabel>
            <ImageDropzone 
              {...uploadProps}
              setFiles={(files: File[]) => {
                const filesWithPreview = files.map(file => ({
                  ...file,
                  errors: []
                })) as any;
                uploadProps.setFiles(filesWithPreview);
              }}
            />
            <FormDescription>
              Upload up to 5 images to showcase your item. Max 10MB per image.
            </FormDescription>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadProps.loading}>
              {isSubmitting ? "Creating..." : "Create Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}


