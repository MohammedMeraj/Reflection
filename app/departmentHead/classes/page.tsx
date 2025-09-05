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

  // Show skeleton loading until classes data is loaded
  if (classListData === undefined) {
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
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Classes List Skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
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
