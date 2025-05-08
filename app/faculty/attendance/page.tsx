"use client";

import { useState, useEffect } from "react";
import { AttendanceTaker, Student } from "@/app/_component/faculty/attendance-taker";
import { AttendanceSelection } from "@/app/_component/faculty/attendance-selection";
import { SkeletonLoading } from "@/app/_component/faculty/skeleton-loading";

// Define SelectionData interface in this file to avoid import issues
interface SelectionData {
  classYear: string;
  division?: string;
  sessionType: "Lecture" | "Lab";
  batch?: string;
  subject: string;
  lectureNumber: number;
  date: string;
  branch: string;
  facultyId: string;
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

// Divide students into batches (for lab sessions)
const studentBatches = {
  T1: mockStudents.slice(0, 12),
  T2: mockStudents.slice(12, 25),
  T3: mockStudents.slice(25, 38),
  T4: mockStudents.slice(38),
};

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionComplete, setSelectionComplete] = useState(false);
  const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
  
  // Simulate fetching students from API
  useEffect(() => {
    if (!selectionComplete || !selectionData) return;
    
    const fetchStudents = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get appropriate students based on selection
      if (selectionData.sessionType === "Lab" && selectionData.batch) {
        // For lab sessions, get students from the selected batch
        setStudents(studentBatches[selectionData.batch as keyof typeof studentBatches] || []);
      } else {
        // For lectures, get all students
        setStudents(mockStudents);
      }
      
      setLoading(false);
    };
    
    fetchStudents();
  }, [selectionComplete, selectionData]);
  
  // Handle selection completion
  const handleSelectionComplete = (selection: SelectionData) => {
    setSelectionData(selection);
    setSelectionComplete(true);
  };
  
  // Handle going back to selection
  const handleBackToSelection = () => {
    setSelectionComplete(false);
    setSelectionData(null);
  };

  // Handle saving attendance
  const handleSaveAttendance = async (updatedStudents: Student[]) => {
    // In a real app, you would send this to your API
    // await fetch(`/api/attendance/${selectionData?.subject}/${selectionData?.date}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ 
    //     students: updatedStudents,
    //     ...selectionData
    //   }),
    // });
    
    console.log("Attendance saved:", {
      ...selectionData,
      presentCount: updatedStudents.filter(s => s.isPresent).length,
      absentCount: updatedStudents.filter(s => !s.isPresent).length,
      students: updatedStudents,
    });
    
    // Update local state
    setStudents(updatedStudents);
    
    // Show success message (in a real app)
    alert("Attendance saved successfully!");
  };

  if (!selectionComplete) {
    return (
      <div className="flex flex-col h-screen">
        <AttendanceSelection onComplete={handleSelectionComplete} />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <SkeletonLoading message={`Loading ${selectionData?.sessionType === "Lab" ? `Batch ${selectionData.batch}` : "Class"} Students`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AttendanceTaker
        students={students}
        onSave={handleSaveAttendance}
        onBack={handleBackToSelection}
        classYear={selectionData?.classYear || ""}
        division={selectionData?.division}
        sessionType={selectionData?.sessionType || "Lecture"}
        batch={selectionData?.batch}
        subject={selectionData?.subject}
        lectureNumber={selectionData?.lectureNumber}
        date={selectionData?.date}
        branch={selectionData?.branch}
        facultyId={selectionData?.facultyId}
      />
    </div>
  );
}