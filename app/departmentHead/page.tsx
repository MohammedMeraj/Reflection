"use client";

import { useState } from "react";
import { DepartmentHeadDashboard } from "@/app/_component/department-head/department-head-home";

// Mock data for the department head dashboard

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
    year: "2024-25",
    divisions: [
      {
        id: "DIV_FIRA_2024",
        name: "A",
        classId: "CLS_FIR24_2024",
        labs: [
          {
            id: "LAB_T1AFI_2024",
            name: "T1",
            divisionId: "DIV_FIRA_2024",
            rollNumberStart: 1,
            rollNumberEnd: 22
          },
          {
            id: "LAB_T2AFI_2025",
            name: "T2", 
            divisionId: "DIV_FIRA_2024",
            rollNumberStart: 23,
            rollNumberEnd: 44
          }
        ]
      },
      {
        id: "DIV_FIRB_2024",
        name: "B",
        classId: "CLS_FIR24_2024",
        labs: []
      }
    ]
  },
  {
    id: "CLS_SEC24_2025",
    name: "Second Year",
    year: "2024-25",
    divisions: [
      {
        id: "DIV_SECA_2025",
        name: "A",
        classId: "CLS_SEC24_2025",
        labs: [
          {
            id: "LAB_T1ASE_2025",
            name: "T1",
            divisionId: "DIV_SECA_2025", 
            rollNumberStart: 1,
            rollNumberEnd: 25
          }
        ]
      }
    ]
  },
  {
    id: "CLS_THI24_2026",
    name: "Third Year",
    year: "2024-25", 
    divisions: []
  }
];

export default function DepartmentHeadPage() {
  const [facultyList, setFacultyList] = useState(mockFacultyList);
  const [classList, setClassList] = useState(mockClassList);

  return (
    <DepartmentHeadDashboard 
      facultyList={facultyList}
      classList={classList}
    />
  );
}
