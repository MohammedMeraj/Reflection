"use client";

import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { AttendanceSkeleton } from "@/components/ui/skeleton";

interface SelectionProps {
  onComplete: (selection: SelectionData) => void;
  facultyId?: string;
  facultyBranch?: string;
  isLoading?: boolean;
}

export interface SelectionData {
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

export const AttendanceSelection = ({
  onComplete,
  facultyId = "FAC001",
  facultyBranch = "CSE",
  isLoading = false,
}: SelectionProps) => {
  // Show skeleton loading
  if (isLoading) {
    return <AttendanceSkeleton />;
  }
  // Form data
  const [classYear, setClassYear] = useState("");
  const [division, setDivision] = useState("");
  const [sessionType, setSessionType] = useState<"Lecture" | "Lab">("Lecture");
  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Auto-calculated fields
  const currentDate = new Date().toISOString().split("T")[0];
  const formattedDate = currentDate.split("-").reverse().join("/");
  
  // Example divisions based on class year (in a real app, this would come from API)
  const divisions = classYear === "FY" ? ["A"] : classYear === "SY" ? ["A", "B"] : ["A", "B", "C"];
  
  // Example batches (in a real app, this would come from API)
  const batches = ["T1", "T2", "T3", "T4"];
  
  // Example subjects based on faculty (in a real app, this would come from API)
  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks"
  ];
  
  // Lecture number calculation (in a real app, this would come from API)
  const lectureNumber = 3; // Mock - assuming 2 lectures already happened
  
  // Check if form is complete
  const isFormComplete = () => {
    if (!classYear) return false;
    if (divisions.length > 0 && !division) return false;
    if (!sessionType) return false;
    if (sessionType === "Lab" && !batch) return false;
    if (!subject) return false;
    return true;
  };
  
  // Handle form submission
  const handleReview = () => {
    if (isFormComplete()) {
      setIsReviewing(true);
    }
  };
  
  // Complete selection
  const completeSelection = () => {
    onComplete({
      classYear,
      division: divisions.length > 0 ? division : undefined,
      sessionType,
      batch: sessionType === "Lab" ? batch : undefined,
      subject,
      lectureNumber,
      date: currentDate,
      branch: facultyBranch,
      facultyId
    });
  };
  
  // Go back from review
  const goBackFromReview = () => {
    setIsReviewing(false);
  };
  
  if (isReviewing) {
    return (
      <div className="flex flex-col h-full bg-slate-50 p-4">
        {/* Header */}
        <h2 className="text-lg font-medium mb-4">Confirm Details</h2>
        
        {/* Review data */}
        <div className="flex-1 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-gray-500">Class Year:</div>
              <div className="font-medium">{classYear}</div>
              
              {division && (
                <>
                  <div className="text-gray-500">Division:</div>
                  <div className="font-medium">{division}</div>
                </>
              )}
              
              <div className="text-gray-500">Session Type:</div>
              <div className="font-medium">{sessionType}</div>
              
              {sessionType === "Lab" && batch && (
                <>
                  <div className="text-gray-500">Batch:</div>
                  <div className="font-medium">{batch}</div>
                </>
              )}
              
              <div className="text-gray-500">Subject:</div>
              <div className="font-medium">{subject}</div>
              
              <div className="text-gray-500">Date:</div>
              <div className="font-medium">{formattedDate}</div>
              
              <div className="text-gray-500">Branch:</div>
              <div className="font-medium">{facultyBranch}</div>
              
              <div className="text-gray-500">Faculty ID:</div>
              <div className="font-medium">{facultyId}</div>
              
              <div className="text-gray-500">Lecture Number:</div>
              <div className="font-medium">{lectureNumber}</div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={goBackFromReview}
            className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
          
          <button
            onClick={completeSelection}
            className="px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            Confirm<ChevronRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4">
      {/* Header */}
      <h2 className="text-lg font-medium mb-4">Attendance Selection</h2>
      
      {/* All selection options on one page */}
      <div className="flex-1 overflow-y-auto">
        {/* Class Year selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Class Year*</h3>
          <div className="grid grid-cols-4 gap-3">
            {["FY", "SY", "TY", "Final"].map((year) => (
              <button
                key={year}
                className={`p-3 rounded-xl text-center ${
                  classYear === year
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                    : "bg-white border border-gray-200"
                }`}
                onClick={() => setClassYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        
        {/* Division selection (if applicable) */}
        {classYear && divisions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Division*</h3>
            <div className="grid grid-cols-4 gap-3">
              {divisions.map((div) => (
                <button
                  key={div}
                  className={`p-3 rounded-xl text-center ${
                    division === div
                      ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setDivision(div)}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Session Type selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Session Type*</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-4 rounded-xl text-center ${
                sessionType === "Lecture"
                  ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                  : "bg-white border border-gray-200"
              }`}
              onClick={() => setSessionType("Lecture")}
            >
              Lecture
            </button>
            <button
              className={`p-4 rounded-xl text-center ${
                sessionType === "Lab"
                  ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                  : "bg-white border border-gray-200"
              }`}
              onClick={() => setSessionType("Lab")}
            >
              Lab
            </button>
          </div>
        </div>
        
        {/* Batch selection (for Lab sessions) */}
        {sessionType === "Lab" && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Batch*</h3>
            <div className="grid grid-cols-4 gap-3">
              {batches.map((b) => (
                <button
                  key={b}
                  className={`p-3 rounded-xl text-center ${
                    batch === b
                      ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setBatch(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Subject selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Subject*</h3>
          <div className="grid grid-cols-1 gap-3">
            {subjects.map((sub) => (
              <button
                key={sub}
                className={`p-3 rounded-xl text-left ${
                  subject === sub
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                    : "bg-white border border-gray-200"
                }`}
                onClick={() => setSubject(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
        
        {/* Auto-filled information */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Auto-filled Information</h3>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">Date:</div>
              <div>{formattedDate}</div>
              
              <div className="text-gray-500">Branch:</div>
              <div>{facultyBranch}</div>
              
              <div className="text-gray-500">Faculty ID:</div>
              <div>{facultyId}</div>
              
              <div className="text-gray-500">Lecture Number:</div>
              <div>{lectureNumber}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm button */}
      <div className="mt-4">
        <button
          onClick={handleReview}
          disabled={!isFormComplete()}
          className="w-full py-3 rounded-xl text-center text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Review & Confirm
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          * Required fields
        </p>
      </div>
    </div>
  );
};