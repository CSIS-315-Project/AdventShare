"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

import { Clock, Tag, Building2, ChevronsUpDown, Check, X } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateItem, deleteImage } from "@/features/posts/server/actions/item";
import { Item } from "@/types/item";
import { ItemEdit, ItemSchemaEdit } from "@/features/posts/schemas/item";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  "New",
  "Like New",
  "Excellent",
  "Barely Used",
  "Good",
  "Used",
  "Fair",
  "Poor",
];

export default function ItemClient({
  item,
  subcategories,
}: {
  item: Item;
  subcategories: {
    id: string;
    name: string;
  }[];
}) {
  const [isSaving, setIsSaving] = useState(false);

  const action = updateItem.bind(null, item.id);

  const form = useForm<ItemEdit>({
    resolver: zodResolver(ItemSchemaEdit),
    defaultValues: {
      name: item.name,
      description: item.description,
      subcategory: item.subcategory,
      isPublic: item.public,
      condition: item.condition,
      quantity: item.quantity,
      estimatedValue: item.estimatedValue,
    },
  });

  const props = useSupabaseUpload({
    bucketName: "item-images",
    allowedMimeTypes: ["image/*"],
    path: `${item.id}/`,
    maxFiles: 5,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  function onError(error: any) {
    toast("You encountered the following error:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="">{JSON.stringify(error, null, 2)}</code>
        </pre>
      ),
    });
    console.log(error);
  }

  async function onSubmit(data: ItemEdit) {
    try {
      setIsSaving(true);
      if (data.images && data.images.length > 0) {
        await props.onUpload();
      }
      toast.promise(action(data), {
        loading: "Updating post...",
        success: "Post updated successfully!",
        error: (err) => {
          return `Error: ${err}`;
        },
      });
      await props.onUpload();
    } catch (error) {
      toast.error("Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDeleteImage(image: string) {
    const deleteImageAction = deleteImage.bind(null, item.id, image);

    toast.promise(deleteImageAction, {
      loading: "Deleting image...",
      success: "Image deleted successfully!",
      error: (err) => {
        return `Error: ${err}`;
      },
    });

    // slice image out
    const updatedImages = [...item.images];
    updatedImages.splice(updatedImages.indexOf(image), 1);
    form.setValue("images", updatedImages);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4 my-2 max-w-5xl place-self-center"
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="relative w-full max-w-[400px] aspect-square">
                <div className="flex flex-col gap-4 w-full max-w-[400px]">
                  {item.images.length > 0 && (
                    <Carousel>
                      <CarouselContent>
                        {item.images.map((image, index) => (
                          <CarouselItem key={index} className="relative">
                            <Button
                              type="button"
                              onClick={() => onDeleteImage(image)}
                              className="absolute top-2 right-2 z-10 size-10 bg-red-500/80 hover:bg-red-700/50 text-white rounded-full p-1"
                            >
                              <X className="size-5" />
                            </Button>
                            <Image
                              src={image}
                              alt={item.name}
                              width={500}
                              height={500}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                  <Dropzone className="max-w-[400px] w-full" {...props}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-4 w-full items-center text-sm text-gray-500">
                <p className="flex flex-row gap-2 items-center">
                  <Clock className="w-4 h-4" />
                  <span>
                    Posted {new Date(item.postedDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex flex-row gap-2 items-center">
                  <Building2 className="w-4 h-4" />
                  {item.school.name}
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Item name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex-shrink-0">
                    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      />
                      <div className="flex grow items-center gap-3">
                        <div className="grid grow gap-2">
                          <Label>Public </Label>
                          <p className="text-muted-foreground text-xs">
                            Allow other users to see this item.
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? subcategories.find(
                                    (sub) => sub.id === field.value
                                  )?.name
                                : "Select category"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search category..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {subcategories.map((sub) => (
                                  <CommandItem
                                    value={sub.name}
                                    key={sub.id}
                                    onSelect={() => {
                                      form.setValue("subcategory", sub.id);
                                    }}
                                  >
                                    {sub.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        sub.id === field.value
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the condition of the item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem value={condition} key={condition}>
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
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value Per Unit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-7 text-sm border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="$0.00"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Enter item description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
