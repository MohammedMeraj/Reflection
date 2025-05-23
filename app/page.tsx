"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  
  // Check if device width is less than 600px
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    // Initial check
    checkWidth();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkWidth);
    
    // Clean up
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  
  // Handle button click to redirect to faculty page
  const handleLaunchFaculty = () => {
    router.push("/faculty");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md text-center">
        {isMobile ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Reflektion</h1>
            <h5 className="mb-6">Organizational Management Solution</h5>
            <div className="bg-amber-100 p-4 rounded-md mb-6">
              <p className="text-amber-800 font-medium">🚧 Under Construction 🚧</p>
              <Link href="https://github.com/MohammedMeraj/Reflection"><p className="text-amber-700 underline text-sm mt-1">View this project on GitHub</p></Link>
              
            </div>
            <Button 
              onClick={handleLaunchFaculty}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Launch for faculty
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Reflektion</h1>
            <h5 className="mb-6">Organizational Management Solution</h5>
            <div className="bg-amber-100 p-4 rounded-md mb-6">
              <p className="text-amber-800 font-medium">🚧 Under Construction 🚧</p>
              <Link href="https://github.com/MohammedMeraj/Reflection"><p className="text-amber-700 underline text-sm mt-1">View this project on GitHub</p></Link>
              
            </div>
            <div className="bg-blue-100 p-4 rounded-md">
              <p className="text-blue-800 font-medium">Please switch to mobile width to continue</p>
              <p className="text-blue-700 text-sm mt-1">This application is optimized for mobile devices</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}