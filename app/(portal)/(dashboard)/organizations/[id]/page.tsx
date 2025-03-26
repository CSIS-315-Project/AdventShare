import { getOrganization } from "@/features/dashboard/organizations/server/db/organization";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, Shield } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const organizationId = (await params).id;

  const organization = await getOrganization({
    organizationId,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-4">
            {organization.imageUrl ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="text-2xl font-semibold">
                  {organization.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {organization.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">
              {organization.membersCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Max allowed: {organization.maxAllowedMemberships}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">
              {new Date(organization.createdAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(organization.createdAt).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">
              {organization.adminDeleteEnabled ? "Active" : "Protected"}
            </div>
            <p className="text-xs text-muted-foreground">
              {organization.adminDeleteEnabled 
                ? "Can be deleted by admins" 
                : "Protected from deletion"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Organization Details</h2>
        <Card>
          <CardContent className="py-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Created By</span>
                <span className="col-span-3 text-muted-foreground">
                  {organization.createdBy || "Unknown"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Last Updated</span>
                <span className="col-span-3 text-muted-foreground">
                  {new Date(organization.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Public Metadata</span>
                <span className="col-span-3 text-muted-foreground">
                  {Object.keys(organization.publicMetadata || {}).length > 0
                    ? JSON.stringify(organization.publicMetadata, null, 2)
                    : "No public metadata"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
