import Image from "next/image";
import Link from "next/link";
import { Item } from "@/types/item";

export default function ItemCard({ item }: { item: Item }) {
  const defaultImageUrl = item.images && item.images[0] ? item.images[0] : "/Logo2.png";
  const imageUrl = defaultImageUrl;
  return (
    <Link href={`/posts/${item.id}`} className="border p-4 rounded shadow hover:shadow-lg hover:cursor-pointer transition max-w-[400px]">
      <Image
        src={imageUrl}
        alt={item.name}
        width={300}
        height={200}
        className="rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
    </Link>
  );
}
