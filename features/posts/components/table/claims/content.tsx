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
      <div className="flex items-center justify-center py-4">
        <p>No claims found.</p>
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
