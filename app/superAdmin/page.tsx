"use client"
import { SuperAdminDashboard } from "@/app/_component/super-admin/super-admin-home";
import { SuperAdminSkeleton } from "@/app/_component/super-admin/skeleton-loading";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SuperAdminHome() {
  // Get real-time data from Convex
  const departmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);
  const departments = useQuery(api.superAdmin.getAllDepartments);
  const stats = useQuery(api.superAdmin.getDepartmentStats);
  const departmentOverview = useQuery(api.superAdmin.getDepartmentOverview);
  const systemMetrics = useQuery(api.superAdmin.getSystemMetrics);

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

  // Use real stats from Convex instead of calculating from departmentOverview
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
  if (departmentOverview === undefined || departmentHeads === undefined || stats === undefined || systemMetrics === undefined) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SuperAdminSkeleton />
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
        notifications={systemMetrics?.criticalAlerts || 0} // Use real critical alerts count
        realTimeStats={stats}
        realTimeDepartmentHeads={transformedDepartmentHeads}
        realTimeDepartments={departments}
      />
    </main>
  );
}
