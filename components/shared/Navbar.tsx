import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Navbar() {
  return (
    <Card className="flex flex-row justify-between p-5 m-5">
      <div className="flex flex-row gap-2">
        <Image src="/Logo.png" alt="Logo" height={50} width={50} />
        <h1 className="content-center">AdventShare</h1>
      </div>
      <div className="cursor-pointer content-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </Card>
  );
}
