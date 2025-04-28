'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { Dropzone } from '@/components/dropzone'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ItemSchemaEdit } from '@/features/posts/schemas/item'

const supabase = createClient()

export default function CreateItemPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [availableQuantity, setAvailableQuantity] = useState<number | ''>('')
  const [estimatedValue, setEstimatedValue] = useState<number | ''>('')
  const [isPublic, setIsPublic] = useState(true)
  const [condition, setCondition] = useState('')
  const [itemId, setItemId] = useState<string>('')

  const {
    files,
    setFiles,
    onUpload,
    loading: uploadLoading,
    errors: uploadErrors,
    isSuccess,
    ...dropzoneProps
  } = useSupabaseUpload({
    bucketName: 'item-images',
    path: itemId,
    allowedMimeTypes: ['image/*'],
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    cacheControl: 3600,
    upsert: false,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = ItemSchemaEdit.safeParse({
      name,
      description,
      category,
      subcategory,
      quantity: quantity === '' ? undefined : quantity,
      availableQuantity: availableQuantity === '' ? undefined : availableQuantity,
      estimatedValue: estimatedValue === '' ? undefined : estimatedValue,
      isPublic,
      condition,
      images: files.map((f) => f.name),
    })

    if (!parseResult.success) {
      toast.error('Please fill out all required fields')
      return
    }

    const valid = parseResult.data

    if (
      valid.availableQuantity !== undefined &&
      valid.quantity !== undefined &&
      valid.availableQuantity > valid.quantity
    ) {
      toast.error('Available quantity cannot be greater than total quantity')
      return
    }

    const { data, error } = await supabase
      .from('items')
      .insert({
        name: valid.name,
        description: valid.description,
        category: valid.category,
        subcategory: valid.subcategory,
        quantity: valid.quantity ?? null,
        available_quantity: valid.availableQuantity ?? null,
        value: valid.estimatedValue ?? null,
        is_public: valid.isPublic,
        condition: valid.condition,
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error creating item:', {error, data})
      toast.error('Failed to create item. Please try again.')
      return
    }

    toast.success('Item created successfully!')
    setItemId(data.id)
    await onUpload(data.id)

    if (uploadErrors.length > 0) {
      console.error('Error uploading images:', uploadErrors)
      toast.error('Failed to upload images. Please try again.')
      return
    }

    router.push('/')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded px-3 py-2 border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded px-3 py-2 border border-gray-300"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            >
              <option value="">Select category</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            >
              <option value="">Select subcategory</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Available</label>
            <Input
              type="number"
              min={0}
              max={quantity === '' ? undefined : quantity}
              value={availableQuantity}
              onChange={(e) =>
                setAvailableQuantity(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Estimated Value ($)</label>
            <Input
              type="number"
              step={0.01}
              min={0}
              value={estimatedValue}
              onChange={(e) =>
                setEstimatedValue(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isPublic" className="text-sm">
              Public
            </label>
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="used_good">Used - Good</option>
              <option value="used_fair">Used - Fair</option>
              <option value="for_parts">For Parts</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Images</label>
          <Dropzone
            {...dropzoneProps}
            files={files}
            setFiles={setFiles}
            isSuccess={isSuccess}
            loading={uploadLoading}
            errors={uploadErrors}
            onUpload={onUpload}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer"
          >
            <Upload size={32} className="mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag & drop images here
              <br />
              or <span className="text-blue-500 underline">click to select</span>
            </p>
          </Dropzone>

          {files.length > 0 && (
            <div className="mt-4 flex gap-4 overflow-x-auto">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="relative w-20 h-20 rounded overflow-hidden border"
                >
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 z-10 bg-white/75 rounded-full p-1 hover:bg-white"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                  <img
                    src={(file as any).preview}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Item
        </Button>
      </form>
    </div>
  )
}