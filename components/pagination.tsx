"use client";

import { redirect, usePathname, useSearchParams } from 'next/navigation';

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Pagination({
  page,
  offset,
  total,
  limit,
}: {
  page: number;
  offset: number;
  total: number;
  limit: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", Math.min(offset + limit, total - 1).toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <CardFooter className="flex items-center justify-between border-t px-6 py-4">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{page}</strong> of <strong>{total}</strong> pages
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => redirect(createPageURL(currentPage - 1))}
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => redirect(createPageURL(currentPage + 1))}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </CardFooter>
  );
}
