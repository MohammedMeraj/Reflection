"use client"
import { UserManagement } from "@/app/_component/super-admin/user-management";
import { useState, useEffect } from "react";

// Mock users data
const mockUsers = [
  {
    id: "user-1",
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@svkmit.ac.in",
    phone: "+91-9876543210",
    role: "Admin" as const,
    institution: "SVKM's Institute of Technology",
    department: "Computer Science",
    status: "Active" as const,
    lastLogin: "2024-01-15T10:30:00Z",
    joinedDate: "2020-03-15T00:00:00Z",
  },
  {
    id: "user-2",
    name: "System Administrator",
    email: "admin@msbte.gov.in",
    phone: "+91-9123456789",
    role: "Super Admin" as const,
    institution: "Maharashtra State Board",
    status: "Active" as const,
    lastLogin: "2024-01-16T09:15:00Z",
    joinedDate: "2019-01-01T00:00:00Z",
  },
  {
    id: "user-3",
    name: "Prof. Priya Patel",
    email: "priya.patel@bvcoep.edu.in",
    phone: "+91-9234567890",
    role: "Faculty" as const,
    institution: "Bharati Vidyapeeth College",
    department: "Information Technology",
    status: "Active" as const,
    lastLogin: "2024-01-14T14:45:00Z",
    joinedDate: "2021-07-20T00:00:00Z",
  },
  {
    id: "user-4",
    name: "Amit Kumar",
    email: "amit.kumar@student.svkmit.ac.in",
    phone: "+91-9345678901",
    role: "Student" as const,
    institution: "SVKM's Institute of Technology",
    department: "Computer Science",
    status: "Active" as const,
    lastLogin: "2024-01-15T16:20:00Z",
    joinedDate: "2023-08-01T00:00:00Z",
  },
  {
    id: "user-5",
    name: "Dr. Sunita Desai",
    email: "sunita.desai@govpoly.edu.in",
    phone: "+91-9456789012",
    role: "Faculty" as const,
    institution: "Government Polytechnic",
    department: "Electronics",
    status: "Pending" as const,
    lastLogin: "2024-01-10T11:30:00Z",
    joinedDate: "2024-01-05T00:00:00Z",
  },
  {
    id: "user-6",
    name: "Prof. Vikram Singh",
    email: "vikram.singh@dbatu.ac.in",
    phone: "+91-9567890123",
    role: "Admin" as const,
    institution: "Dr. Babasaheb Ambedkar Tech University",
    department: "Mechanical Engineering",
    status: "Active" as const,
    lastLogin: "2024-01-13T08:45:00Z",
    joinedDate: "2018-09-10T00:00:00Z",
  },
  {
    id: "user-7",
    name: "Neha Gupta",
    email: "neha.gupta@student.bvcoep.edu.in",
    phone: "+91-9678901234",
    role: "Student" as const,
    institution: "Bharati Vidyapeeth College",
    department: "Computer Science",
    status: "Inactive" as const,
    lastLogin: "2023-12-20T15:10:00Z",
    joinedDate: "2022-08-15T00:00:00Z",
  },
];

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleAddUser = () => {
    console.log("Add new user");
    // Navigate to add user form
  };

  const handleEditUser = (id: string) => {
    console.log("Edit user:", id);
    // Navigate to edit user form
  };

  const handleDeleteUser = (id: string) => {
    console.log("Delete user:", id);
    // Show confirmation dialog and delete
  };

  const handleToggleStatus = (id: string) => {
    console.log("Toggle user status:", id);
    // Toggle user active/inactive status
  };

  return (
    <UserManagement 
      users={mockUsers}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      onToggleStatus={handleToggleStatus}
      isLoading={isLoading}
    />
  );
}
