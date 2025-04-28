import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function ClaimsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  <Skeleton className="h-4 w-32" />
                </h3>
                <Badge>
                  <Skeleton className="h-4 w-16" />
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground">
                Requested on <Skeleton className="h-4 w-24" />
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Reason:</span>{" "}
                <Skeleton className="h-4 w-32" />
              </p>
            </div>

            <div className="flex gap-2 self-end md:self-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                disabled
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                disabled
              >
                <X className="h-4 w-4" />
                Deny
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
