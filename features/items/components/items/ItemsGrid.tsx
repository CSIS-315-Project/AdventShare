// components/Items/ItemsGrid.tsx
import ItemCard from "./ItemCard";
import { itemSchema } from "@/schemas/items";
import { z } from "zod";

interface ItemsGridProps {
  title: string;
  items: z.infer<typeof itemSchema>[];
}

export default function ItemsGrid({ items }: ItemsGridProps) {
  if (items.length === 0) {
    return <p className="text-gray-600">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          id={item.id}
          title={item.name}
          postedTime={item.created_at as unknown as string}
          createdBy={item.organization_name || ""}
          imageUrl={item.image_url || undefined}
        />
      ))}
    </div>
  );
}
