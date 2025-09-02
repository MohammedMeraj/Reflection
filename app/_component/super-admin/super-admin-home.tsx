"use client";

import { useState } from "react";
import { ChevronRight, Users, Building2, GraduationCap, AlertTriangle, Bell, BarChart3, Calendar, UserCheck, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SmoothScrollContainer } from "@/components/ui/smooth-scroll-container";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { SuperAdminSkeleton } from "@/components/ui/skeleton";

interface DepartmentStats {
  id: string;
  name: string;
  totalFaculty: number;
  totalStudents: number;
  averageAttendance: number;
  lowAttendanceClasses: number;
  defaulters: number;
}

interface DepartmentHead {
  id: string;
  name: string;
  email: string;
  department: string;
  managementEnabled: boolean;
  employeeId: string;
  joinedDate: string;
}

interface SuperAdminDashboardProps {
  adminName: string;
  departments: DepartmentStats[];
  organizationName: string;
  organizationType: string;
  logoSrc: string;
  notifications?: number;
  realTimeStats?: any;
  realTimeDepartmentHeads?: DepartmentHead[];
  realTimeDepartments?: any[];
  isLoading?: boolean;
}

export const SuperAdminDashboard = ({
  adminName,
  departments,
  organizationName,
  organizationType,
  logoSrc,
  notifications = 0,
  realTimeStats,
  realTimeDepartmentHeads,
  realTimeDepartments,
  isLoading = false,
}: SuperAdminDashboardProps) => {
  // Show skeleton loading
  if (isLoading) {
    return <SuperAdminSkeleton />;
  }
  // Use real-time data if available, otherwise use empty array
  const displayedDepartmentHeads = realTimeDepartmentHeads || [];
  
  // Use real stats from Convex if available, otherwise calculate from departments
  const totalDepartments = realTimeStats?.totalDepartments || departments.length;
  const totalFaculty = realTimeStats?.totalFaculty || departments.reduce((total, dept) => total + dept.totalFaculty, 0);
  const totalStudents = realTimeStats?.totalStudents || departments.reduce((total, dept) => total + dept.totalStudents, 0);
  const totalDefaulters = realTimeStats?.totalDefaulters || departments.reduce((total, dept) => total + dept.defaulters, 0);
  const lowAttendanceClasses = departments.reduce((total, dept) => total + dept.lowAttendanceClasses, 0);
  
  const overallAttendance = realTimeStats?.overallAttendanceRate || 
    (departments.length > 0
      ? Math.round(departments.reduce((sum, dept) => sum + dept.averageAttendance, 0) / departments.length)
      : 0);
  
  // Get the current month for attendance summary
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  return (
    <SmoothScrollContainer className="flex flex-col min-h-screen bg-slate-50">
      {/* Header with app name, organization logo and notifications */}
      <div className="bg-white shadow-sm px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Reflektion</h1>
          
          <Link href="/test">
            <div className="relative">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="relative w-16 h-16 overflow-hidden rounded-full mb-3">
            <Image 
              src={logoSrc} 
              alt={organizationName}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-lg font-bold text-center text-gray-800">{organizationName}</h2>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mt-2">
            {organizationType} - Super Admin
          </span>
        </div>
      </div>

      {/* Welcome message */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-medium text-gray-800">Welcome back, {adminName}</h2>
        <p className="text-sm text-gray-500 mt-1">System-wide overview and management</p>
      </div>
      
      {/* Stats Cards - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Building2 size={20} className="text-blue-600" />
          </div>
          <span className="text-2xl font-bold">{totalDepartments}</span>
          <span className="text-xs text-gray-500">Departments</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <Users size={20} className="text-green-600" />
          </div>
          <span className="text-2xl font-bold">{totalFaculty}</span>
          <span className="text-xs text-gray-500">Faculty</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-indigo-100 rounded-full mb-2">
            <GraduationCap size={20} className="text-indigo-600" />
          </div>
          <span className="text-2xl font-bold">{totalStudents}</span>
          <span className="text-xs text-gray-500">Students</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-cyan-100 rounded-full mb-2">
            <UserCheck size={20} className="text-cyan-600" />
          </div>
          <span className="text-2xl font-bold">{overallAttendance}%</span>
          <span className="text-xs text-gray-500">Avg Attendance</span>
        </div>
      </div>
      
      {/* Monthly Overview Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar size={20} className="mr-2" />
              <h3 className="text-lg font-semibold">{currentMonth} Overview</h3>
            </div>
            <Link href="/superAdmin/analytics">
              <BarChart3 size={20} className="text-purple-200 hover:text-white transition-colors" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-purple-100 text-sm">System Status</p>
              <p className="text-xl font-bold">Operational</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Total Defaulters</p>
              <p className="text-xl font-bold">{totalDefaulters}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Section */}
      {lowAttendanceClasses > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle size={18} className="text-red-600 mr-2" />
              <h3 className="text-red-800 font-semibold">Critical Alerts</h3>
            </div>
            <p className="text-red-700 text-sm mb-3">
              {lowAttendanceClasses} classes with attendance below 75%
            </p>
            <Link href="/superAdmin/alerts">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                View Details
              </button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Department Overview */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Department Overview</h3>
          <Link href="/superAdmin/departments">
            <span className="text-blue-600 text-sm font-medium">View All</span>
          </Link>
        </div>
        
        <div className="space-y-3">
          {departments.slice(0, 3).map((department) => (
            <Link key={department.id} href={`/superAdmin/departments/${department.id}`}>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{department.name}</h4>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <Users size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{department.totalFaculty} faculty</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{department.totalStudents} students</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Attendance</span>
                        <span className={`font-medium ${
                          department.averageAttendance >= 85 ? 'text-green-600' :
                          department.averageAttendance >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {department.averageAttendance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            department.averageAttendance >= 85 ? 'bg-green-500' :
                            department.averageAttendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${department.averageAttendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 ml-4" />
                </div>
                
                {department.defaulters > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <AlertTriangle size={14} className="text-red-500 mr-1" />
                      <span className="text-sm text-red-600">
                        {department.defaulters} defaulters
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Department Heads */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Department Heads</h3>
          <Link href="/superAdmin/manage">
            <span className="text-purple-600 text-sm font-medium">Manage All</span>
          </Link>
        </div>
        
        {displayedDepartmentHeads && displayedDepartmentHeads.length > 0 ? (
          <div className="space-y-3">
            {displayedDepartmentHeads.slice(0, 3).map((head: DepartmentHead) => (
              <div key={head.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{head.name}</h4>
                        <p className="text-sm text-gray-600">{head.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">ID:</span>
                          <span className="text-sm text-gray-600">{head.employeeId}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          head.managementEnabled 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {head.managementEnabled ? 'Management Enabled' : 'Management Disabled'}
                        </span>
                        <div className={`flex items-center p-1 rounded-full ${
                          head.managementEnabled 
                            ? 'bg-purple-600' 
                            : 'bg-gray-300'
                        }`}>
                          {head.managementEnabled ? (
                            <ToggleRight className="h-5 w-5 text-white" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <Shield size={32} className="text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-800 mb-2">No Department Heads</h4>
            <p className="text-sm text-gray-600 mb-4">Add department heads to manage different departments</p>
            <Link 
              href="/superAdmin/add-department-head"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <Shield size={16} />
              Add Department Head
            </Link>
          </div>
        )}
      </div>
    </SmoothScrollContainer>
  );
};
