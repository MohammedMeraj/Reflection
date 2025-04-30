"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  isPresent: boolean;
}

interface AttendanceTakerProps {
  students: Student[];
  onSave: (students: Student[]) => void;
  courseId?: string;
  date?: string;
}

export const AttendanceTaker = ({
  students,
  onSave,
  courseId = "",
  date = new Date().toISOString().split("T")[0],
}: AttendanceTakerProps) => {
  const [currentStudents, setCurrentStudents] = useState<Student[]>(students);
  const [searchTerm, setSearchTerm] = useState("");
  const [markMode, setMarkMode] = useState<"absent" | "present">("absent");
  const [isLoading, setIsLoading] = useState(false);

  // Filter students based on search term
  const filteredStudents = currentStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle student attendance status
  const toggleAttendance = (studentId: string) => {
    setCurrentStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              isPresent: !student.isPresent,
            }
          : student
      )
    );
  };

  // Save attendance
  const handleSaveAttendance = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSave(currentStudents);
      setIsLoading(false);
    }, 500);
  };

  // Toggle mark mode
  const toggleMarkMode = () => {
    setMarkMode(markMode === "absent" ? "present" : "absent");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header section */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Attendance for {date}
          </h1>
          <button
            onClick={toggleMarkMode}
            className="px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            Mark {markMode === "absent" ? "Absent" : "Present"}
          </button>
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
          <span>Total: {currentStudents.length}</span>
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
                    student.isPresent
                      ? "bg-green-100 text-green-700"
                      : markMode === "absent" 
                        ? "bg-red-100 text-red-700" 
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

      {/* Footer with save button */}
      <div className="sticky bottom-16 md:bottom-0 w-full flex justify-center p-4 bg-white border-t">
        <button
          onClick={handleSaveAttendance}
          disabled={isLoading}
          className="w-full max-w-xs py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
};