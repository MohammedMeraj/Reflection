"use client";

import { useState } from "react";
import { ClassManagement } from "@/app/_component/department-head/class-management";

// Mock data with full structure
const mockClassList = [
  {
    id: "CLS_FIR24_2024",
    name: "First Year",
    year: "2024-25",
    divisions: [
      {
        id: "DIV_FIRA_2024",
        name: "A",
        classId: "CLS_FIR24_2024"
      },
      {
        id: "DIV_FIRB_2024",
        name: "B",
        classId: "CLS_FIR24_2024"
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
        classId: "CLS_SEC24_2025"
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

const generateClassId = (name: string, year: string) => {
  const namePrefix = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const yearPrefix = year.replace(/\s+/g, '').slice(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `CLS_${namePrefix}${yearPrefix}_${timestamp}`;
};

const generateDivisionId = (className: string, divisionName: string) => {
  const classPrefix = className.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const divPrefix = divisionName.replace(/\s+/g, '').slice(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `DIV_${classPrefix}${divPrefix}_${timestamp}`;
};

export default function ClassesPage() {
  const [classList, setClassList] = useState(mockClassList);

  const handleAddClass = (cls: Omit<typeof mockClassList[0], 'id' | 'divisions'>) => {
    const newClass = {
      ...cls,
      id: generateClassId(cls.name, cls.year),
      divisions: []
    };
    setClassList([...classList, newClass]);
  };

  const handleUpdateClass = (id: string, updates: Partial<typeof mockClassList[0]>) => {
    setClassList(classList.map(cls => 
      cls.id === id ? { ...cls, ...updates } : cls
    ));
  };

  const handleDeleteClass = (id: string) => {
    setClassList(classList.filter(cls => cls.id !== id));
  };

  const handleAddDivision = (classId: string, divisionName: string) => {
    setClassList(classList.map(cls => {
      if (cls.id === classId) {
        const newDivision = {
          id: generateDivisionId(cls.name, divisionName),
          name: divisionName,
          classId: classId
        };
        return {
          ...cls,
          divisions: [...cls.divisions, newDivision]
        };
      }
      return cls;
    }));
  };

  const handleDeleteDivision = (classId: string, divisionId: string) => {
    setClassList(classList.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          divisions: cls.divisions.filter(div => div.id !== divisionId)
        };
      }
      return cls;
    }));
  };

  return (
    <ClassManagement 
      classList={classList}
      onAddClass={handleAddClass}
      onUpdateClass={handleUpdateClass}
      onDeleteClass={handleDeleteClass}
      onAddDivision={handleAddDivision}
      onDeleteDivision={handleDeleteDivision}
    />
  );
}
