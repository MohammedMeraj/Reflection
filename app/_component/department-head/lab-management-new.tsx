"use client";

import { useState, useEffect } from "react";
import { Plus, FlaskConical, Hash, Edit3, Trash2, Search, BookOpen, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Lab {
  id: string;
  name: string;
  divisionId: string;
  rollNumberStart: number;
  rollNumberEnd: number;
}

interface Division {
  id: string;
  name: string;
  classId: string;
  labs: Lab[];
}

interface Class {
  id: string;
  name: string;
  year: string;
  divisions: Division[];
}

interface LabManagementProps {
  classList: Class[];
  onAddLab: (divisionId: string, lab: Omit<Lab, 'id' | 'divisionId'>) => void;
  onUpdateLab: (labId: string, lab: Partial<Lab>) => void;
  onDeleteLab: (labId: string) => void;
}

export const LabManagement = ({
  classList,
  onAddLab,
  onUpdateLab,
  onDeleteLab
}: LabManagementProps) => {
  const [isAddingLab, setIsAddingLab] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newLab, setNewLab] = useState({
    name: "",
    rollNumberStart: 1,
    rollNumberEnd: 1
  });
  const [previewLabId, setPreviewLabId] = useState("");
  const [isUniqueId, setIsUniqueId] = useState(false);

  // Query to check ID uniqueness - need to convert divisionId to actual Convex ID
  const getConvexDivisionId = () => {
    if (!selectedClassId || !selectedDivisionId) return null;
    
    const selectedClass = classList.find(cls => cls.id === selectedClassId);
    const division = selectedClass?.divisions.find(div => div.id === selectedDivisionId);
    return division?.id; // This should be the actual Convex ID
  };

  const convexDivisionId = getConvexDivisionId();
  
  // Generate preview lab ID
  const generatePreviewLabId = () => {
    if (!newLab.name || !selectedDivisionId) return "";
    
    const selectedClass = classList.find(cls => cls.id === selectedClassId);
    const division = selectedClass?.divisions.find(div => div.id === selectedDivisionId);
    
    if (!selectedClass) return "";
    
    const classPrefix = selectedClass.name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const divPrefix = division?.name?.slice(0, 1).toUpperCase() || 'A';
    const labPrefix = newLab.name.replace(/\s+/g, '').slice(0, 2).toUpperCase();
    const currentYear = new Date().getFullYear();
    
    return `LAB_${classPrefix}${divPrefix}_${labPrefix}_${currentYear}`;
  };

  // Update preview ID when form changes
  useEffect(() => {
    const previewId = generatePreviewLabId();
    setPreviewLabId(previewId);
    setIsUniqueId(!!previewId); // Set to true if we have a valid preview
  }, [newLab.name, selectedDivisionId, selectedClassId]);

  const handleAddLab = () => {
    if (newLab.name && selectedDivisionId && newLab.rollNumberStart <= newLab.rollNumberEnd && isUniqueId) {
      onAddLab(selectedDivisionId, newLab);
      setNewLab({ name: "", rollNumberStart: 1, rollNumberEnd: 1 });
      setIsAddingLab(false);
      setSelectedClassId("");
      setSelectedDivisionId("");
      setPreviewLabId("");
    }
  };

  // Get all labs across all classes and divisions for search
  const getAllLabs = () => {
    const allLabs: Array<Lab & { className: string; divisionName: string; classYear: string }> = [];
    classList.forEach(cls => {
      cls.divisions.forEach(div => {
        div.labs.forEach(lab => {
          allLabs.push({
            ...lab,
            className: cls.name,
            divisionName: div.name,
            classYear: cls.year
          });
        });
      });
    });
    return allLabs;
  };

  const filteredLabs = getAllLabs().filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.divisionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableDivisions = selectedClassId 
    ? classList.find(cls => cls.id === selectedClassId)?.divisions || []
    : [];

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
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

      {/* Add Lab Form */}
      {isAddingLab && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-800">Add New Lab</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Class *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedDivisionId("");
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a class</option>
                {classList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.year})
                  </option>
                ))}
              </select>
            </div>

            {selectedClassId && (
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
                  {availableDivisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      Division {div.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lab Name *
              </label>
              <input
                type="text"
                value={newLab.name}
                onChange={(e) => setNewLab({ ...newLab, name: e.target.value })}
                placeholder="e.g., T1, T2, Batch A"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Start *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newLab.rollNumberStart}
                  onChange={(e) => setNewLab({ ...newLab, rollNumberStart: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll End *
                </label>
                <input
                  type="number"
                  min={newLab.rollNumberStart}
                  value={newLab.rollNumberEnd}
                  onChange={(e) => setNewLab({ ...newLab, rollNumberEnd: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Enhanced Lab ID Preview with Uniqueness Check */}
            {previewLabId && (
              <div className={`p-4 rounded-lg border-2 ${
                isUniqueId 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isUniqueId 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                  }`}>
                    {isUniqueId ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-xs">!</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      isUniqueId ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {isUniqueId ? '✓ Unique Lab ID Available' : '⚠ ID Being Generated...'}
                    </p>
                    <p className={`text-xs ${
                      isUniqueId ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {isUniqueId 
                        ? 'This ID is ready to use and will be permanent' 
                        : 'Checking for uniqueness and generating ID'
                      }
                    </p>
                  </div>
                </div>
                <div className="bg-white border rounded-md px-3 py-2">
                  <p className="font-mono text-sm font-bold text-gray-800">
                    {previewLabId}
                  </p>
                </div>
                <div className="mt-2 p-2 bg-white rounded-md border">
                  <p className="text-xs text-blue-600 mb-1">Lab Details:</p>
                  <p className="text-sm text-blue-700">
                    Students: {newLab.rollNumberEnd - newLab.rollNumberStart + 1} 
                    (Roll {newLab.rollNumberStart} - {newLab.rollNumberEnd})
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <Lock className="w-3 h-3" />
                  <span>ID will be permanent once created</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleAddLab}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newLab.name || !selectedDivisionId || newLab.rollNumberStart > newLab.rollNumberEnd || !isUniqueId}
            >
              Add Lab
            </Button>
            <Button
              onClick={() => {
                setIsAddingLab(false);
                setNewLab({ name: "", rollNumberStart: 1, rollNumberEnd: 1 });
                setSelectedClassId("");
                setSelectedDivisionId("");
                setPreviewLabId("");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
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
            <div key={lab.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{lab.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-gray-600">
                      {lab.className} - Division {lab.divisionName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Hash className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-gray-600">
                      Roll {lab.rollNumberStart} - {lab.rollNumberEnd} 
                      <span className="text-blue-600 font-medium ml-1">
                        ({lab.rollNumberEnd - lab.rollNumberStart + 1} students)
                      </span>
                    </p>
                  </div>

                  {/* Display Lab ID with Lock Icon */}
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Lock className="w-3 h-3" />
                      <span>Permanent Lab ID</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-gray-800">
                      {lab.id}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('⚠️ WARNING: This action is IRREVERSIBLE!\n\nDeleting this lab will permanently remove all lab data.\n\nThis cannot be undone. Are you absolutely sure?')) {
                        onDeleteLab(lab.id);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Lab Details */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded-md">
                  <p className="text-xs text-blue-600 font-medium">Lab Name</p>
                  <p className="text-sm font-semibold text-blue-800">{lab.name}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-md">
                  <p className="text-xs text-blue-600 font-medium">Start Roll</p>
                  <p className="text-sm font-semibold text-blue-800">{lab.rollNumberStart}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-md">
                  <p className="text-xs text-blue-600 font-medium">End Roll</p>
                  <p className="text-sm font-semibold text-blue-800">{lab.rollNumberEnd}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Class-wise Lab Summary */}
      {!searchTerm && classList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Lab Summary by Class</h3>
          <div className="space-y-2">
            {classList.map((cls) => {
              const totalLabs = cls.divisions.reduce((acc, div) => acc + div.labs.length, 0);
              return (
                <div key={cls.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cls.name}</p>
                    <p className="text-xs text-gray-600">{cls.divisions.length} divisions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{totalLabs} labs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
