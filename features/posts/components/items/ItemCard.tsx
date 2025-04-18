// components/Items/ItemCard.tsx
import Image from "next/image";

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const defaultImageUrl = "/Logo2.png";
  const imageUrl = defaultImageUrl;
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg hover:cursor-pointer transition">
      <Image
        src={item.image_url || imageUrl}
        alt={item.name}
        width={300}
        height={200}
        className="rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
    </div>
  );
}
