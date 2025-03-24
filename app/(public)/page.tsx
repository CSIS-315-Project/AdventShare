import { SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import Hero from "@/features/landing-page/components/public/Hero";
import Features from "@/features/landing-page/components/public/Features";
import ListingsGrid from "@/features/landing-page/components/signed-in/ListingGrid";
import {
  getNewestItems,
  getMyItems,
} from "@/features/landing-page/server/db/items";

export default async function Page() {
  const newestItems = await getNewestItems();
  // const myItems = await getMyItems(userId as string);
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        <SignedOut>
          <div className="space-y-6">
            <Hero />
            <Features />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="space-y-8">
            <ListingsGrid
              title="Newest Goods"
              items={newestItems}
              link="/items"
              linkText="View all items"
            />
            <ListingsGrid
              title="My Postings"
              items={newestItems}
              link="/postings"
              linkText="View all postings"
            />
          </div>
        </SignedIn>
      </div>
      <Footer />
    </main>
  );
}
