import { getItem } from "@/features/item-view/server/db/get-item";
import ItemViewClient from "@/features/item-view/components/item-view-client";
import { getOrganization } from "@/features/auth/server/db/organizations";
import { redirect } from "next/navigation";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch data on the server
  const item = await getItem((await params).id);

  const organization = await getOrganization();

  if (!organization) {
    return redirect("/")
  }

  // Pass data to client component
  return <ItemViewClient item={item} organization={organization} />;
}