import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClaimRequestCard from "./card";

export default function ClaimRequestsGrid({ requests }: { requests: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Requests</CardTitle>
        <CardDescription>Manage requests to claim this item</CardDescription>
      </CardHeader>
      <CardContent>
        {claimRequests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No claim requests found for this item
          </div>
        ) : (
          <div className="space-y-4">
            {claimRequests.map((request) => (
              <ClaimRequestCard request={request} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
