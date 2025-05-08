"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AttendanceData {
  date: string;
  avgAttendance: number;
  totalStudents: number;
  presentStudents: number;
}

interface SubjectInfo {
  id: string;
  name: string;
  classYear: "FY" | "SY" | "TY" | "BTech";
  semester: number;
  totalStudents: number;
  totalLectures: number;
  attendanceData: AttendanceData[];
}

interface AttendanceVisualizationProps {
  subjects: SubjectInfo[];
  facultyName?: string;
}

export const AttendanceVisualization = ({
  subjects,
  facultyName = "Faculty",
}: AttendanceVisualizationProps) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(
    subjects.length > 0 ? subjects[0] : null
  );

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      setSelectedSubject(subject);
    }
  };

  // Format date for display (convert from YYYY-MM-DD to DD MMM)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md text-xs">
          <p className="font-semibold">{formatDate(data.date)}</p>
          <p className="text-blue-600">{`Present: ${data.presentStudents}/${data.totalStudents}`}</p>
          <p className="text-green-600">{`Attendance: ${(data.avgAttendance * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header with subject tags */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3">
        <h2 className="text-lg font-medium mb-3">Overview</h2>
        
        {/* Subject selection tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectSelect(subject.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubject?.id === subject.id
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {selectedSubject ? (
        <div className="flex-1 overflow-y-auto">
          {/* Subject info tags */}
          <div className="px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
                {selectedSubject.classYear}
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">
                Sem {selectedSubject.semester}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                {selectedSubject.totalStudents} Students
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                {selectedSubject.totalLectures} Lectures
              </span>
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="px-2 py-4">
            <h3 className="text-sm font-medium px-4 mb-2">Weekly Attendance Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={selectedSubject.attendanceData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgAttendance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="px-4 py-3">
            <h3 className="text-sm font-medium mb-2">Attendance Summary</h3>
            
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm">Overall Attendance</span>
                <span className="text-blue-600 font-semibold">
                  {(
                    selectedSubject.attendanceData.reduce(
                      (sum, day) => sum + day.avgAttendance,
                      0
                    ) / selectedSubject.attendanceData.length * 100
                  ).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(
                      selectedSubject.attendanceData.reduce(
                        (sum, day) => sum + day.avgAttendance,
                        0
                      ) / selectedSubject.attendanceData.length * 100
                    ).toFixed(1)}%`,
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="text-sm font-medium mb-3">Recent Lectures</h4>
              <ul className="space-y-3">
                {selectedSubject.attendanceData.slice(-3).reverse().map((day, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{formatDate(day.date)}</span>
                      <p className="text-xs text-gray-500">{`${day.presentStudents}/${day.totalStudents} students present`}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      day.avgAttendance >= 0.75 
                        ? "bg-green-100 text-green-700" 
                        : day.avgAttendance >= 0.5 
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {(day.avgAttendance * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No subjects available</p>
        </div>
      )}
    </div>
  );
};