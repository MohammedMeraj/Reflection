"use client";

import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useKindeAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    qualification: "",
    experience: 0,
    phone: "",
    employeeId: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get current department head data
  const departmentHead = useQuery(
    api.superAdmin.getDepartmentHeadByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  // Update mutation
  const updateDepartmentHead = useMutation(api.superAdmin.updateDepartmentHead);

  // Initialize form data when department head data loads
  useState(() => {
    if (departmentHead) {
      setProfileData({
        name: departmentHead.name || "",
        qualification: departmentHead.qualification || "",
        experience: departmentHead.experience || 0,
        phone: departmentHead.phone || "",
        employeeId: departmentHead.employeeId || "",
      });
    }
  });

  const handleSave = async () => {
    try {
      if (!departmentHead?._id) return;

      await updateDepartmentHead({
        id: departmentHead._id,
        name: profileData.name,
        qualification: profileData.qualification,
        experience: profileData.experience,
        phone: profileData.phone,
      });

      setIsEditing(false);
      setShowConfirmation(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (departmentHead) {
      setProfileData({
        name: departmentHead.name || "",
        qualification: departmentHead.qualification || "",
        experience: departmentHead.experience || 0,
        phone: departmentHead.phone || "",
        employeeId: departmentHead.employeeId || "",
      });
    }
    setIsEditing(false);
  };

  if (!departmentHead) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowConfirmation(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with proper padding for fixed header and bottom navigation */}
      <div className="pt-20 pb-20 p-4 max-w-md mx-auto space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {departmentHead.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">{departmentHead.name}</h2>
            <p className="text-sm text-gray-600">{departmentHead.department?.name}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{departmentHead.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read-only)</label>
              <p className="text-gray-500 bg-gray-50 p-2 rounded-md">{departmentHead.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID (Read-only)</label>
              <p className="text-gray-500 bg-gray-50 p-2 rounded-md">{departmentHead.employeeId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{departmentHead.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              {isEditing ? (
                <textarea
                  value={profileData.qualification}
                  onChange={(e) => setProfileData({...profileData, qualification: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Ph.D in Computer Science, M.Tech"
                />
              ) : (
                <p className="text-gray-800">{departmentHead.qualification || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              ) : (
                <p className="text-gray-800">{departmentHead.experience || 0} years</p>
              )}
            </div>
          </div>
        </div>

        {/* Department Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Department:</span>
              <span className="text-sm text-gray-800">{departmentHead.department?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Department Code:</span>
              <span className="text-sm text-gray-800">{departmentHead.department?.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${departmentHead.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {departmentHead.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Changes</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save these changes to your profile?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
