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
  
  const createPageURL = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

  return (
    <CardFooter className="flex flex-row gap-2 items-center justify-between border-t px-6 py-4">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{page}</strong> of <strong>{total}</strong> pages
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => redirect(createPageURL(page - 1))}
          variant="outline"
          size="sm"
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => redirect(createPageURL(page + 1))}
          variant="outline"
          size="sm"
          disabled={page === total}
        >
          Next
        </Button>
      </div>
    </CardFooter>
  );
}
