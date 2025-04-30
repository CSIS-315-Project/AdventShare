import Link from "next/link";
import { formatCurrency } from "@/lib/format";

// components/ItemCard.tsx

type ItemCardProps = {
  id: string; // Add an id prop
  imageUrl?: string;
  title: string;
  value?: number;
  postedTime: string;
  createdBy: string;
  isMyPosting?: boolean; // Add this prop
};

export default function ItemCard({
  id,
  title,
  value,
  imageUrl,
  createdBy,
  postedTime,
  isMyPosting, // Default to false
}: ItemCardProps) {
  const defaultImageUrl = "/Logo2.png";
  const image = imageUrl || defaultImageUrl;

  const formatedPostedTime = new Date(postedTime).toLocaleDateString();
  
  // Conditionally set the link
  const href = isMyPosting ? `/posts/${id}` : `/items/${id}`;

  return (
    <Link href={href}>
      <div className="border rounded shadow hover:shadow-lg hover:cursor-pointer transition">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-60 object-cover rounded-t"
          />
        ) : (
          <div className="h-40 bg-gray-200 flex items-center justify-center">
            No Image Available
          </div>
        )}
        <div className="px-4 pb-4">
          <h3 className="font-medium text-lg overflow-hidden pt-1">{title}</h3>
          {/* Display estimated value if available */}
          {value !== undefined && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                Estimated Value: {formatCurrency(value)}
              </span>
            </div>
          )}
          <p className="text-gray-600 text-sm overflow-hidden">{createdBy}</p>
          <p className="text-gray-600 text-sm">{formatedPostedTime}</p>
        </div>
      </div>
    </Link>
  );
}
