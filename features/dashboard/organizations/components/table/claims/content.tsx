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

interface Claim {
	id: string;
	item_id: string;
	title: string;
	description: string | null;
	created_at: string;
	user_id: string;
	organization_id: string;
	status: string;
	updated_at: Date;
	item: {
	  id: string;
	  name: string;
	  description: string | null;
	  quantity: number;
	  updated_at: string;
	  created_at: string;
	  user_id: string;
	  category_id: string;
	  is_public: boolean;
	  organization_id: string;
	};
	user: {
	  id: string;
	  firstName: string | null;
	  lastName: string | null;
	  imageUrl: string;
	  emailAddresses: {
		id: string;
		emailAddress: string;
	  }[];
	};
	itemAuthor: {
	  id: string;
	  firstName: string | null;
	  lastName: string | null;
	  imageUrl: string;
	  emailAddresses: {
		id: string;
		emailAddress: string;
	  }[];
	};
}

export function ClaimsTable({ claims }: { claims: Claim[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No claims found.
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.title}</TableCell>
                <TableCell>{claim.description}</TableCell>
                <TableCell>{claim.item.quantity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>
                      {claim.itemAuthor.firstName} {claim.itemAuthor.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      claim.status === "APPROVED"
                        ? "default"
                        : claim.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(claim.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(claim.id)}
                      >
                        Copy claim ID
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit claim</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete claim
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
