"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClaimRequestCard({ request }: { request: any }) {
  return (
    <div key={request.id} className="border rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{request.user_name}</h3>
            <Badge
              variant={
                request.status === "approved"
                  ? "success"
                  : request.status === "denied"
                  ? "destructive"
                  : "outline"
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{request.user_email}</p>
          <p className="text-sm text-muted-foreground">
            Requested on {new Date(request.requested_at).toLocaleDateString()}
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
              onClick={() => handleClaim(request.id, "denied")}
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
