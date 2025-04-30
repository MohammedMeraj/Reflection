"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  isPresent: boolean;
  isMarked: boolean; // Track if student has been explicitly marked
}

interface AttendanceTakerProps {
  students: Student[];
  onSave: (students: Student[]) => void;
  courseId?: string;
  branch?: string;
  classYear?: string;
  sessionType?: "Lecture" | "Lab";
  date?: string;
}

export const AttendanceTaker = ({
  students,
  onSave,
  courseId = "",
  branch = "CSE",
  classYear = "FY",
  sessionType = "Lecture",
  date = new Date().toISOString().split("T")[0],
}: AttendanceTakerProps) => {
  // Initialize students with isMarked=false
  const [currentStudents, setCurrentStudents] = useState<Student[]>(
    students.map(student => ({
      ...student,
      isMarked: false
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [markMode, setMarkMode] = useState<"absent" | "present">("absent");
  const [isLoading, setIsLoading] = useState(false);

  // Format date to display as DD/MM/YYYY
  const formattedDate = date.split("-").reverse().join("/");

  // Filter students based on search term
  const filteredStudents = currentStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setCurrentStudents(students.map(student => ({
      ...student,
      isPresent: false,
      isMarked: false
    })));
    setMarkMode("absent");
  };

  // Save attendance
  const handleSaveAttendance = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Remove isMarked field before saving
      const cleanStudents = currentStudents.map(({isMarked, ...student}) => student);
      onSave(cleanStudents as Student[]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header section */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex flex-col gap-3">
        {/* Tags row */}
        <h2 className="text-lg font-medium mb-1">Add Attendance</h2>
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1 flex-nowrap">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
              {branch}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
              {classYear}
            </span>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">
              {formattedDate}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
              {sessionType}
            </span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      {/* Students list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {filteredStudents.length > 0 ? (
          <ul className="space-y-2">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="flex items-center justify-between py-3 px-4 bg-white rounded-xl shadow-sm"
              >
                <span className="font-medium">{student.name}</span>
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    student.isMarked
                      ? student.isPresent 
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {student.rollNo}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Footer with action buttons - all in a single line */}
      <div className="sticky bottom-16 md:bottom-0 w-full p-4 bg-white border-t">
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition"
          >
            <RefreshCw size={16} className="mr-1" />
            Reset
          </button>
          
          <button
            onClick={handleMarkAll}
            className="px-3 py-2 rounded-full text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            {markMode === "absent" ? "Mark Present" : "Mark Absent"}
          </button>
          
          <button
            onClick={handleSaveAttendance}
            disabled={isLoading}
            className="px-3 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};