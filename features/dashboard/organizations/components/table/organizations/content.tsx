"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string;
  hasImage: boolean;
  maxAllowedMembers: number;
  membersCount: number | undefined;
  adminDeleteEnabled: boolean;
  createdBy: string | undefined;
  createdAt: string;
}

export function OrganizationsTable({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.length === 0 ? (
        <div className="col-span-full p-8 text-center text-muted-foreground">
          No organizations found.
        </div>
      ) : (
        organizations.map((organization) => (
          <Link
            href={organization.slug ? `/organizations/${organization.slug}` : `/organizations/${organization.id}`}
            key={organization.id}
            className="group block rounded-lg border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {organization.hasImage ? (
                  <img
                    src={organization.imageUrl}
                    alt={organization.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl font-semibold">
                      {organization.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {organization.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {organization.membersCount} /{" "}
                    {organization.maxAllowedMembers} members
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
