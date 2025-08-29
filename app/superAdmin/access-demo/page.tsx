"use client";

import { useState } from "react";
import { AccessControl } from "@/app/_component/super-admin/AccessControl";
import { Shield, Users, Settings } from "lucide-react";

export default function AccessControlDemoPage() {
  const [selectedUser, setSelectedUser] = useState("rajesh.kumar@institute.edu");

  const testUsers = [
    {
      email: "rajesh.kumar@institute.edu",
      name: "Dr. Rajesh Kumar",
      department: "Computer Science & Engineering",
      hasAccess: true,
    },
    {
      email: "priya.sharma@institute.edu", 
      name: "Prof. Priya Sharma",
      department: "Information Technology",
      hasAccess: true,
    },
    {
      email: "amit.patel@institute.edu",
      name: "Dr. Amit Patel", 
      department: "Electronics & Communication",
      hasAccess: false,
    },
    {
      email: "unknown@institute.edu",
      name: "Unknown User",
      department: "Unknown",
      hasAccess: false,
    },
  ];

  const selectedUserInfo = testUsers.find(user => user.email === selectedUser);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Access Control Demo</h1>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Test different department heads to see access control in action:</p>
          <div className="flex flex-wrap gap-2">
            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => setSelectedUser(user.email)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedUser === user.email
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {user.name} {user.hasAccess ? '✅' : '❌'}
              </button>
            ))}
          </div>
          {selectedUserInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Testing as:</span> {selectedUserInfo.name} 
                <span className="ml-2 text-gray-500">({selectedUserInfo.email})</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  selectedUserInfo.hasAccess 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedUserInfo.hasAccess ? 'Access Granted' : 'Access Denied'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Access Controlled Content */}
      <AccessControl userEmail={selectedUser} requiredPermission="management">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Department Management Access Granted!</h2>
                  <p className="text-gray-600">You have permission to manage your department.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Faculty Management</h3>
                  </div>
                  <p className="text-sm text-blue-700">Add, edit, and manage faculty members in your department.</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Class Management</h3>
                  </div>
                  <p className="text-sm text-green-700">Create and organize classes, divisions, and laboratory sessions.</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Department Settings</h3>
                  </div>
                  <p className="text-sm text-purple-700">Configure department-specific settings and preferences.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Current Access Level</h4>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Full Management Access
                  </span>
                  <span className="text-sm text-gray-600">
                    - Enabled by Super Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccessControl>
    </div>
  );
}
