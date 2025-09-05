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
  const facultyList = useQuery(api.faculty.getAllFaculty, {});
  const classList = useQuery(api.classes.getAllClasses);

  // Convex mutations
  const addFacultyMutation = useMutation(api.faculty.createFaculty);
  const updateFacultyMutation = useMutation(api.faculty.updateFaculty);
  const deleteFacultyMutation = useMutation(api.faculty.deleteFaculty);
  const assignCoordinatorMutation = useMutation(api.faculty.assignClassCoordinator);
  const removeCoordinatorMutation = useMutation(api.faculty.removeClassCoordinator);

  // Show skeleton loading until all data is loaded
  if (facultyList === undefined || classList === undefined || currentDepartmentHead === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Header Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 max-w-md mx-auto">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="pt-20 pb-20 p-4 max-w-md mx-auto space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Faculty List Skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          const classItem = (classList || []).find(cls => cls.classId === classId);
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
      const faculty = facultyList!.find((f: any) => f.facultyId === id);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      // Convert string IDs to Convex IDs if assignedClasses is being updated
      const updateData: any = { ...updates };
      if (updates.assignedClasses) {
        updateData.assignedClasses = updates.assignedClasses
          .map(classId => {
            const classItem = classList!.find(cls => cls.classId === classId);
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
      const faculty = facultyList!.find((f: any) => f.facultyId === id);
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
      const faculty = facultyList!.find((f: any) => f.facultyId === facultyId);
      if (!faculty) {
        throw new Error("Faculty not found");
      }

      console.log("👤 Found faculty:", faculty);

      let coordinatorTarget;
      if (target.type === "class" && target.classId) {
        const classItem = classList!.find(cls => cls.classId === target.classId);
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
      const faculty = facultyList!.find((f: any) => f.facultyId === facultyId);
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

  // Transform data for component compatibility (data is guaranteed to be loaded here)
  const transformedFacultyList = (facultyList || []).map((faculty: any) => ({
    id: faculty.facultyId,
    name: faculty.name,
    email: faculty.email,
    departmentId: faculty.departmentId,
    assignedClasses: faculty.assignedClassesInfo?.map((cls: any) => cls.classId) || [],
    coordinatorInfo: faculty.coordinatorInfo,
    isClassCoordinator: faculty.isClassCoordinator,
  }));

  const transformedClassList = (classList || []).map(cls => ({
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
