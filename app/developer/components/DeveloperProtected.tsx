"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DeveloperProtectedProps {
  children: React.ReactNode;
}

export function DeveloperProtected({ children }: DeveloperProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("developerAuth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        router.push("/developer");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying developer access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
