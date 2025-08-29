"use client";

import { useState } from "react";
import { LabManagement } from "@/app/_component/department-head/lab-management";

// Mock data with full structure including labs
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
        labs: [
          {
            id: "LAB_T1BFI_2024",
            name: "T1",
            divisionId: "DIV_FIRB_2024",
            rollNumberStart: 1,
            rollNumberEnd: 25
          }
        ]
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
          },
          {
            id: "LAB_T2ASE_2025",
            name: "T2",
            divisionId: "DIV_SECA_2025", 
            rollNumberStart: 26,
            rollNumberEnd: 50
          }
        ]
      }
    ]
  },
  {
    id: "CLS_THI24_2026",
    name: "Third Year",
    year: "2024-25",
    divisions: [
      {
        id: "DIV_THIA_2026",
        name: "A",
        classId: "CLS_THI24_2026",
        labs: []
      }
    ]
  }
];

const generateLabId = (labName: string, divisionName: string, className: string) => {
  const labPrefix = labName.replace(/\s+/g, '').slice(0, 2).toUpperCase();
  const divPrefix = divisionName.slice(0, 1).toUpperCase();
  const classPrefix = className.replace(/\s+/g, '').slice(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `LAB_${labPrefix}${divPrefix}${classPrefix}_${timestamp}`;
};

export default function LabsPage() {
  const [classList, setClassList] = useState(mockClassList);

  const handleAddLab = (divisionId: string, lab: Omit<typeof mockClassList[0]['divisions'][0]['labs'][0], 'id' | 'divisionId'>) => {
    setClassList(classList.map(cls => ({
      ...cls,
      divisions: cls.divisions.map(div => {
        if (div.id === divisionId) {
          const newLab = {
            ...lab,
            id: generateLabId(lab.name, div.name, cls.name),
            divisionId: divisionId
          };
          return {
            ...div,
            labs: [...div.labs, newLab]
          };
        }
        return div;
      })
    })));
  };

  const handleUpdateLab = (labId: string, updates: Partial<typeof mockClassList[0]['divisions'][0]['labs'][0]>) => {
    setClassList(classList.map(cls => ({
      ...cls,
      divisions: cls.divisions.map(div => ({
        ...div,
        labs: div.labs.map(lab => 
          lab.id === labId ? { ...lab, ...updates } : lab
        )
      }))
    })));
  };

  const handleDeleteLab = (labId: string) => {
    setClassList(classList.map(cls => ({
      ...cls,
      divisions: cls.divisions.map(div => ({
        ...div,
        labs: div.labs.filter(lab => lab.id !== labId)
      }))
    })));
  };

  return (
    <LabManagement 
      classList={classList}
      onAddLab={handleAddLab}
      onUpdateLab={handleUpdateLab}
      onDeleteLab={handleDeleteLab}
    />
  );
}
