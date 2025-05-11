"use client"
import { AttendanceDashboard } from "@/components/ui/faculty-home";

// Mock data for the dashboard
const mockClasses = [
  {
    id: "class-1",
    name: "Data Structures",
    branch: "CSE",
    year: "FY",
    totalStudents: 60,
    lecturesDelivered: 24,
    averageAttendance: 82,
    defaulters: 8,
  },
  {
    id: "class-2",
    name: "Computer Networks",
    branch: "CSE",
    year: "SY",
    totalStudents: 55,
    lecturesDelivered: 18,
    averageAttendance: 76,
    defaulters: 12,
  },
  {
    id: "class-3",
    name: "Database Management",
    branch: "IT",
    year: "TY",
    totalStudents: 48,
    lecturesDelivered: 22,
    averageAttendance: 68,
    defaulters: 15,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AttendanceDashboard 
        facultyName="Dr. Sharma"
        classes={mockClasses}
        organizationName="Shri Vile Parle Kelavani Mandal's Institute of Technology, Dhule"
        organizationType="Education"
        logoSrc="/api/placeholder/100/100" // Placeholder image
        notifications={3} // Show notification indicator
      />
    </main>
  );
}