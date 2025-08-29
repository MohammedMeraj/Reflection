"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AccessControlProps {
  userEmail: string;
  children: React.ReactNode;
  requiredPermission?: "management";
}

export const AccessControl = ({ 
  userEmail, 
  children, 
  requiredPermission = "management" 
}: AccessControlProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [departmentHeadInfo, setDepartmentHeadInfo] = useState<any>(null);

  useEffect(() => {
    // Simulate checking permissions (in real app, this would be an API call)
    const checkAccess = () => {
      // Mock department heads data (in real app, this would come from API/context)
      const mockDepartmentHeads = [
        {
          id: "head-1",
          name: "Dr. Rajesh Kumar",
          email: "rajesh.kumar@institute.edu",
          department: "Computer Science & Engineering",
          managementEnabled: true,
          employeeId: "EMP001",
        },
        {
          id: "head-2",
          name: "Prof. Priya Sharma",
          email: "priya.sharma@institute.edu",
          department: "Information Technology",
          managementEnabled: true,
          employeeId: "EMP002",
        },
        {
          id: "head-3",
          name: "Dr. Amit Patel",
          email: "amit.patel@institute.edu",
          department: "Electronics & Communication",
          managementEnabled: false,
          employeeId: "EMP003",
        },
      ];

      const departmentHead = mockDepartmentHeads.find(head => head.email === userEmail);
      setDepartmentHeadInfo(departmentHead);

      if (!departmentHead) {
        setHasAccess(false);
        return;
      }

      if (requiredPermission === "management") {
        setHasAccess(departmentHead.managementEnabled);
      } else {
        setHasAccess(true);
      }
    };

    checkAccess();
  }, [userEmail, requiredPermission]);

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // No access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          
          {!departmentHeadInfo ? (
            <p className="text-gray-600 mb-6">
              You don't have permission to access this area. Please contact your administrator.
            </p>
          ) : (
            <div className="text-left mb-6">
              <p className="text-gray-600 mb-4">
                Your department management access has been disabled by the super admin.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Your Information:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> {departmentHeadInfo.name}</p>
                  <p><span className="text-gray-500">Department:</span> {departmentHeadInfo.department}</p>
                  <p><span className="text-gray-500">Employee ID:</span> {departmentHeadInfo.employeeId}</p>
                  <p><span className="text-gray-500">Management Access:</span> 
                    <span className="text-red-600 font-medium ml-1">Disabled</span>
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mt-4">
                Contact your super admin to enable management access for your department.
              </p>
            </div>
          )}
          
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Has access - render children
  return <>{children}</>;
};

// Example usage component for department head pages
export const DepartmentHeadProtectedPage = ({ 
  children,
  userEmail = "rajesh.kumar@institute.edu" // This would come from auth context
}: { 
  children: React.ReactNode;
  userEmail?: string;
}) => {
  return (
    <AccessControl userEmail={userEmail} requiredPermission="management">
      {children}
    </AccessControl>
  );
};
