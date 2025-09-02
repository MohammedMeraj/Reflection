"use client";

import { useState } from "react";
import { ChevronRight, Users, BookOpen, Clock, AlertTriangle, Bell, BarChart3, Calendar, UserCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SmoothScrollContainer, ScrollSection } from "@/components/ui/smooth-scroll-container";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { ProfileSkeleton } from "@/components/ui/skeleton";

interface ClassStats {
  id: string;
  name: string;
  branch: string;
  year: string;
  totalStudents: number;
  lecturesDelivered: number;
  averageAttendance: number;
  defaulters: number;
}

interface AttendanceDashboardProps {
  facultyName: string;
  classes: ClassStats[];
  organizationName: string;
  organizationType: string;
  logoSrc: string;
  notifications?: number;
  isLoading?: boolean;
}

export const AttendanceDashboard = ({
  facultyName,
  classes,
  organizationName,
  organizationType,
  logoSrc,
  notifications = 0,
  isLoading = false,
}: AttendanceDashboardProps) => {
  // Show skeleton loading
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  // Calculate aggregated stats
  const totalClasses = classes.length;
  const totalLectures = classes.reduce((total, cls) => total + cls.lecturesDelivered, 0);
  const averageAttendance = classes.length > 0
    ? Math.round(classes.reduce((sum, cls) => sum + cls.averageAttendance, 0) / classes.length)
    : 0;
  const totalDefaulters = classes.reduce((total, cls) => total + cls.defaulters, 0);
  const { scrollTo } = useSmoothScroll();
  
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
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-2">
            {organizationType}
          </span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => scrollTo('stats', { duration: 500, smooth: true })}
            className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
          >
            Stats
          </button>
          <button
            onClick={() => scrollTo('summary', { duration: 500, smooth: true })}
            className="flex-shrink-0 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
          >
            Summary
          </button>
          <button
            onClick={() => scrollTo('insights', { duration: 500, smooth: true })}
            className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
          >
            Insights
          </button>
          <button
            onClick={() => scrollTo('defaulters', { duration: 500, smooth: true })}
            className="flex-shrink-0 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
          >
            Defaulters
          </button>
        </div>
      </div>

      {/* Welcome message */}
      <ScrollSection name="welcome" className="px-4 mb-6">
        <h2 className="text-xl font-medium text-gray-800">Welcome back, {facultyName}</h2>
        <p className="text-sm text-gray-500 mt-1">Here's your attendance overview</p>
      </ScrollSection>
      
      {/* Stats Cards - 2x2 grid */}
      <ScrollSection name="stats" className="grid grid-cols-2 gap-3 px-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Users size={20} className="text-blue-600" />
          </div>
          <span className="text-2xl font-bold">{totalClasses}</span>
          <span className="text-xs text-gray-500">Classes</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-purple-100 rounded-full mb-2">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <span className="text-2xl font-bold">{totalLectures}</span>
          <span className="text-xs text-gray-500">Total Lectures</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <Clock size={20} className="text-green-600" />
          </div>
          <span className="text-2xl font-bold">{averageAttendance}%</span>
          <span className="text-xs text-gray-500">Avg. Attendance</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="p-2 bg-red-100 rounded-full mb-2">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <span className="text-2xl font-bold">{totalDefaulters}</span>
          <span className="text-xs text-gray-500">Defaulters</span>
        </div>
      </ScrollSection>
      
      {/* Attendance Summary Cards */}
      <ScrollSection name="summary" className="px-4 mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Attendance Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Calendar size={18} className="text-green-600" />
            </div>
            <div>
              <span className="text-sm text-gray-500">{currentMonth} Lectures</span>
              <div className="text-lg font-medium">16 Completed</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <UserCheck size={18} className="text-blue-600" />
            </div>
            <div>
              <span className="text-sm text-gray-500">Today's Classes</span>
              <div className="text-lg font-medium">3 Sessions</div>
            </div>
          </div>
        </div>
      </ScrollSection>
      
      {/* Student Attendance Insights */}
      <ScrollSection name="insights" className="px-4 mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Student Insights</h3>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Attendance Distribution</h4>
              <p className="text-xs text-gray-500">Across all classes</p>
            </div>
            <div className="p-1 bg-blue-100 rounded-full">
              <BarChart3 size={16} className="text-blue-600" />
            </div>
          </div>
          
          {/* Attendance Ranges */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>90-100%</span>
                <span className="font-medium">42 students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>75-89%</span>
                <span className="font-medium">78 students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "55%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>60-74%</span>
                <span className="font-medium">25 students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Below 60%</span>
                <span className="font-medium text-red-600">10 students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "7%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>
      
      {/* Defaulters Summary */}
      <ScrollSection name="defaulters" className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-medium text-gray-800">Defaulters Summary</h3>
          <Link href="/faculty/defaulters" className="text-blue-600 text-sm font-medium">View All</Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Critical Defaulters</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {totalDefaulters} students
              </span>
            </div>
            <p className="text-xs text-gray-500">Students with less than 60% attendance requiring immediate attention</p>
          </div>
          
          {/* Sample defaulters list */}
          <ul className="divide-y divide-gray-100">
            {[
              { id: 1, name: "Amit Patel", rollNo: "CS21034", attendance: 52, course: "Data Structures" },
              { id: 2, name: "Priya Sharma", rollNo: "CS21045", attendance: 48, course: "Computer Networks" },
              { id: 3, name: "Rajesh Kumar", rollNo: "IT21067", attendance: 55, course: "Database Management" }
            ].map((student) => (
              <li key={student.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500">{student.rollNo}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{student.course}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {student.attendance}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
          
          <button className="w-full mt-4 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
            Send Notification to All Defaulters
          </button>
        </div>
      </ScrollSection>
      
      {/* Recent Attendance Sessions */}
      <ScrollSection name="recent" className="px-4 mb-16">
        <h3 className="text-md font-medium text-gray-800 mb-3">Recent Sessions</h3>
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Sample recent sessions */}
          {[1, 2, 3].map((session) => (
            <div key={session} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
              <div>
                <h4 className="font-medium">Data Structures</h4>
                <div className="text-xs text-gray-500 mt-1">Today, 10:00 AM • CSE, FY</div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                82% Present
              </span>
            </div>
          ))}
        </div>
      </ScrollSection>
    </SmoothScrollContainer>
  );
};