import { getUserClaims } from "../server/db/get-user-claims"
import ClaimCard from "./claim-card"
import { EmptyState } from "./empty-state"

export default async function ClaimsList() {
  // Fetch claims data from the server
  const claims = await getUserClaims()

  if (claims.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-6">
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
    </div>
  )
}
