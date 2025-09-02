"use client";

import { useState, useEffect } from "react";
import { Plus, FlaskConical, Search, Check, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmoothScrollContainer } from "@/components/ui/smooth-scroll-container";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Lab {
  _id: string;
  labId: string;
  name: string;
  classId?: string;
  divisionId?: string;
  rollNumberStart: number;
  rollNumberEnd: number;
  year: number;
  className?: string;
  divisionName?: string;
}

interface Division {
  _id: string;
  name: string;
  classId: string;
  divisionId?: string;
}

interface Class {
  _id: string;
  name: string;
  year: number;
  divisions?: Division[];
}

export const LabManagement = () => {
  const [isAddingLab, setIsAddingLab] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [labName, setLabName] = useState("");
  const [rollNumberStart, setRollNumberStart] = useState(1);
  const [rollNumberEnd, setRollNumberEnd] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");

  // Convex queries
  const classList = useQuery(api.classes.getAllClasses) || [];
  const allLabs = useQuery(api.labs.getAllLabs, {}) || [];

  // Convex mutations
  const createLabMutation = useMutation(api.labs.createLab);

  // Get selected class details
  const selectedClass = classList.find(cls => cls._id === selectedClassId);
  const availableDivisions = selectedClass?.divisions || [];
  const hasDivisions = availableDivisions.length > 0;

  // Get existing labs for the selected class/division
  const getExistingLabs = () => {
    return allLabs.filter(lab => {
      if (hasDivisions && selectedDivisionId) {
        return lab.divisionId === selectedDivisionId;
      } else if (!hasDivisions && selectedClassId) {
        return lab.classId === selectedClassId && !lab.divisionId;
      }
      return false;
    });
  };

  const existingLabs = getExistingLabs();

  // Check for overlapping ranges and suggest next start
  const checkRangeOverlap = (start: number, end: number) => {
    const overlapping = existingLabs.find(lab => 
      (start >= lab.rollNumberStart && start <= lab.rollNumberEnd) ||
      (end >= lab.rollNumberStart && end <= lab.rollNumberEnd) ||
      (start <= lab.rollNumberStart && end >= lab.rollNumberEnd)
    );
    return overlapping;
  };

  const getNextAvailableStart = () => {
    if (existingLabs.length === 0) return 1;
    
    const maxEnd = Math.max(...existingLabs.map(lab => lab.rollNumberEnd));
    return maxEnd + 1;
  };

  // Auto-adjust start when class/division changes
  useEffect(() => {
    if (selectedClassId) {
      const nextStart = getNextAvailableStart();
      setRollNumberStart(nextStart);
      setRollNumberEnd(nextStart + 29); // Default range of 30
    }
  }, [selectedClassId, selectedDivisionId, existingLabs.length]);

  // Generate unique lab ID
  const generateLabId = () => {
    const currentYear = new Date().getFullYear();
    const classCode = selectedClass?.name?.replace(/\s+/g, '').slice(0, 3).toUpperCase() || 'CLS';
    const divisionCode = hasDivisions && selectedDivisionId 
      ? availableDivisions.find((d: Division) => d._id === selectedDivisionId)?.name?.slice(0, 1).toUpperCase() || 'A'
      : '';
    const labCode = labName.replace(/\s+/g, '').slice(0, 2).toUpperCase();
    
    return `LAB_${classCode}${divisionCode}_${labCode}_${currentYear}`;
  };

  const handleAddLab = async () => {
    // Validation
    if (!selectedClassId || !labName || rollNumberStart > rollNumberEnd) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (hasDivisions && !selectedDivisionId) {
      alert("Please select a division");
      return;
    }

    // Check for overlapping ranges
    const overlap = checkRangeOverlap(rollNumberStart, rollNumberEnd);
    if (overlap) {
      alert(`Range ${rollNumberStart}-${rollNumberEnd} overlaps with existing lab "${overlap.name}" (${overlap.rollNumberStart}-${overlap.rollNumberEnd}). Please use a different range.`);
      return;
    }

    try {
      const labId = generateLabId();
      const currentYear = new Date().getFullYear();

      await createLabMutation({
        name: labName,
        labId,
        classId: hasDivisions ? undefined : selectedClassId as Id<"classes">,
        divisionId: hasDivisions ? selectedDivisionId as Id<"divisions"> : undefined,
        rollNumberStart,
        rollNumberEnd,
        year: currentYear,
        isActive: true,
        createdAt: Date.now(),
      });

      // Reset form
      setLabName("");
      setSelectedClassId("");
      setSelectedDivisionId("");
      setRollNumberStart(1);
      setRollNumberEnd(30);
      setIsAddingLab(false);

      alert("Lab created successfully!");
    } catch (error) {
      console.error("Error creating lab:", error);
      alert(`Error creating lab: ${error}`);
    }
  };

  const handleCancel = () => {
    setLabName("");
    setSelectedClassId("");
    setSelectedDivisionId("");
    setRollNumberStart(1);
    setRollNumberEnd(30);
    setIsAddingLab(false);
  };

  // Filter labs for search
  const filteredLabs = allLabs.filter(lab =>
    lab.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.divisionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SmoothScrollContainer className="p-4 max-w-4xl mx-auto space-y-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Lab Management</h1>
        <Button
          onClick={() => setIsAddingLab(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Lab
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search labs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Lab Dialog */}
      {isAddingLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Add New Lab</h3>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Select Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class *
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedDivisionId(""); // Reset division when class changes
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a class</option>
                  {classList.map((cls: Class) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} ({cls.year})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Division (only if divisions exist) */}
              {selectedClassId && hasDivisions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Division *
                  </label>
                  <select
                    value={selectedDivisionId}
                    onChange={(e) => setSelectedDivisionId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a division</option>
                    {availableDivisions.map((div: Division) => (
                      <option key={div._id} value={div._id}>
                        Division {div.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Lab Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lab Name *
                </label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g., Batch A, Lab 1, Morning Shift"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Roll Number Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Start *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rollNumberStart}
                    onChange={(e) => setRollNumberStart(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll End *
                  </label>
                  <input
                    type="number"
                    min={rollNumberStart}
                    value={rollNumberEnd}
                    onChange={(e) => setRollNumberEnd(parseInt(e.target.value) || rollNumberStart)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Lab ID Preview */}
              {selectedClassId && labName && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">Lab ID Preview</p>
                  </div>
                  <div className="bg-white border rounded-md px-3 py-2">
                    <p className="font-mono text-sm font-bold text-gray-800">
                      {generateLabId()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="w-3 h-3" />
                    <span>ID will be permanent once created</span>
                  </div>
                </div>
              )}

              {/* Existing Labs Info */}
              {selectedClassId && existingLabs.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Existing Labs in {hasDivisions && selectedDivisionId ? 'Division' : 'Class'}:
                  </p>
                  <div className="space-y-1">
                    {existingLabs.map(lab => (
                      <p key={lab._id} className="text-xs text-blue-700">
                        {lab.name}: Roll {lab.rollNumberStart}-{lab.rollNumberEnd}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Next available start: {getNextAvailableStart()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleAddLab}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedClassId || !labName || rollNumberStart > rollNumberEnd || (hasDivisions && !selectedDivisionId)}
              >
                Create Lab
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lab List */}
      <div className="space-y-3">
        {filteredLabs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FlaskConical className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No labs found</p>
            {searchTerm && (
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your search terms
              </p>
            )}
          </div>
        ) : (
          filteredLabs.map((lab) => (
            <div key={lab._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{lab.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Class:</span>
                      <p className="font-medium">{lab.className}</p>
                    </div>
                    {lab.divisionName && (
                      <div>
                        <span className="text-gray-500">Division:</span>
                        <p className="font-medium">{lab.divisionName}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Roll Range:</span>
                      <p className="font-medium">{lab.rollNumberStart}-{lab.rollNumberEnd}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Students:</span>
                      <p className="font-medium">{lab.rollNumberEnd - lab.rollNumberStart + 1}</p>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Lock className="w-3 h-3" />
                      <span>Lab ID</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-gray-800">{lab.labId}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SmoothScrollContainer>
  );
};
