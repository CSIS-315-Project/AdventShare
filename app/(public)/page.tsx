import { SignedIn, SignedOut } from "@clerk/nextjs";
export default function Page() {
  const openSignIn = () => {
    // Logic to open sign-in modal
    console.log("Sign-in modal opened");
  };

  return (
    <div className="grid p-4 h-screen">
      <SignedOut>
        <div className="space-y-6">
          <div
            className="flex flex-col items-center justify-center text-center py-24 rounded-lg"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "rgba(255, 255, 215, 0.9)", // Fallback color
            }}
          >
            <h1 className="text-4xl font-bold text-white">
              Welcome to AdventShare!
            </h1>
            <p
              className="mt-2 text-2xl text-white"
              style={{ color: "#003B5C" }}
            >
              Give What You Don't Need, Claim What You Do!
            </p>
            <p className="mt-2 text-lg text-white" style={{ color: "#003B5C" }}>
              Join our community of schools sharing resources and saving money.
            </p>
            <a
              href="/onboarding"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer"
            >
              Get Started
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Share Resources</h3>
              <p>
                AdventShare is a platform for schools to donate and claim
                educational resources and equipment.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Save Budget</h3>
              <p>
                Reduce costs by claiming items from other schools instead of
                buying new.
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p>
                Create lasting partnerships with other schools in your area
                through resource sharing.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="mt-6 p-6 bg-white rounded-lg shadow-b-md border-2">
          <h2 className="text-2xl font-semibold mb-4">Newest Goods</h2>
          <div className="grid grid-cols-4 space-x-4">
            <div className="border p-4 rounded">
              <h3 className="font-medium">Winter Boots</h3>
              <p className="text-gray-600">Posted 2 hours ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Christmas Decorations</h3>
              <p className="text-gray-600">Posted 5 hours ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Snow Shovel</h3>
              <p className="text-gray-600">Posted 1 day ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Snow Shovel</h3>
              <p className="text-gray-600">Posted 1 day ago</p>
            </div>
          </div>
          <small className="text-gray-500 mt-4 flex justify-end">
            <a href="/items" className="hover:underline">
              View all items
            </a>
          </small>
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-b-md border-2">
          <h2 className="text-2xl font-semibold mb-4">My Postings</h2>
          <div className="grid grid-cols-4 space-x-4">
            <div className="border p-4 rounded">
              <h3 className="font-medium">Winter Boots</h3>
              <p className="text-gray-600">Posted 2 hours ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Christmas Decorations</h3>
              <p className="text-gray-600">Posted 5 hours ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Snow Shovel</h3>
              <p className="text-gray-600">Posted 1 day ago</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-medium">Snow Shovel</h3>
              <p className="text-gray-600">Posted 1 day ago</p>
            </div>
          </div>
          <small className="text-gray-500 mt-4 flex justify-end">
            <a href="/postings" className="hover:underline">
              View all postings
            </a>
          </small>
        </div>
      </SignedIn>
    </div>
  );
}
