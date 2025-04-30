"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ClaimRequestCard from "./card";
import { Claim } from "@/types/claim";

export function ClaimsTable({ claims }: { claims: Claim[] }) {
  if (!claims || claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-lg font-medium text-gray-600">
          No requests yet!
        </p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          We'll notify you via email as soon as someone requests this item.
        </p>
      </div>
    );
  }

  return (
    <>
      {claims.map((claim: Claim) => (
        <ClaimRequestCard key={claim.id} request={claim} />
      ))}
    </>
  );
}
