import React from "react";

export default function Footer() {
  return (
    <footer className="text-white py-6 w-full" style={{ backgroundColor: "#002c44" }}>
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 AdventShare. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 text-sm">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
