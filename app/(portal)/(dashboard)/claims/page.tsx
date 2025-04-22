import Footer from "@/components/Footer";
import SearchResults from "@/features/posts/components/SearchResults";
import { getClaims } from "@/features/auth/server/db/items";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchQuery = (await searchParams)?.search || null;
  const items = await getClaims(searchQuery);

  return (
    <main className="min-h-screen">
      <SearchResults searchQuery={searchQuery} items={items} />
      <Footer />
    </main>
  );
}
