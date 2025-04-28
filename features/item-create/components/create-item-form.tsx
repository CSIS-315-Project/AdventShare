"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createItem } from "../server/actions/create-item"
import { ItemSchema } from "../schemas/item"
import ImageDropzone from "./image-dropzone"
import type { Category } from "../types"

interface CreateItemFormProps {
  categories: Category[]
}

export default function CreateItemForm({ categories }: CreateItemFormProps) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [quantity, setQuantity] = useState<number | "">(1)
  const [availableQuantity, setAvailableQuantity] = useState<number | "">(1)
  const [estimatedValue, setEstimatedValue] = useState<number | "">(0)
  const [isPublic, setIsPublic] = useState(true)
  const [condition, setCondition] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get subcategories for the selected category
  const selectedCategory = categories.find((c) => c.id === category)
  const subcategories = selectedCategory?.subcategories || []

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      const parseResult = ItemSchema.safeParse({
        name,
        description,
        category,
        subcategory,
        quantity: quantity === "" ? undefined : quantity,
        availableQuantity: availableQuantity === "" ? undefined : availableQuantity,
        estimatedValue: estimatedValue === "" ? undefined : estimatedValue,
        isPublic,
        condition,
        images: files.map((f) => URL.createObjectURL(f)), // In a real app, we'd upload these to storage
      })

      if (!parseResult.success) {
        const errorMessage = parseResult.error.issues.map((issue) => issue.message).join(", ")
        toast.error(`Validation error: ${errorMessage}`)
        return
      }

      const valid = parseResult.data

      // Check if available quantity is valid
      if (
        valid.availableQuantity !== undefined &&
        valid.quantity !== undefined &&
        valid.availableQuantity > valid.quantity
      ) {
        toast.error("Available quantity cannot be greater than total quantity")
        return
      }

      // Create item (mock action)
      const result = await createItem(valid)

      if (result.success) {
        toast.success("Item created successfully!")
        router.push("/items/" + result.itemId)
      } else {
        toast.error(result.error || "Failed to create item")
      }
    } catch (error) {
      console.error("Error creating item:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[120px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={subcategory}
            onValueChange={setSubcategory}
            disabled={!category || subcategories.length === 0}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableQuantity">Available</Label>
          <Input
            id="availableQuantity"
            type="number"
            min={0}
            max={quantity === "" ? undefined : quantity}
            value={availableQuantity}
            onChange={(e) => setAvailableQuantity(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
          <Input
            id="estimatedValue"
            type="number"
            step={0.01}
            min={0}
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked === true)} />
          <Label htmlFor="isPublic" className="text-sm font-normal">
            Make this item public
          </Label>
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={condition} onValueChange={setCondition} required>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like_new">Like New</SelectItem>
              <SelectItem value="used_good">Used - Good</SelectItem>
              <SelectItem value="used_fair">Used - Fair</SelectItem>
              <SelectItem value="for_parts">For Parts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <ImageDropzone files={files} setFiles={setFiles} />

        {files.length > 0 && (
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="relative w-20 h-20 rounded overflow-hidden border">
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 z-10 bg-white/75 rounded-full p-1 hover:bg-white"
                >
                  <X size={16} className="text-red-600" />
                </button>
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={file.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Item"}
      </Button>
    </form>
  )
}
