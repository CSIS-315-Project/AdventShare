import { Search } from "lucide-react";

export default function Searchbar() {
  return (
    <div
      id="search-bar"
      className="flex flex-row focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-opacity-50 focus-within:rounded-sm"
    >
      <select className="rounded-l-sm border-2 border-r-0 border-gray-300 p-2 focus:outline-none bg-slate-200">
        <option value="all">All</option>
        <option value="items">Items</option>
        <option value="users">Users</option>
      </select>
      <input
        type="text"
        placeholder="Search AdventShare"
        className="border-y-2 border-gray-300 p-2 w-96 focus:outline-none"
      />
      <button className="bg-blue-600 text-white rounded-r-sm p-2 px-4 focus:outline-none">
        <Search />
      </button>
    </div>
  );
}
