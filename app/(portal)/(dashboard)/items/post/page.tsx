import CreateItemForm from "@/features/item-create/components/create-item-form"
import { getCategories } from "@/features/item-create/server/db/get-categories"

export default async function CreateItemPage() {
  // Fetch categories from our mock database
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Item</h1>
      <CreateItemForm categories={categories} />
    </div>
  )
}
