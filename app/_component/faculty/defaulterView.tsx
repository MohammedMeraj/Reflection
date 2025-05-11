"use client";

import { useState } from "react";
import { AlertTriangle, Search, Filter, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  class: string;
  branch: string;
  year: string;
}

interface Class {
  id: string;
  name: string;
  branch: string;
  year: string;
}

interface DefaultersViewProps {
  classes: Class[];
  students: Student[];
  threshold?: number; // Attendance percentage threshold for defaulters
}

export const DefaultersView = ({
  classes,
  students,
  threshold = 75,
}: DefaultersViewProps) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter students based on selected class and search term
  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClassId === "all" || student.class === selectedClassId;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });
  
  // Separate students into defaulters and non-defaulters
  const defaulters = filteredStudents.filter((student) => student.attendance < threshold);
  const nonDefaulters = filteredStudents.filter((student) => student.attendance >= threshold);
  
  // Calculate average attendance
  const averageAttendance = filteredStudents.length > 0
    ? Math.round(filteredStudents.reduce((sum, student) => sum + student.attendance, 0) / filteredStudents.length)
    : 0;
  
  // Find class name from ID
  const getClassName = (classId: string) => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.name : "All Classes";
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex flex-col gap-3">
        {/* Back button and title */}
        <div className="flex items-center justify-between">
          
        <h2 className="text-lg font-medium mb-1">Defaulter Panel</h2>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Class filter tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedClassId("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedClassId === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All Classes
          </button>
          
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedClassId === cls.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
        
        {/* Search bar */}
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
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Summary stats */}
        <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
          <div>
            <h2 className="font-medium">{getClassName(selectedClassId)}</h2>
            <p className="text-xs text-gray-500">Total Students: {filteredStudents.length}</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Avg. Attendance:</span>
              <span className={`font-bold ${
                averageAttendance >= threshold ? "text-green-600" : "text-red-600"
              }`}>
                {averageAttendance}%
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right">
              Defaulters: {defaulters.length} students
            </p>
          </div>
        </div>
      </div>
      
      {/* Defaulters Section */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-red-100 rounded-full">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <h3 className="text-md font-medium text-gray-800">Defaulters</h3>
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            {defaulters.length}
          </span>
        </div>
        
        {defaulters.length > 0 ? (
          <ul className="space-y-2">
            {defaulters.map((student) => (
              <li key={student.id} className="bg-white rounded-xl shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">{student.rollNo}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {student.branch}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {student.year}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {student.attendance}%
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">No defaulters found</p>
          </div>
        )}
      </div>
      
      {/* Regular Students Section */}
      <div className="px-4 py-3 mb-16">
        <h3 className="text-md font-medium text-gray-800 mb-3">Regular Students</h3>
        
        {nonDefaulters.length > 0 ? (
          <ul className="space-y-2">
            {nonDefaulters.map((student) => (
              <li key={student.id} className="bg-white rounded-xl shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">{student.rollNo}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {student.branch}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {student.year}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {student.attendance}%
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};