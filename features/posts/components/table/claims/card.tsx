"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateClaimStatus } from "@/features/posts/server/actions/claim";
import { Claim } from "@/types/claim";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function ClaimRequestCard({ request }: { request: Claim }) {
  const handleClaim = async (id: string, status: string) => {
    toast.promise(updateClaimStatus.bind(null, id, status), {
      loading: "Updating claim...",
      success: "Claim updated successfully!",
      error: (err) => {
        return `Error: ${err}`;
      }
    });
  }

  return (
    <div key={request.id} className="border rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{request.user.firstName} {request.user.lastName}</h3>
            <Badge
              variant={
                request.status === "approved"
                  ? "default"
                  : request.status === "rejected"
                  ? "destructive"
                  : "outline"
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{request.user.emailAddresses[0].emailAddress}</p>
          <p className="text-sm text-muted-foreground">
            Requested on {new Date(request.created_at).toLocaleDateString()}
          </p>
          {request.reason && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Reason:</span> {request.reason}
            </p>
          )}
        </div>

        {request.status === "pending" && (
          <div className="flex gap-2 self-end md:self-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => handleClaim(request.id, "approved")}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => handleClaim(request.id, "rejected")}
            >
              <X className="h-4 w-4" />
              Deny
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
