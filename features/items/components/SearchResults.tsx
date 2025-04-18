// components/SearchResults.tsx
import ItemsGrid from "./items/ItemsGrid";

interface SearchResultsProps {
  searchQuery: string | null;
  items: Array<{
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  }>;
}

export default function SearchResults({
  searchQuery,
  items,
}: SearchResultsProps) {
  return (
    <main className="p-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {searchQuery ? `Results for "${searchQuery}"` : "All Items"}
        </h1>
      </div>
      <ItemsGrid
        title={searchQuery ? `Results for "${searchQuery}"` : "All Items"}
        items={items as any}
      />
    </main>
  );
}
