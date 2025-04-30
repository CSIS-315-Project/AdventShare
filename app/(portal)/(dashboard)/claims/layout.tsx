import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
