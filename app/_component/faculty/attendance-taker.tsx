"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export interface Student {
  id: string;
  name: string;
  rollNo: number; // Using number type for roll numbers
  isPresent: boolean;
  isMarked: boolean; // Track if student has been explicitly marked
}

interface AttendanceTakerProps {
  students?: Student[];
  onSave: (students: Student[]) => void;
  courseId?: string;
  branch?: string;
  classYear?: string;
  division?: string;
  sessionType?: "Lecture" | "Lab";
  batch?: string;
  subject?: string;
  lectureNumber?: number;
  date?: string;
  facultyId?: string;
  onBack?: () => void;
}

export const AttendanceTaker = ({
  students,
  onSave,
  courseId = "",
  branch = "CSE",
  classYear = "FY",
  division = "",
  sessionType = "Lecture",
  batch = "",
  subject = "",
  lectureNumber = 1,
  date = new Date().toISOString().split("T")[0],
  facultyId = "",
  onBack,
}: AttendanceTakerProps) => {
  // Define strength (number of students) - can be modified as needed
  const strength: number = 40; // Change this number to control how many roll numbers (1 to strength)
  
  // Generate default students with roll numbers 1 to strength
  const generateDefaultStudents = () => {
    return Array.from({ length: strength }, (_, index) => {
      const rollNumber = index + 1;
      return {
        id: String(rollNumber),
        name: `Student ${rollNumber}`,
        rollNo: rollNumber,
        isPresent: false,
        isMarked: false
      };
    });
  };
  
  // Initialize students with numbers 1 to strength if not provided
  const [currentStudents, setCurrentStudents] = useState<Student[]>(() => {
    // Always use generated students with simple numeric roll numbers
    return generateDefaultStudents();
  });
  
  const [markMode, setMarkMode] = useState<"absent" | "present">("absent");
  const [isLoading, setIsLoading] = useState(false);
  
  // Format date to display as DD/MM/YYYY
  const formattedDate = date.split("-").reverse().join("/");

  // Toggle individual student attendance status
  const toggleAttendance = (studentId: string) => {
    setCurrentStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              isPresent: !student.isPresent,
              isMarked: true, // Mark this student as explicitly marked
            }
          : student
      )
    );
  };

  // Mark all unmarked students based on mode
  const handleMarkAll = () => {
    const newMode = markMode === "absent" ? "present" : "absent";
    setMarkMode(newMode);
    
    // Only update students that haven't been explicitly marked
    setCurrentStudents(prev => 
      prev.map(student => {
        if (!student.isMarked) {
          return {
            ...student,
            isPresent: newMode === "present", // If switching to "present" mode, mark unmarked students as present
            isMarked: true
          };
        }
        return student; // Leave already marked students unchanged
      })
    );
  };

  // Reset all students to unmarked state
  const handleReset = () => {
    // Always reset to default numeric roll numbers
    setCurrentStudents(generateDefaultStudents());
    setMarkMode("absent");
  };

  // Save attendance and store absent students in Convex
  const handleSaveAttendance = async () => {
    setIsLoading(true);
    try {
      // Find absent students
      const absentStudents = currentStudents.filter(student => !student.isPresent);
      
      // For now, just log the attendance data (you can implement actual saving later)
      console.log("Attendance data:", {
        absentStudents: absentStudents.map(student => ({
          prn: student.rollNo,
          subject: subject || "",
          lectureNumber: lectureNumber || 1,
          facultyid: facultyId || "",
          class: classYear || "",
          division: division || "",
          sessionType: sessionType || "Lecture",
        }))
      });
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove isMarked field before saving
      const cleanStudents = currentStudents.map(({isMarked, ...student}) => student);
      onSave(cleanStudents as Student[]);
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header section - Fixed at top */}
      <div className="sticky top-0 z-20 bg-white shadow-sm px-4 py-3 flex flex-col gap-3 border-b">
        {/* Header with back option */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Add Attendance</h2>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Change Selection
            </button>
          )}
        </div>
        
        {/* Tags row */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1 flex-nowrap">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
              {branch}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
              {classYear}{division ? ` ${division}` : ''}
            </span>
            {batch && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap">
                Batch {batch}
              </span>
            )}
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">
              {formattedDate}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
              {sessionType}
            </span>
            {subject && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium whitespace-nowrap">
                {subject}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap">
              Lecture #{lectureNumber}
            </span>
            {facultyId && (
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium whitespace-nowrap">
                Faculty: {facultyId}
              </span>
            )}
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Present: {currentStudents.filter((s) => s.isPresent).length}
          </span>
          <span>
            Absent: {currentStudents.filter((s) => !s.isPresent).length}
          </span>
          <span>
            Unmarked: {currentStudents.filter((s) => !s.isMarked).length}
          </span>
        </div>
      </div>

      {/* Students roll numbers grid - with proper padding for fixed footer */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 pb-32">
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {currentStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => toggleAttendance(student.id)}
              className={`flex items-center justify-center aspect-square rounded-full text-lg md:text-xl font-bold transition-colors shadow-sm bg-white ${
                student.isMarked
                  ? student.isPresent 
                    ? "border-2 border-green-500 text-green-700"
                    : "border-2 border-red-500 text-red-700" 
                  : "border-2 border-gray-300 text-gray-700"
              }`}
              title={student.name} // Show name on hover
            >
              {student.rollNo}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Footer with action buttons - positioned above mobile menu */}
      <div className="fixed bottom-16 left-0 right-0 z-10 p-4 bg-white border-t shadow-lg md:bottom-0">
        <div className="flex justify-between items-center gap-3 max-w-md mx-auto">
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors min-w-[80px]"
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </button>
          
          <button
            onClick={handleMarkAll}
            className="px-4 py-3 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex-1 max-w-[140px]"
          >
            {markMode === "absent" ? "Mark Present" : "Mark Absent"}
          </button>
          
          <button
            onClick={handleSaveAttendance}
            disabled={isLoading}
            className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};