"use client";

import { useState } from "react";
import { FacultyManagement } from "@/app/_component/department-head/faculty-management";

// Mock data
const mockFacultyList = [
  {
    id: "FAC_DRJD_001",
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    assignedClasses: ["CLS_FIR24_2024", "CLS_SEC24_2025"]
  },
  {
    id: "FAC_MSJS_002", 
    name: "Ms. Jane Smith",
    email: "jane.smith@example.com",
    assignedClasses: ["CLS_THI24_2026"]
  },
  {
    id: "FAC_PRMI_003",
    name: "Prof. Mike Johnson",
    email: "mike.johnson@example.com",
    assignedClasses: []
  }
];

const mockClassList = [
  {
    id: "CLS_FIR24_2024",
    name: "First Year",
    year: "2024-25"
  },
  {
    id: "CLS_SEC24_2025",
    name: "Second Year",
    year: "2024-25"
  },
  {
    id: "CLS_THI24_2026",
    name: "Third Year",
    year: "2024-25"
  }
];

const generateFacultyId = (name: string, email: string) => {
  const namePrefix = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `FAC_${namePrefix}${emailPrefix}_${timestamp}`;
};

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState(mockFacultyList);

  const handleAddFaculty = (faculty: Omit<typeof mockFacultyList[0], 'id'>) => {
    const newFaculty = {
      ...faculty,
      id: generateFacultyId(faculty.name, faculty.email)
    };
    setFacultyList([...facultyList, newFaculty]);
  };

  const handleUpdateFaculty = (id: string, updates: Partial<typeof mockFacultyList[0]>) => {
    setFacultyList(facultyList.map(faculty => 
      faculty.id === id ? { ...faculty, ...updates } : faculty
    ));
  };

  const handleDeleteFaculty = (id: string) => {
    setFacultyList(facultyList.filter(faculty => faculty.id !== id));
  };

  return (
    <FacultyManagement 
      facultyList={facultyList}
      classList={mockClassList}
      onAddFaculty={handleAddFaculty}
      onUpdateFaculty={handleUpdateFaculty}
      onDeleteFaculty={handleDeleteFaculty}
    />
  );
}
