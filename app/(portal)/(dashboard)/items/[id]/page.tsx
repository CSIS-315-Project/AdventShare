import { getItem } from "@/features/item-view/server/db/get-item";
import ItemViewClient from "@/features/item-view/components/item-view-client";

export default async function ItemPage({ params }: { params: { id: string } }) {
  // Fetch data on the server
  const item = await getItem(params.id);

  // Pass data to client component
  return <ItemViewClient item={item} />;
}
