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

interface Post {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
  organization_id: string;
  quantity: number;
  category_id: string;
  updated_at: Date;
  is_public: boolean;
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
}

export function PostsTable({ posts }: { posts: Post[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.name}</TableCell>
                <TableCell>{post.description}</TableCell>
                <TableCell>{post.quantity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{post.user.firstName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={post.is_public ? "default" : "secondary"}>
                    {post.is_public ? "Public" : "Private"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(post.created_at).toLocaleDateString()}
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
                        onClick={() => navigator.clipboard.writeText(post.id)}
                      >
                        Copy post ID
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit post</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete post
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
