// components/ListingsGrid.tsx
import ItemCard from "./ItemCard";
import { itemSchema } from "@/schemas/items";
import { z } from "zod";

type ListingsGridProps = {
  title: string;
  items: z.infer<typeof itemSchema>[];
  link: string;
  linkText: string;
};

export default function ListingsGrid({
  title,
  items,
  link,
  linkText,
}: ListingsGridProps) {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-b-md border-2">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No items to display
          </div>
        ) : (
          items.map((item, index) => (
            <ItemCard
              key={index}
              title={item.name}
              postedTime={item.created_at as unknown as string}
              createdBy={item.user_id}
            />
          ))
        )}
      </div>
      <small className="text-gray-500 mt-4 flex justify-end">
        <a href={link} className="hover:underline">
          {linkText}
        </a>
      </small>
    </div>
  );
}
