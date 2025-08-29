"use client"
import { SuperAdminDashboard } from "@/app/_component/super-admin/super-admin-home";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Mock data for the super admin dashboard
const mockDepartments = [
  {
    id: "dept-1",
    name: "Computer Science & Engineering",
    totalFaculty: 25,
    totalStudents: 450,
    averageAttendance: 84,
    lowAttendanceClasses: 3,
    defaulters: 35,
  },
  {
    id: "dept-2",
    name: "Information Technology",
    totalFaculty: 20,
    totalStudents: 380,
    averageAttendance: 78,
    lowAttendanceClasses: 5,
    defaulters: 42,
  },
  {
    id: "dept-3",
    name: "Electronics & Communication",
    totalFaculty: 18,
    totalStudents: 320,
    averageAttendance: 82,
    lowAttendanceClasses: 2,
    defaulters: 28,
  },
  {
    id: "dept-4",
    name: "Mechanical Engineering",
    totalFaculty: 22,
    totalStudents: 400,
    averageAttendance: 76,
    lowAttendanceClasses: 4,
    defaulters: 48,
  },
  {
    id: "dept-5",
    name: "Civil Engineering",
    totalFaculty: 16,
    totalStudents: 280,
    averageAttendance: 80,
    lowAttendanceClasses: 3,
    defaulters: 32,
  },
];

export default function SuperAdminHome() {
  // Get real-time data from Convex
  const departmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);
  const departments = useQuery(api.superAdmin.getAllDepartments);
  const stats = useQuery(api.superAdmin.getDepartmentStats);

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

  return (
    <main className="min-h-screen bg-slate-50">
      <SuperAdminDashboard 
        adminName="System Administrator"
        departments={mockDepartments}
        organizationName="Maharashtra State Board of Technical Education"
        organizationType="Education Board"
        logoSrc="/api/placeholder/100/100" // Placeholder image
        notifications={12} // Show notification indicator
        realTimeStats={stats}
        realTimeDepartmentHeads={transformedDepartmentHeads}
        realTimeDepartments={departments}
      />
    </main>
  );
}
