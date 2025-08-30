"use client"
import { SuperAdminDashboard } from "@/app/_component/super-admin/super-admin-home";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SuperAdminHome() {
  // Get real-time data from Convex
  const departmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);
  const departments = useQuery(api.superAdmin.getAllDepartments);
  const stats = useQuery(api.superAdmin.getDepartmentStats);
  const departmentOverview = useQuery(api.superAdmin.getDepartmentOverview);

  // Transform Convex data to match component interface
  const transformedDepartmentHeads = departmentHeads?.map(head => ({
    id: head._id,
    name: head.name,
    email: head.email,
    department: head.department?.name || "No Department",
    managementEnabled: head.managementEnabled,
    employeeId: head.employeeId,
    joinedDate: new Date(head.createdAt).toLocaleDateString(),
  }));

  // Transform department overview data for the dashboard
  const transformedDepartments = departmentOverview?.map(dept => ({
    id: dept.id,
    name: dept.name,
    totalFaculty: dept.totalFaculty,
    totalStudents: dept.totalStudents,
    averageAttendance: dept.averageAttendance,
    lowAttendanceClasses: dept.lowAttendanceClasses,
    defaulters: dept.defaulters,
  })) || [];

  // Show loading state while data is being fetched
  if (departmentOverview === undefined || departmentHeads === undefined || stats === undefined) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SuperAdminDashboard 
        adminName="System Administrator"
        departments={transformedDepartments}
        organizationName="Maharashtra State Board of Technical Education"
        organizationType="Education Board"
        logoSrc="/api/placeholder/100/100" // Placeholder image
        notifications={
          // Calculate total defaulters across all departments as notification count
          transformedDepartments.length > 0 
            ? transformedDepartments.reduce((sum, dept) => sum + dept.defaulters, 0) 
            : 0
        }
        realTimeStats={stats}
        realTimeDepartmentHeads={transformedDepartmentHeads}
        realTimeDepartments={departments}
      />
    </main>
  );
}
