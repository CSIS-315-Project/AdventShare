import { getItem } from "@/features/item-view/server/db/get-item";
import ItemViewClient from "@/features/item-view/components/item-view-client";

export default async function ItemPage(props: { params: { id: string } }) {
  // Await params before using its properties
  const { params } = await Promise.resolve(props);
  const item = await getItem(params.id);

  // Pass data to client component
  return <ItemViewClient item={item} />;
}
