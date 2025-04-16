import type React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Searchbar from "@/components/Searchbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <header className="border-b  px-4 py-2 shadow">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-row gap-2 items-center">
          <Image src="/Logo2.png" alt="Logo" height={75} width={75} />
          <h1
            className="text-xl font-semibold md:hidden lg:flex"
            style={{ color: "#003B5C" }}
          >
            AdventShare
          </h1>
        </Link>

        {/* Search bar - hidden on mobile, visible on larger screens */}
        <SignedIn>
          <div className="hidden md:flex flex-grow mx-12">
            <Searchbar />
          </div>
        </SignedIn>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <nav className="hidden md:flex space-x-4">
              <NavLink href="/post-item">Post</NavLink>
              <NavLink href="/claims">Claims</NavLink>
              <NavLink href="/Profile">Profile</NavLink>
            </nav>
          </SignedIn>

          <div
            className="hidden md:flex cursor-pointer content-center text-lg"
            style={{ color: "#003B5C" }}
          >
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" style={{ color: "#003B5C" }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem>
                <div
                  className="cursor-pointer content-center text-lg"
                  style={{ color: "#003B5C" }}
                >
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </DropdownMenuItem>
              <SignedIn>
                <DropdownMenuItem>
                  <NavLink href="/post-item">Post</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink href="/claims">Claims</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink href="/Profile">Profile</NavLink>
                </DropdownMenuItem>
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search bar for mobile - visible only on small screens */}
      <SignedIn>
        <div className="mt-2 md:hidden">
          <Searchbar />
        </div>
      </SignedIn>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="p-2 hover:underline"
      style={{ color: "#003B5C" }}
    >
      {children}
    </Link>
  );
}
