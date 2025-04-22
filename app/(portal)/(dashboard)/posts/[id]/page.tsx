import Footer from "@/components/Footer";
import ItemGrid from "@/features/posts/components/items/ItemsGrid";
import { getItem } from "@/features/auth/server/db/items";

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;
  const items = await getItem(postId);

  return (
    <main className="min-h-screen">
      <ItemGrid items={items} />
      <Footer />
    </main>
  );
}
