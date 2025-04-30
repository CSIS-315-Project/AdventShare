import CreateItemForm from "@/features/item-create/components/create-item-form"

export default async function CreateItemPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Item</h1>
      <CreateItemForm  />
    </div>
  )
}