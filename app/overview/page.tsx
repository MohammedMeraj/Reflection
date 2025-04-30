"use client";

import { useState, useEffect } from "react";
import { AttendanceVisualization } from "@/components/ui/attendance-visualization";

// --- Types ---------------------------------------------------
type AttendanceRecord = {
  date:           string;
  avgAttendance:  number;
  totalStudents:  number;
  presentStudents:number;
};

type Subject = {
  id:            string;
  name:          string;
  classYear:     "FY" | "SY" | "TY";
  semester:      number;
  totalStudents: number;
  totalLectures: number;
  attendanceData: AttendanceRecord[];
};

// --- Mock Data ---------------------------------------------
const mockSubjects: Subject[] = [
  {
    id: "cs101",
    name: "Data Structures",
    classYear: "SY",
    semester: 3,
    totalStudents: 45,
    totalLectures: 16,
    attendanceData: [
      { date: "2025-04-24", avgAttendance: 0.82, totalStudents: 45, presentStudents: 37 },
      { date: "2025-04-26", avgAttendance: 0.78, totalStudents: 45, presentStudents: 35 },
      { date: "2025-04-28", avgAttendance: 0.91, totalStudents: 45, presentStudents: 41 },
      { date: "2025-04-29", avgAttendance: 0.87, totalStudents: 45, presentStudents: 39 },
      { date: "2025-04-30", avgAttendance: 0.80, totalStudents: 45, presentStudents: 36 },
      { date: "2025-05-01", avgAttendance: 0.89, totalStudents: 45, presentStudents: 40 }
    ]
  },
  {
    id: "cs102",
    name: "Compiler Design",
    classYear: "TY",
    semester: 5,
    totalStudents: 42,
    totalLectures: 14,
    attendanceData: [
      { date: "2025-04-24", avgAttendance: 0.76, totalStudents: 42, presentStudents: 32 },
      { date: "2025-04-25", avgAttendance: 0.71, totalStudents: 42, presentStudents: 30 },
      { date: "2025-04-27", avgAttendance: 0.83, totalStudents: 42, presentStudents: 35 },
      { date: "2025-04-29", avgAttendance: 0.81, totalStudents: 42, presentStudents: 34 },
      { date: "2025-04-30", avgAttendance: 0.74, totalStudents: 42, presentStudents: 31 },
      { date: "2025-05-01", avgAttendance: 0.79, totalStudents: 42, presentStudents: 33 }
    ]
  },
  {
    id: "cs103",
    name: "Computer Networks",
    classYear: "TY",
    semester: 6,
    totalStudents: 38,
    totalLectures: 12,
    attendanceData: [
      { date: "2025-04-24", avgAttendance: 0.68, totalStudents: 38, presentStudents: 26 },
      { date: "2025-04-26", avgAttendance: 0.74, totalStudents: 38, presentStudents: 28 },
      { date: "2025-04-27", avgAttendance: 0.79, totalStudents: 38, presentStudents: 30 },
      { date: "2025-04-29", avgAttendance: 0.76, totalStudents: 38, presentStudents: 29 },
      { date: "2025-04-30", avgAttendance: 0.84, totalStudents: 38, presentStudents: 32 },
      { date: "2025-05-01", avgAttendance: 0.82, totalStudents: 38, presentStudents: 31 }
    ]
  },
  {
    id: "cs104",
    name: "Database Systems",
    classYear: "FY",
    semester: 2,
    totalStudents: 48,
    totalLectures: 15,
    attendanceData: [
      { date: "2025-04-24", avgAttendance: 0.85, totalStudents: 48, presentStudents: 41 },
      { date: "2025-04-25", avgAttendance: 0.77, totalStudents: 48, presentStudents: 37 },
      { date: "2025-04-26", avgAttendance: 0.90, totalStudents: 48, presentStudents: 43 },
      { date: "2025-04-28", avgAttendance: 0.83, totalStudents: 48, presentStudents: 40 },
      { date: "2025-04-30", avgAttendance: 0.81, totalStudents: 48, presentStudents: 39 },
      { date: "2025-05-01", avgAttendance: 0.88, totalStudents: 48, presentStudents: 42 }
    ]
  }
];

// --- Component ---------------------------------------------
export default function AttendanceAnalyticsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchSubjectsData = async () => {
      // Replace with real API call when ready
      setTimeout(() => {
        setSubjects(mockSubjects);
        setLoading(false);
      }, 800);
    };
    fetchSubjectsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-full max-w-md text-center mb-4">
          <h2 className="text-xl font-semibold mb-2">Loading Analytics</h2>
          <p className="text-gray-600 mb-4">Please wait while we fetch your attendance data</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full animate-pulse"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AttendanceVisualization subjects={subjects} facultyName="Dr. Jane Smith" />
    </div>
  );
}
