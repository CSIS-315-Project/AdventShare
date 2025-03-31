"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CreateUser } from "../forms/create";

export default function Header({
  organizations,
}: {
  organizations: {
    id: string;
    name: string;
  }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <CardHeader>
      <CardTitle>Users</CardTitle>
      <CardDescription>
        Manage user accounts, permissions, and authentication settings.
      </CardDescription>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Check className="mr-2 h-4 w-4" />
              <span>All Users</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="ml-6">Active</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="ml-6">Inactive</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="ml-6">Locked</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateUser organizations={organizations} />
      </div>
    </CardHeader>
  );
}
