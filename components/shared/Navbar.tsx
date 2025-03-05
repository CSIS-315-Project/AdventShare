import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Searchbar from "@/components/shared/Searchbar";

export default function Navbar() {
  return (
    <Card className="flex flex-row justify-between px-5 py-3 rounded-none">
      <Link href="/" className="flex flex-row gap-2">
        <Image src="/Logo2.png" alt="Logo" height={75} width={75} />
        <h1 className="content-center w-48">AdventShare</h1>
      </Link>
      <SignedIn>
        <div className="flex-1 flex items-center justify-center max-w-xl mx-auto">
          <Searchbar />
        </div>
      </SignedIn>
      <div className="flex flex-row gap-5 items-center text-lg">
        <div
          className="hidden md:flex flex-row gap-5"
          style={{ color: "#003B5C" }}
        >
          <Link href="/post-item" className="p-2">
            Post
          </Link>
          <Link href="/claims" className="p-2">
            Claims
          </Link>
          <Link href="/Profile" className="p-2">
            Profile
          </Link>
        </div>
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
      </div>
    </Card>
  );
}