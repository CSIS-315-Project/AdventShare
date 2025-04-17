import Link from "next/link";

// components/ItemCard.tsx

type ItemCardProps = {
  id: string; // Add an id prop
  imageUrl?: string;
  title: string;
  postedTime: string;
  createdBy: string;
};

export default function ItemCard({
  id,
  title,
  imageUrl,
  createdBy,
  postedTime,
}: ItemCardProps) {
  const defaultImageUrl = "/Logo2.png";
  const image = imageUrl || defaultImageUrl;

  const formatedPostedTime = new Date(postedTime).toLocaleDateString();

  return (
    <Link href={`/items/${id}`}>
      <div className="border p-4 rounded shadow hover:shadow-lg hover:cursor-pointer transition">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="h-40 bg-gray-200 flex items-center justify-center">
            No Image Available
          </div>
        )}
        <h3 className="font-medium overflow-hidden">{title}</h3>
        <p className="text-gray-600 text-sm overflow-hidden">{createdBy}</p>
        <p className="text-gray-600">{formatedPostedTime}</p>
      </div>
    </Link>
  );
}
