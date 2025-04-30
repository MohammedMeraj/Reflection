"use client";

import { AttendanceTaker } from "@/components/ui/attendance-taker";
import { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  isPresent: boolean;
  isMarked: boolean;
}

// Mock data - in a real app, you would fetch this from an API
const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const paddedNum = num.toString().padStart(3, '0');
  return {
    id: `student-${num}`,
    name: `Student ${num}`,
    rollNo: `CS${paddedNum}`,
    isPresent: false, // All students marked absent by default
    isMarked: false,  // No students explicitly marked yet
  };
});

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [courseId, setCourseId] = useState("CS101");
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Simulate fetching students from API with progress bar
  useEffect(() => {
    const fetchStudents = async () => {
      // Reset progress
      setLoadingProgress(0);
      
      // Simulate progressive loading
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Set data when loading completes
            setTimeout(() => {
              setStudents(mockStudents);
              setLoading(false);
            }, 200);
            return 100;
          }
          return newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    };

    fetchStudents();
  }, [courseId]);

  // Handle saving attendance
  const handleSaveAttendance = async (updatedStudents: Student[]) => {
    // In a real app, you would send this to your API
    // await fetch(`/api/attendance/${courseId}/${currentDate}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ students: updatedStudents }),
    // });
    
    console.log("Attendance saved:", {
      courseId,
      date: currentDate,
      presentCount: updatedStudents.filter(s => s.isPresent).length,
      absentCount: updatedStudents.filter(s => !s.isPresent).length,
      students: updatedStudents,
    });
    
    // Update local state
    setStudents(updatedStudents);
    
    // Show success message (in a real app)
    alert("Attendance saved successfully!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Loading Students</h2>
            <p className="text-gray-600 mb-4">Please wait while we fetch the student data</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          <div className="text-right text-sm text-gray-500 mt-1">
            {loadingProgress}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AttendanceTaker
        students={students}
        onSave={handleSaveAttendance}
        courseId={courseId}
        branch="CSE"
        classYear="SY"
        sessionType="Lecture"
        date={currentDate}
      />
    </div>
  );
}