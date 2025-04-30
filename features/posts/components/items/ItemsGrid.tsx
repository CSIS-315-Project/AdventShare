// components/Items/ItemsGrid.tsx
import ItemCard from "./ItemCard";
import { Item } from "@/types/item";

export default function ItemsGrid({ items }: {
  items: Item[]
}) {
  if (items.length === 0) {
    return <p className="text-gray-600">No items found.</p>;
  }

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
