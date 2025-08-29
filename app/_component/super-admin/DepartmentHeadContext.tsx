"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DepartmentHead {
  id: string;
  name: string;
  email: string;
  department: string;
  managementEnabled: boolean;
  employeeId: string;
  joinedDate: string;
}

interface DepartmentHeadContextType {
  departmentHeads: DepartmentHead[];
  updateDepartmentHead: (id: string, updates: Partial<DepartmentHead>) => void;
  addDepartmentHead: (head: Omit<DepartmentHead, 'id'>) => void;
  getDepartmentHeadByEmail: (email: string) => DepartmentHead | null;
  toggleManagementAccess: (id: string) => void;
}

const DepartmentHeadContext = createContext<DepartmentHeadContextType | undefined>(undefined);

// Mock initial data
const initialDepartmentHeads: DepartmentHead[] = [
  {
    id: "head-1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@institute.edu",
    department: "Computer Science & Engineering",
    managementEnabled: true,
    employeeId: "EMP001",
    joinedDate: "2023-01-15",
  },
  {
    id: "head-2",
    name: "Prof. Priya Sharma",
    email: "priya.sharma@institute.edu",
    department: "Information Technology",
    managementEnabled: true,
    employeeId: "EMP002",
    joinedDate: "2023-02-20",
  },
  {
    id: "head-3",
    name: "Dr. Amit Patel",
    email: "amit.patel@institute.edu",
    department: "Electronics & Communication",
    managementEnabled: false,
    employeeId: "EMP003",
    joinedDate: "2023-03-10",
  },
];

export const DepartmentHeadProvider = ({ children }: { children: ReactNode }) => {
  const [departmentHeads, setDepartmentHeads] = useState<DepartmentHead[]>(initialDepartmentHeads);

  const updateDepartmentHead = (id: string, updates: Partial<DepartmentHead>) => {
    setDepartmentHeads(prev => 
      prev.map(head => 
        head.id === id ? { ...head, ...updates } : head
      )
    );
  };

  const addDepartmentHead = (head: Omit<DepartmentHead, 'id'>) => {
    const newHead: DepartmentHead = {
      ...head,
      id: `head-${Date.now()}`, // Simple ID generation
    };
    setDepartmentHeads(prev => [...prev, newHead]);
  };

  const getDepartmentHeadByEmail = (email: string): DepartmentHead | null => {
    return departmentHeads.find(head => head.email === email) || null;
  };

  const toggleManagementAccess = (id: string) => {
    setDepartmentHeads(prev => 
      prev.map(head => 
        head.id === id 
          ? { ...head, managementEnabled: !head.managementEnabled }
          : head
      )
    );
  };

  return (
    <DepartmentHeadContext.Provider value={{
      departmentHeads,
      updateDepartmentHead,
      addDepartmentHead,
      getDepartmentHeadByEmail,
      toggleManagementAccess,
    }}>
      {children}
    </DepartmentHeadContext.Provider>
  );
};

export const useDepartmentHead = () => {
  const context = useContext(DepartmentHeadContext);
  if (context === undefined) {
    throw new Error('useDepartmentHead must be used within a DepartmentHeadProvider');
  }
  return context;
};

// Hook to check if current user has management access
export const useManagementAccess = (userEmail?: string) => {
  const { getDepartmentHeadByEmail } = useDepartmentHead();
  
  if (!userEmail) return false;
  
  const departmentHead = getDepartmentHeadByEmail(userEmail);
  return departmentHead?.managementEnabled || false;
};
