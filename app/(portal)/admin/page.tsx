import { getAdminStats } from "@/features/admin/overview/server/db/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Package, FileText, FolderTree } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdministrationPage() {
  const stats = await getAdminStats();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Administration Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system statistics and recent activity.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">{stats.stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">{stats.stats.organizations}</div>
            <p className="text-xs text-muted-foreground">
              Active organizations
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">{stats.stats.items}</div>
            <p className="text-xs text-muted-foreground">
              Total items in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-2xl font-bold">{stats.stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Item categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentActivity.claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      {claim.items?.name || "Unknown Item"}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentActivity.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
