"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";
import { AttendanceSkeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

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
  facultyId,
  facultyBranch,
  isLoading = false,
}: SelectionProps) => {
  const { user } = useKindeAuth();

  // Form data - MUST be declared before any conditional returns
  const [classYear, setClassYear] = useState("");
  const [division, setDivision] = useState("");
  const [sessionType, setSessionType] = useState<"Lecture" | "Lab">("Lecture");
  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedLectureNumber, setSelectedLectureNumber] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);

  // Get current faculty information based on logged-in user email
  const currentFaculty = useQuery(
    api.faculty.getAllFaculty,
    user?.email ? {} : "skip"
  );

  // Find current faculty details and get department ID
  const facultyData = currentFaculty?.find((f: any) => f.email === user?.email);
  const currentDepartmentId = facultyData?.departmentId;

  // Get department information to get the department name
  const departmentInfo = useQuery(
    api.superAdmin.getDepartmentById,
    currentDepartmentId ? { id: currentDepartmentId } : "skip"
  );

  // Get department-specific data using the department ID
  const classList = useQuery(
    api.classes.getAllClasses
  );
  
  const labsList = useQuery(
    api.labsSimple.getLabsByDepartment,
    currentDepartmentId ? { departmentId: currentDepartmentId } : "skip"
  );

  const subjectsList = useQuery(
    api.subjects.getSubjectsByDepartment,
    departmentInfo?.name ? { department: departmentInfo.name } : "skip"
  );

  // Reset form logic when selections change
  useEffect(() => {
    // Reset division and batch when class year changes
    setDivision("");
    setBatch("");
  }, [classYear]);
  
  useEffect(() => {
    // Reset batch when division changes
    setBatch("");
  }, [division]);
  
  useEffect(() => {
    // Reset lecture number when session type changes
    if (sessionType === "Lecture") {
      setSelectedLectureNumber(1);
      setBatch("");
    }
  }, [sessionType]);

  // Show skeleton loading - AFTER all hooks are declared
  if (isLoading || currentFaculty === undefined || !facultyData || !departmentInfo || classList === undefined || labsList === undefined || subjectsList === undefined) {
    return <AttendanceSkeleton />;
  }
  
  // Auto-calculated fields
  const currentDate = new Date().toISOString().split("T")[0];
  const formattedDate = currentDate.split("-").reverse().join("/");
  
  const currentFacultyId = facultyData?.facultyId || facultyId || "FAC001";
  const currentBranch = departmentInfo?.name || facultyBranch || "CSE";
  
  // Get available classes (filter by department)
  const availableClasses = classList?.filter((cls: any) => {
    // Debug: log the class data to see structure
    console.log('Class data:', cls);
    console.log('Current department ID:', currentDepartmentId);
    return cls.departmentId === currentDepartmentId;
  }).map((cls: any) => ({
    id: cls.classId || cls._id,
    name: cls.name,
    year: cls.year,
    divisions: cls.divisions || []
  })) || [];

  // If no classes found, show all classes for debugging
  const finalAvailableClasses = availableClasses.length === 0 
    ? classList?.map((cls: any) => ({
        id: cls.classId || cls._id,
        name: cls.name,
        year: cls.year,
        divisions: cls.divisions || []
      })) || []
    : availableClasses;

  console.log('Final available classes:', finalAvailableClasses);
  
  // Get divisions for selected class
  const selectedClass = finalAvailableClasses.find(cls => cls.name === classYear);
  const divisions = selectedClass?.divisions.map((div: any) => div.name) || [];
  
  console.log('Selected class:', selectedClass);
  console.log('Divisions:', divisions);
  
  // Get available labs for selected class/division
  const getAvailableBatches = () => {
    if (!selectedClass) return [];
    
    console.log('=== LAB FILTERING DEBUG ===');
    console.log('Selected class for labs:', selectedClass);
    console.log('Available labs from API:', labsList);
    console.log('Current division:', division);
    
    if (!labsList || labsList.length === 0) {
      console.log('No labs available from API');
      return [];
    }
    
    // Log each lab's structure
    labsList.forEach((lab: any, index: number) => {
      console.log(`Lab ${index}:`, {
        name: lab.name,
        classId: lab.classId,
        divisionId: lab.divisionId,
        className: lab.className,
        divisionName: lab.divisionName,
        _id: lab._id
      });
    });
    
    let filteredLabs: any[] = [];
    
    if (division) {
      // Filter labs by division
      const divisionData = selectedClass.divisions.find((div: any) => div.name === division);
      console.log('Division data:', divisionData);
      
      if (divisionData) {
        filteredLabs = labsList?.filter((lab: any) => {
          // Try multiple matching strategies
          const possibleDivisionIds = [
            divisionData?.id,
            divisionData?.name // Use name as fallback since we don't have _id or divisionId on the mapped object
          ].filter(Boolean);
          
          const labDivisionId = lab.divisionId;
          const divisionNameMatch = lab.divisionName === division;
          const idMatch = possibleDivisionIds.includes(labDivisionId);
          
          console.log('Checking lab for division:', {
            labName: lab.name,
            expectedDivisionIds: possibleDivisionIds,
            labDivisionId: labDivisionId,
            labDivisionName: lab.divisionName,
            expectedDivisionName: division,
            divisionNameMatch,
            idMatch,
            finalMatch: divisionNameMatch || idMatch
          });
          
          return divisionNameMatch || idMatch;
        }) || [];
      }
    } else {
      // Filter labs by class (no division)
      filteredLabs = labsList?.filter((lab: any) => {
        // Try multiple matching strategies
        const possibleClassIds = [
          selectedClass.id,
          selectedClass.name // Use name as fallback since we don't have _id or classId on the mapped object
        ].filter(Boolean);
        
        const labClassId = lab.classId;
        const classNameMatch = lab.className === classYear;
        const idMatch = possibleClassIds.includes(labClassId);
        const hasNoDivision = !lab.divisionId && !lab.divisionName;
        
        console.log('Checking lab for class:', {
          labName: lab.name,
          expectedClassIds: possibleClassIds,
          labClassId: labClassId,
          labClassName: lab.className,
          expectedClassName: classYear,
          classNameMatch,
          idMatch,
          hasNoDivision,
          finalMatch: (classNameMatch || idMatch) && hasNoDivision
        });
        
        return (classNameMatch || idMatch) && hasNoDivision;
      }) || [];
    }
    
    console.log('Filtered labs:', filteredLabs);
    
    // FALLBACK: If no labs found with strict filtering, try loose matching or show all labs for this department
    if (filteredLabs.length === 0) {
      console.log('No labs found with strict filtering, trying loose matching...');
      
      // For debugging: show all department labs if no strict match
      console.log('Showing all department labs as fallback');
      filteredLabs = labsList || [];
    }
    
    const labNames = filteredLabs.map((lab: any) => lab.name);
    console.log('Final lab names:', labNames);
    
    return labNames;
  };
  
  const batches = getAvailableBatches();
  
  // Debug logs
  console.log('Current department ID:', currentDepartmentId);
  console.log('Labs list from API:', labsList);
  console.log('Available batches:', batches);
  
  // Get available subjects (already filtered by department from the query)
  const subjects = subjectsList?.map((subject: any) => subject.name) || [];
  
  console.log('Subjects list:', subjectsList);
  console.log('Final subjects:', subjects);
  
  // Lecture numbers 1-6
  const lectureNumbers = [1, 2, 3, 4, 5, 6];
  
  // Check if form is complete
  const isFormComplete = () => {
    if (!classYear) return false;
    // Only require division if divisions exist for the selected class
    if (classYear && divisions.length > 0 && !division) return false;
    if (!sessionType) return false;
    if (sessionType === "Lab" && batches.length > 0 && !batch) return false;
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
      lectureNumber: selectedLectureNumber,
      date: currentDate,
      branch: currentBranch,
      facultyId: currentFacultyId
    });
  };
  
  // Go back from review
  const goBackFromReview = () => {
    setIsReviewing(false);
  };
  
  if (isReviewing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white shadow-sm px-4 py-3 border-b">
          <h2 className="text-lg font-medium">Confirm Details</h2>
        </div>
        
        {/* Scrollable Review content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
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
              <div className="font-medium">{currentBranch}</div>
              
              <div className="text-gray-500">Faculty ID:</div>
              <div className="font-medium">{currentFacultyId}</div>
              
              {sessionType === "Lecture" && (
                <>
                  <div className="text-gray-500">Lecture Number:</div>
                  <div className="font-medium">{selectedLectureNumber}</div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Fixed Navigation buttons - positioned above mobile menu */}
        <div className="fixed bottom-16 left-0 right-0 z-10 p-4 bg-white border-t shadow-lg md:bottom-0">
          <div className="flex justify-between max-w-md mx-auto gap-3">
            <button
              onClick={goBackFromReview}
              className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 flex-1"
            >
              Back
            </button>
            
            <button
              onClick={completeSelection}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 flex-1"
            >
              Confirm<ChevronRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm px-4 py-3 border-b">
        <h2 className="text-lg font-medium">Attendance Selection</h2>
      </div>
      
      {/* Scrollable content with proper padding for fixed button */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Class Year selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Class Year*</h3>
          {finalAvailableClasses.length === 0 ? (
            <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-xl">
              No classes found for this department
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {finalAvailableClasses.map((cls) => (
                <button
                  key={cls.name}
                  className={`p-3 rounded-xl text-center ${
                    classYear === cls.name
                      ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setClassYear(cls.name)}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Division selection (if applicable) */}
        {classYear && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Division*</h3>
            {divisions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-xl">
                No divisions found for this class
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {divisions.map((div: string) => (
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
            )}
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

        {/* Lecture Number selection (for Lecture sessions) */}
        {sessionType === "Lecture" && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Lecture Number*</h3>
            <div className="grid grid-cols-6 gap-3">
              {lectureNumbers.map((num: number) => (
                <button
                  key={num}
                  className={`p-3 rounded-xl text-center ${
                    selectedLectureNumber === num
                      ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setSelectedLectureNumber(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Batch selection (for Lab sessions) */}
        {sessionType === "Lab" && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Batch*</h3>
            {batches.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-xl">
                No lab batches found for this class/division
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {batches.map((b: string) => (
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
            )}
          </div>
        )}
        
        {/* Subject selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Subject*</h3>
          {subjects.length === 0 ? (
            <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-xl">
              No subjects found for this department
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {subjects.map((sub: string) => (
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
          )}
        </div>
        
        {/* Auto-filled information */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Auto-filled Information</h3>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">Date:</div>
              <div>{formattedDate}</div>
              
              <div className="text-gray-500">Branch:</div>
              <div>{currentBranch}</div>
              
              <div className="text-gray-500">Faculty ID:</div>
              <div>{currentFacultyId}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Review & Confirm button - positioned above mobile menu */}
      <div className="fixed bottom-16 left-0 right-0 z-10 p-4 bg-white border-t shadow-lg md:bottom-0">
        <button
          onClick={handleReview}
          disabled={!isFormComplete()}
          className="w-full py-3 rounded-xl text-center text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium max-w-md mx-auto block"
        >
          Review & Confirm
        </button>
      </div>
    </div>
  );
};