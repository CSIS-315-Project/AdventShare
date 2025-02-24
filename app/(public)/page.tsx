import Image from "next/image";

export default function Page() {
  return (
    <div className="grid p-4 h-screen">
      <div>
        <h1 className="text-4xl font-bold">Welcome to AdventShare!</h1>
        <p className="mt-2 text-lg">
          A platform for sharing and discovering items in your community.
        </p>
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-b-md border-2">
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
    </div>
    // <div className="grid border-b justify-center">
    //   {/* <div className="text-center">
    //     <h1>Welcome to AdventShare!</h1>
    //   </div> */}
    //   <div className="relative w-full">
    //     <Image
    //       src="/image.png"
    //       alt="AdventShare Logo"
    //       width={2560}
    //       height={1000}
    //       className="opacity-95"
    //     />
    //     <div className="absolute inset-0 flex items-center justify-center">
    //       <h2 className="text-black text-4xl font-bold bg-opacity-50 p-4 rounded">
    //         Welcome to AdventShare
    //       </h2>
    //     </div>
    //   </div>
    // </div>
  );
}
