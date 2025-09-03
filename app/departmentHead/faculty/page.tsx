"use client";

import { useState } from "react";
import { FacultyManagement } from "@/app/_component/department-head/faculty-management";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function FacultyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useKindeAuth();

  // Get current department head information based on logged-in user email
  const currentDepartmentHead = useQuery(
    api.superAdmin.getDepartmentHeadByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  // Convex queries
  const facultyList = useQuery(api.faculty.getAllFaculty, {}) || [];
  const classList = useQuery(api.classes.getAllClasses) || [];

  // Convex mutations
  const addFacultyMutation = useMutation(api.faculty.createFaculty);
  const updateFacultyMutation = useMutation(api.faculty.updateFaculty);
  const deleteFacultyMutation = useMutation(api.faculty.deleteFaculty);
  const assignCoordinatorMutation = useMutation(api.faculty.assignClassCoordinator);
  const removeCoordinatorMutation = useMutation(api.faculty.removeClassCoordinator);

  const handleAddFaculty = async (faculty: {
    name: string;
    email: string;
    assignedClasses: string[];
    qualification?: string;
  }) => {
    try {
      setIsLoading(true);
      
      // Convert string IDs to Convex IDs
      const assignedClassIds = faculty.assignedClasses
        .map(classId => {
          const classItem = classList.find(cls => cls.classId === classId);
          return classItem ? classItem._id : null;
        })
        .filter(Boolean) as Id<"classes">[];

      // Get department ID from currently logged in department head
      let currentDepartmentId: Id<"departments"> | undefined;
      
      if (currentDepartmentHead?.departmentId) {
        // Use the department ID from the logged-in department head
        currentDepartmentId = currentDepartmentHead.departmentId;
        console.log("✅ Using department ID from logged-in department head:", currentDepartmentId);
      } else {
        // No department head found, pass undefined
        currentDepartmentId = undefined;
        console.log("⚠️ Department head not found for email:", user?.email || "no email");
        console.log("⚠️ Faculty will be created without department assignment");
      }

      await addFacultyMutation({
        name: faculty.name,
        email: faculty.email,
        assignedClasses: assignedClassIds,
        departmentId: currentDepartmentId,
        qualification: faculty.qualification,
      });

      console.log("✅ Faculty added successfully with department ID:", currentDepartmentId);
    } catch (error) {
      console.error("❌ Error adding faculty:", error);
      alert(`Error adding faculty: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFaculty = async (id: string, updates: {
    name?: string;
    email?: string;
    assignedClasses?: string[];
    qualification?: string;
  }) => {
    try {
      setIsLoading(true);
      
      // Find the faculty by facultyId
      const faculty = facultyList.find((f: any) => f.facultyId === id);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      // Convert string IDs to Convex IDs if assignedClasses is being updated
      const updateData: any = { ...updates };
      if (updates.assignedClasses) {
        updateData.assignedClasses = updates.assignedClasses
          .map(classId => {
            const classItem = classList.find(cls => cls.classId === classId);
            return classItem ? classItem._id : null;
          })
          .filter(Boolean) as Id<"classes">[];
      }

      await updateFacultyMutation({
        id: faculty._id,
        ...updateData,
      });

      console.log("✅ Faculty updated successfully");
    } catch (error) {
      console.error("❌ Error updating faculty:", error);
      alert(`Error updating faculty: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Find the faculty by facultyId
      const faculty = facultyList.find((f: any) => f.facultyId === id);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      await deleteFacultyMutation({ id: faculty._id });
      console.log("✅ Faculty deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting faculty:", error);
      alert(`Error deleting faculty: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignCoordinator = async (facultyId: string, target: {
    type: "class" | "division";
    classId?: string;
    divisionId?: string;
  }) => {
    try {
      setIsLoading(true);
      
      console.log("🔄 Assigning coordinator:", { facultyId, target });
      
      // Find the faculty by facultyId
      const faculty = facultyList.find((f: any) => f.facultyId === facultyId);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      console.log("👤 Found faculty:", faculty);

      let coordinatorTarget;
      if (target.type === "class" && target.classId) {
        const classItem = classList.find(cls => cls.classId === target.classId);
        if (!classItem) throw new Error("Class not found");
        coordinatorTarget = {
          type: "class" as const,
          classId: classItem._id
        };
        console.log("🎓 Class target:", coordinatorTarget);
      } else if (target.type === "division" && target.divisionId) {
        // Find division by divisionId across all classes
        let division = null;
        for (const cls of classList) {
          division = cls.divisions.find((div: any) => div.divisionId === target.divisionId);
          if (division) break;
        }
        if (!division) throw new Error("Division not found");
        coordinatorTarget = {
          type: "division" as const,
          divisionId: division._id
        };
        console.log("📚 Division target:", coordinatorTarget);
      } else {
        throw new Error("Invalid coordinator target");
      }

      console.log("📤 Sending to Convex:", {
        facultyId: faculty._id,
        target: coordinatorTarget,
      });

      await assignCoordinatorMutation({
        facultyId: faculty._id,
        target: coordinatorTarget,
      });

      console.log("✅ Coordinator assigned successfully");
    } catch (error) {
      console.error("❌ Error assigning coordinator:", error);
      alert(`Error assigning coordinator: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoordinator = async (facultyId: string) => {
    try {
      setIsLoading(true);
      
      // Find the faculty by facultyId
      const faculty = facultyList.find((f: any) => f.facultyId === facultyId);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      await removeCoordinatorMutation({ facultyId: faculty._id });
      console.log("✅ Coordinator removed successfully");
    } catch (error) {
      console.error("❌ Error removing coordinator:", error);
      alert(`Error removing coordinator: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform data for component compatibility
  const transformedFacultyList = facultyList.map((faculty: any) => ({
    id: faculty.facultyId,
    name: faculty.name,
    email: faculty.email,
    departmentId: faculty.departmentId,
    assignedClasses: faculty.assignedClassesInfo?.map((cls: any) => cls.classId) || [],
    coordinatorInfo: faculty.coordinatorInfo,
    isClassCoordinator: faculty.isClassCoordinator,
  }));

  const transformedClassList = classList.map(cls => ({
    id: cls.classId,
    name: cls.name,
    year: cls.year,
    divisions: cls.divisions.map((div: any) => ({
      id: div.divisionId,
      name: div.name,
      classId: cls.classId,
    })),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <FacultyManagement 
      facultyList={transformedFacultyList}
      classList={transformedClassList}
      onAddFaculty={handleAddFaculty}
      onUpdateFaculty={handleUpdateFaculty}
      onDeleteFaculty={handleDeleteFaculty}
      onAssignCoordinator={handleAssignCoordinator}
      onRemoveCoordinator={handleRemoveCoordinator}
    />
  );
}
