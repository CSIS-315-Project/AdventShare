import Footer from "@/components/Footer";
import SearchResults from "@/features/items/components/SearchResults";
import Pagination from "@/components/pagination";
import { getItems } from "@/features/items/server/db/items";
import { auth } from "@clerk/nextjs/server";

const LIMIT = 12;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const currentPage = Number(params?.page) || 1;

  // Get current user ID if needed
  const user = await auth();
  const userId = user?.userId || "";

  // Update getItems to accept limit/offset and return { data, totalCount }
  const { data: items, totalCount } = await getItems(
    searchQuery,
    LIMIT,
    (currentPage - 1) * LIMIT,
    userId
  );

  return (
    <main className="min-h-screen">
      <SearchResults searchQuery={searchQuery} items={items} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          page={currentPage}
          total={Math.ceil(totalCount / LIMIT)}
        />
      </div>
      <Footer />
    </main>
  );
}
