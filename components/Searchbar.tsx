"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/items?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form className="flex w-full max-w-4xl" onSubmit={handleSearch}>
      <select className="rounded-l-sm border border-r-0 border-gray-300 px-2 focus:outline-none bg-slate-200">
        <option value="all">All</option>
        <option value="items">Items</option>
        <option value="users">Users</option>
      </select>
      <Input
        type="search"
        placeholder="Search AdventShare..."
        className="flex-grow rounded-r-none rounded-l-none border-r-0 bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        type="submit"
        className="rounded-l-none bg-[#003B5C] hover:bg-[#003B5C] text-white"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
