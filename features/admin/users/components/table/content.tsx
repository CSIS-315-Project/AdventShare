"use client";

import type React from "react";

import { useState } from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditUser } from "../forms/edit";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { deleteUser } from "../../server/actions/users";
import { toast } from "sonner";

export function UsersTable({
  users = [],
}: {
  users: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    createdAt: number;
  }[];
}) {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);

  const handleDelete = (user: any) => {
    const action = deleteUser.bind(null, user.id);

    toast.promise(action(), {
      loading: "Deleting useranization...",
      success: "useranization deleted successfully!",
      error: (err) => {
        return `Error: ${err}`;
      },
    });

    // Pull the user from users.
    users = users.filter((o) => o.id !== user.id);

    setDeletingUser(null);
  };

  return (
    <CardContent className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">First Name</TableHead>
            <TableHead className="hidden md:table-cell">Last Name</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.firstName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.lastName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(user.createdAt).toLocaleString()}
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit useranization Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit useranization</DialogTitle>
            <DialogDescription>
              Update the details for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <EditUser user={editingUser} onClose={() => setEditingUser(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              useranization
              <strong> {deletingUser?.name} </strong>
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDelete(deletingUser)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardContent>
  );
}
