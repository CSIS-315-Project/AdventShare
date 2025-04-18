// components/Items/ItemsGrid.tsx
import ItemCard from "./ItemCard";

interface ItemsGridProps {
  items: Array<{
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  }>;
}

export default function ItemsGrid({ items }: ItemsGridProps) {
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
