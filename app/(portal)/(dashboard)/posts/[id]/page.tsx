import Footer from "@/components/Footer";
import { getItem } from "@/features/auth/server/db/items";
import { getSubcategories } from "@/features/posts/server/db/subcategories";
import Item from "@/features/posts/components/forms/items/edit";
import { redirect } from "next/navigation";

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;
  const item = await getItem(postId);
  const subcategories = await getSubcategories();

  if (!item) {
    return redirect("/posts")
  }

  return (
    <div>
      <Item subcategories={subcategories} item={item} />
      <Footer />
    </div>
  );
}
