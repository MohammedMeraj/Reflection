"use client";

import { useState, useRef, useEffect } from "react";
import { Users, BookOpen, FlaskConical, Building2, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmoothScrollContainer } from "@/components/ui/smooth-scroll-container";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { DepartmentHeadHomeSkeleton } from "@/components/ui/skeleton";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Faculty {
  id: string;
  name: string;
  email: string;
  assignedClasses: string[];
}

interface Class {
  id: string;
  name: string;
  year: string;
  divisions: Division[];
}

interface Division {
  id: string;
  name: string;
  classId: string;
  labs: Lab[];
}

interface Lab {
  id: string;
  name: string;
  divisionId: string;
  rollNumberStart: number;
  rollNumberEnd: number;
}

interface DepartmentHeadDashboardProps {
  facultyList: Faculty[];
  classList: Class[];
  isLoading?: boolean;
}

export const DepartmentHeadDashboard = ({ 
  facultyList, 
  classList, 
  isLoading = false
}: DepartmentHeadDashboardProps) => {
  const { user } = useKindeAuth();
  const currentDepartmentHead = useQuery(api.superAdmin.getDepartmentHeadByEmail, {
    email: user?.email || '',
  });

  const [activeSection, setActiveSection] = useState<'overview' | 'faculty' | 'classes' | 'labs'>('overview');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Get department name from the current department head data
  const departmentName = currentDepartmentHead?.department?.name || 'Department';

  // Debug logging
  console.log('Kinde user object:', user);
  console.log('User email:', user?.email);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show skeleton loading
  if (isLoading) {
    return <DepartmentHeadHomeSkeleton />;
  }

  // Calculate stats
  const totalFaculty = facultyList.length;
  const totalClasses = classList.length;
  const totalDivisions = classList.reduce((acc, cls) => acc + cls.divisions.length, 0);
  const totalLabs = classList.reduce((acc, cls) => 
    acc + cls.divisions.reduce((divAcc, div) => divAcc + div.labs.length, 0), 0
  );

  return (
    <div className="min-h-screen">
      {/* Department Admin Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Department Admin</h1>
          
          {/* Profile Icon with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">Logged in as:</p>
                  <p className="text-sm text-gray-600 break-all">
                    {user?.email || 'Loading user info...'}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      window.location.href = '/departmentHead/profile';
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with top padding for fixed header */}
      <SmoothScrollContainer className="pt-20 pb-20 px-4 max-w-md mx-auto space-y-6">
        {/* Header with Department Name */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{departmentName}</h1>
            <p className="text-sm text-gray-600">Department Management</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Faculty</p>
                <p className="text-lg font-bold text-blue-900">{totalFaculty}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Classes</p>
                <p className="text-lg font-bold text-green-900">{totalClasses}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Divisions</p>
                <p className="text-lg font-bold text-purple-900">{totalDivisions}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Labs</p>
                <p className="text-lg font-bold text-orange-900">{totalLabs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setActiveSection('faculty')}
              className="flex items-center space-x-2 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="w-5 h-5" />
              <span>Manage Faculty</span>
            </Button>
            <Button
              onClick={() => setActiveSection('classes')}
              className="flex items-center space-x-2 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BookOpen className="w-5 h-5" />
              <span>Manage Classes</span>
            </Button>
            <Button
              onClick={() => setActiveSection('labs')}
              className="flex items-center space-x-2 h-12 bg-blue-600 hover:bg-blue-700 text-white col-span-2"
            >
              <FlaskConical className="w-5 h-5" />
              <span>Manage Labs</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Faculty Added</p>
                <p className="text-xs text-gray-600">Dr. Smith added to CSE department</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Class Created</p>
                <p className="text-xs text-gray-600">Second Year Division B configured</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Lab Configured</p>
                <p className="text-xs text-gray-600">T1 lab setup for Division A</p>
              </div>
            </div>
          </div>
        </div>
      </SmoothScrollContainer>
    </div>
  );
};

export default DepartmentHeadDashboard;
