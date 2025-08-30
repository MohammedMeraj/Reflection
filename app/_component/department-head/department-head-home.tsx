"use client";

import { useState } from "react";
import { Users, BookOpen, FlaskConical, Building2, Edit3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  departmentName: string;
}

export const DepartmentHeadDashboard = ({ 
  facultyList, 
  classList, 
  departmentName 
}: DepartmentHeadDashboardProps) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'faculty' | 'classes' | 'labs'>('overview');
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [departmentNameInput, setDepartmentNameInput] = useState(departmentName);
  const [confirmationStep, setConfirmationStep] = useState(0);

  // Calculate stats
  const totalFaculty = facultyList.length;
  const totalClasses = classList.length;
  const totalDivisions = classList.reduce((acc, cls) => acc + cls.divisions.length, 0);
  const totalLabs = classList.reduce((acc, cls) => 
    acc + cls.divisions.reduce((divAcc, div) => divAcc + div.labs.length, 0), 0
  );

  const handleDepartmentRename = () => {
    if (confirmationStep < 2) {
      setConfirmationStep(confirmationStep + 1);
    } else {
      // Proceed with rename
      console.log("Department renamed to:", departmentNameInput);
      setIsEditingDepartment(false);
      setConfirmationStep(0);
    }
  };

  const cancelRename = () => {
    setIsEditingDepartment(false);
    setConfirmationStep(0);
    setDepartmentNameInput(departmentName);
  };

  const warningMessages = [
    "Are you sure you want to rename the department? This action will affect all related records.",
    "This is your second warning. Renaming the department will update all faculty and class associations.",
    "FINAL WARNING: This action cannot be undone. All IDs will remain the same, but the department name will be permanently changed."
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      {/* Header with Department Name */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          {isEditingDepartment ? (
            <div className="flex-1">
              <input
                type="text"
                value={departmentNameInput}
                onChange={(e) => setDepartmentNameInput(e.target.value)}
                className="w-full p-2 border rounded-md text-lg font-semibold"
                placeholder="Department Name"
              />
              {confirmationStep > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-red-700 text-sm font-medium">
                        Warning {confirmationStep}/3
                      </p>
                      <p className="text-red-600 text-xs mt-1">
                        {warningMessages[confirmationStep - 1]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex space-x-2 mt-3">
                <Button
                  onClick={handleDepartmentRename}
                  className={`flex-1 ${confirmationStep === 2 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {confirmationStep === 2 ? 'Confirm Rename' : `Confirm (${confirmationStep + 1}/3)`}
                </Button>
                <Button
                  onClick={cancelRename}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{departmentName}</h1>
                <p className="text-sm text-gray-600">Department Management</p>
              </div>
              <Button
                onClick={() => setIsEditingDepartment(true)}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </>
          )}
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
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Classes</p>
                <p className="text-lg font-bold text-blue-900">{totalClasses}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Divisions</p>
                <p className="text-lg font-bold text-blue-900">{totalDivisions}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Labs</p>
                <p className="text-lg font-bold text-blue-900">{totalLabs}</p>
              </div>
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
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Class Created</p>
              <p className="text-xs text-gray-600">Third Year class with 2 divisions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Lab Configured</p>
              <p className="text-xs text-gray-600">T1 lab setup for Division A</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
