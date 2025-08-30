"use client";

import { useState, useEffect } from "react";
import { ClassManagement } from "@/app/_component/department-head/class-management";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ClassesPage() {
  // Get real data from Convex
  const classListData = useQuery(api.classes.getAllClasses);
  const createClass = useMutation(api.classes.createClass);
  const updateClass = useMutation(api.classes.updateClass);
  const deleteClass = useMutation(api.classes.deleteClass);
  const createDivision = useMutation(api.classes.createDivision);
  const deleteDivision = useMutation(api.classes.deleteDivision);

  // Transform Convex data to match component interface
  const classList = classListData?.map(cls => ({
    id: cls._id,
    classId: cls.classId,
    name: cls.name,
    year: cls.year,
    divisions: cls.divisions || []
  })) || [];

  const handleAddClass = async (cls: { name: string; year: string }) => {
    try {
      await createClass({
        name: cls.name,
        year: parseInt(cls.year),
      });
    } catch (error) {
      console.error("Failed to add class:", error);
      alert("Failed to add class. Please try again.");
    }
  };

  const handleUpdateClass = async (id: string, updates: { name?: string; year?: string }) => {
    try {
      await updateClass({
        classId: id as Id<"classes">,
        name: updates.name,
        year: updates.year ? parseInt(updates.year) : undefined,
      });
    } catch (error) {
      console.error("Failed to update class:", error);
      alert("Failed to update class. Please try again.");
    }
  };

  const handleDeleteClass = async (id: string) => {
    // Show warning dialog
    const confirmed = window.confirm(
      "⚠️ WARNING: This action is irreversible!\n\n" +
      "Deleting this class will also remove ALL associated divisions and data.\n" +
      "This action cannot be undone.\n\n" +
      "Are you sure you want to proceed?"
    );

    if (!confirmed) return;

    try {
      await deleteClass({ classId: id as Id<"classes"> });
    } catch (error) {
      console.error("Failed to delete class:", error);
      alert("Failed to delete class. Please try again.");
    }
  };

  const handleAddDivision = async (classId: string, divisionName: string) => {
    try {
      await createDivision({
        classId: classId as Id<"classes">,
        name: divisionName,
      });
    } catch (error) {
      console.error("Failed to add division:", error);
      alert("Failed to add division. Please try again.");
    }
  };

  const handleDeleteDivision = async (classId: string, divisionId: string) => {
    // Show warning dialog
    const confirmed = window.confirm(
      "⚠️ WARNING: This action is irreversible!\n\n" +
      "Deleting this division will remove all associated data.\n" +
      "This action cannot be undone.\n\n" +
      "Are you sure you want to proceed?"
    );

    if (!confirmed) return;

    try {
      await deleteDivision({ divisionId: divisionId as Id<"divisions"> });
    } catch (error) {
      console.error("Failed to delete division:", error);
      alert("Failed to delete division. Please try again.");
    }
  };

  // Show loading state while data is being fetched
  if (classListData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes data...</p>
        </div>
      </div>
    );
  }

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
