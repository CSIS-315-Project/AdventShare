// components/ListingsGrid.tsx
import ItemCard from "./ItemCard";
import { itemSchema } from "@/schemas/items";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No items to display
        </div>
      ) : (
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full relative px-4"
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ItemCard
                  id={item.id}
                  title={item.name}
                  postedTime={item.created_at as unknown as string}
                  createdBy={item.organization_name || ""}
                  imageUrl={item.image_url || undefined}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      )}

      <small className="text-gray-500 mt-4 flex justify-end">
        <a href={link} className="hover:underline">
          {linkText}
        </a>
      </small>
    </div>
  );
}
