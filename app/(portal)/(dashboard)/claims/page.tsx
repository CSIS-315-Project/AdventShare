import { Suspense } from "react"
import type { Metadata } from "next"
import ClaimsList from "@/features/claims/components/claims-list"
import ClaimsPageSkeleton from "@/features/claims/components/claims-page-skeleton"

export const metadata: Metadata = {
  title: "My Claims - AdventShare",
  description: "Manage your claimed items",
}

export default function ClaimsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">My Claims</h1>
      <p className="text-muted-foreground mb-8">Manage your claimed items from schools in your area</p>

      <Suspense fallback={<ClaimsPageSkeleton />}>
        <ClaimsList />
      </Suspense>
    </div>
  )
}
