import CreateItemForm from "@/features/item-create/components/create-item-form"
import { getSubcategories } from "@/features/posts/server/db/subcategories";

export default async function CreateItemPage() {
  const subcategories = await getSubcategories();
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Item</h1>
      <CreateItemForm subcategories={subcategories}  />
    </div>
  )
}