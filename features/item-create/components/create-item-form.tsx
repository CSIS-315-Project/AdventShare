"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, ImageIcon, Loader2, UploadIcon, XIcon } from "lucide-react";

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
import { createItem } from "../server/actions/create-item";
import { createItemSchema } from "../schemas/items";
import { cn } from "@/lib/utils";
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

const CONDITIONS = ["New", "Like New", "Good", "Used", "Fair", "Poor"];

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

export default function CreateItemForm({
  subcategories
}: {
  subcategories: {
    name: string;
    id: string;
  }[]
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeMB = 5;
  const acceptedTypes =
    "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif";

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    // Set the files in the form
    form.setValue("images", Array.from(e.dataTransfer.files), {
      shouldValidate: true,
    });
  };

  const clearFiles = () => {
    setFiles([]);
    form.reset();
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  async function onSubmit(data: z.infer<typeof createItemSchema>) {
    try {
      toast.promise(createItem(data), {
        success: (item) => {
          if (item?.data?.id) {
            router.replace(`/items/${item.data.id}`);
          } else {
            toast.error("Failed to retrieve item ID");
          }
          return "Item created successfully!";
        }
      })
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

          <FormField
            control={form.control}
            name="images"
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="sr-only">Upload Files</FormLabel>
                <FormControl>
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
                  >
                    <Input
                      type="file"
                      accept={acceptedTypes}
                      multiple
                      onChange={(e) => {
                        const selectedFiles = e.target.files;
                        if (selectedFiles && selectedFiles.length > 0) {
                          const newFiles = Array.from(selectedFiles).map(
                            (file) => ({
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: URL.createObjectURL(file),
                              id: crypto.randomUUID(),
                            })
                          );
                          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                          form.setValue(
                            "images",
                            Array.from(e.target.files || [])
                          );
                        }
                        // Reset the input value to allow selecting the same file again
                        e.target.value = "";
                      }}
                      className="sr-only"
                      aria-label="Upload image file"
                      ref={inputRef}
                      {...fieldProps}
                    />
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <div
                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <ImageIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        Drop your images here
                      </p>
                      <FormDescription className="text-xs">
                        SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                      </FormDescription>
                      <Button
                        variant="outline"
                        className="mt-4"
                        // Open file exporer on computer
                        onClick={(e) => {
                          e.preventDefault();
                          inputRef.current?.click();
                        }}
                        type="button"
                        disabled={isPending}
                      >
                        <UploadIcon
                          className="-ms-1 opacity-60"
                          aria-hidden="true"
                        />
                        {isPending ? "Uploading..." : "Select images"}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 mt-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-accent aspect-square shrink-0 rounded">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="size-10 rounded-[inherit] object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate text-[13px] font-medium">
                        {file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                    type="button"
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </div>
              ))}

              {/* Remove all files button */}
              {files.length > 1 && (
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearFiles}
                    type="button"
                  >
                    Remove all files
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Item"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
