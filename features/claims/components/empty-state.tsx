import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <PackageSearch className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No claims yet</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        You haven't claimed any items yet. Browse available items from schools in your area and claim what you need.
      </p>
      <Link href="/">
        <Button>Browse Items</Button>
      </Link>
    </div>
  )
}
