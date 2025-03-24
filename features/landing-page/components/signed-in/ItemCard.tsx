// components/ItemCard.tsx
type ItemCardProps = {
  imageUrl?: string;
  title: string;
  postedTime: string;
  createdBy: string;
};

export default function ItemCard({
  title,
  createdBy,
  postedTime,
}: ItemCardProps) {
  const defaultImageUrl = "/Logo2.png";
  const imageUrl = defaultImageUrl;

  const formatedPostedTime = new Date(postedTime).toLocaleDateString();

  return (
    <div className="border p-4 rounded">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="h-40 bg-gray-200 flex items-center justify-center">
          No Image Available
        </div>
      )}
      <h3 className="font-medium">{title}</h3>
      <p className="text-gray-600 text-sm">{createdBy}</p>
      <p className="text-gray-600">{formatedPostedTime}</p>
    </div>
  );
}
