import Footer from "@/components/Footer";
import SearchResults from "@/features/posts/components/SearchResults";
import { getItems } from "@/features/auth/server/db/items";
import { Item } from "@/types/item";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchQuery = (await searchParams)?.search;
  const items = (await getItems(searchQuery || "")).filter((item) => item !== null) as Item[];

  return (
    <main className="min-h-screen">
      <SearchResults searchQuery={searchQuery || ""} items={items} />
      <Footer />
    </main>
  );
}
