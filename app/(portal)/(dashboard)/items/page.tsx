import Footer from "@/components/Footer";
import SearchResults from "@/features/items/components/SearchResults";
import { getItems } from "@/features/items/server/db/items";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams?.search || null;
  const items = await getItems(searchQuery);

  return (
    <main className="min-h-screen">
      <SearchResults searchQuery={searchQuery} items={items} />
      <Footer />
    </main>
  );
}
