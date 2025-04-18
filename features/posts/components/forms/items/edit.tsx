"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

import { Clock, Tag, Building2, ChevronsUpDown, Check } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateItem } from "@/features/posts/server/actions/item";
import { Item } from "@/types/item";
import { ItemEdit, ItemSchemaEdit } from "@/features/posts/schemas/item";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
      public: item.public,
      condition: item.condition,
      quantity: item.quantity,
      value: item.estimatedValue,
    },
  });

  const props = useSupabaseUpload({
    bucketName: "item-images",
    allowedMimeTypes: ["image/*"],
    maxFiles: 5,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  function onError(error: any) {
    toast.error(error);
    console.log(error);
  }

  async function onSubmit(data: ItemEdit) {
    try {
      setIsSaving(true);
      await props.onUpload();
      toast.promise(action(data), {
        loading: "Updating post...",
        success: "Post updated successfully!",
        error: (err) => {
          return `Error: ${err}`;
        },
      });
    } catch (error) {
      toast.error("Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4 my-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6">
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="relative w-full max-w-[400px] aspect-square">
              <div className="w-[500px]">
                <Dropzone {...props}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Item name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="public"
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

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Posted {new Date(item.postedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <FormControl>
                    <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? subcategories.find(
                            (sub) => sub.id === field.value
                          )?.name
                        : "Select language"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {subcategories.map((sub) => (
                          <CommandItem
                            value={sub.name}
                            key={sub.id}
                            onSelect={() => {
                              form.setValue("subcategory", sub.id)
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-7 text-sm border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Condition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t">
              <h3 className="text-base font-medium mb-2">Posted by</h3>

              <p className="flex flex-row gap-2 items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {item.school.name}
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
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
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
