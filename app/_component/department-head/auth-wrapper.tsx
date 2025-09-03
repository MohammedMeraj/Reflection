"use client";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactNode } from "react";

interface DepartmentHeadAuthWrapperProps {
  children: ReactNode;
}

export const DepartmentHeadAuthWrapper = ({ children }: DepartmentHeadAuthWrapperProps) => {
  const { user, isLoading: authLoading } = useKindeAuth();

  // Get current department head information based on logged-in user email
  const currentDepartmentHead = useQuery(
    api.superAdmin.getDepartmentHeadByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  // Show loading while authentication is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching department head data
  if (user?.email && currentDepartmentHead === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading department information...</p>
        </div>
      </div>
    );
  }

  // Show error if user is not logged in
  if (!user?.email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Authentication Required</h2>
          <p className="text-yellow-600 mb-4">
            Please log in to access the department management system.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Show error if user is logged in but not found as department head
  if (user.email && currentDepartmentHead === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-600 mb-4">
            You are not registered as a department head in the system.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Logged in as: {user.email}
          </p>
          <p className="text-xs text-red-400">
            Please contact the system administrator to request department head access.
          </p>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
};
