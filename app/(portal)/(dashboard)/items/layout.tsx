import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
}
