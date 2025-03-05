import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Searchbar from "@/components/Searchbar";
export default function Navbar() {
  return (
    <Card className="flex flex-row justify-between px-5 py-3 rounded-none">
      <Link href="/" className="flex flex-row gap-2">
        <Image src="/Logo.png" alt="Logo" height={50} width={50} />
        <h1 className="content-center">AdventShare</h1>
      </Link>
      <Searchbar />
      <div className="flex flex-row gap-5 items-center">
        <div className="hidden md:flex flex-row gap-5 ">
          <Link href="/post-item" className="p-2">
            Post
          </Link>
          <Link href="/items" className="p-2">
            Claims
          </Link>
          <Link href="/profile" className="p-2">
            Profile
          </Link>
          <div className="cursor-pointer content-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </Card>
  );
}
