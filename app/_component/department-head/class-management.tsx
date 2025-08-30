"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Calendar, Users, Edit3, Trash2, Search, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Division {
  id: string;
  name: string;
  classId: string;
  divisionId?: string;
}

interface Class {
  id: string;
  classId?: string;
  name: string;
  year: string;
  divisions: Division[];
}

interface ClassManagementProps {
  classList: Class[];
  onAddClass: (cls: Omit<Class, 'id' | 'divisions'>) => void;
  onUpdateClass: (id: string, cls: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
  onAddDivision: (classId: string, divisionName: string) => void;
  onDeleteDivision: (classId: string, divisionId: string) => void;
}

export const ClassManagement = ({
  classList,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddDivision,
  onDeleteDivision
}: ClassManagementProps) => {
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [addingDivisionToClass, setAddingDivisionToClass] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newClass, setNewClass] = useState({
    name: "",
    year: ""
  });
  const [newDivisionName, setNewDivisionName] = useState("");
  const [previewClassId, setPreviewClassId] = useState("");

  // Generate class ID for preview
  const generateClassId = (name: string, year: string) => {
    if (!name || !year) return "";
    const namePrefix = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    return `CLS_${namePrefix}_${year}`;
  };

  // Update preview ID when form changes
  useEffect(() => {
    const id = generateClassId(newClass.name, newClass.year);
    setPreviewClassId(id);
  }, [newClass.name, newClass.year]);

  const generateDivisionId = (className: string, divisionName: string) => {
    const classPrefix = className.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const divPrefix = divisionName.replace(/\s+/g, '').toUpperCase();
    const currentYear = new Date().getFullYear();
    return `DIV_${classPrefix}${divPrefix}_${currentYear}`;
  };

  const handleAddClass = () => {
    if (newClass.name && newClass.year) {
      onAddClass(newClass);
      setNewClass({ name: "", year: "" });
      setIsAddingClass(false);
      setPreviewClassId("");
    }
  };

  const handleAddDivision = (classId: string) => {
    if (newDivisionName.trim()) {
      onAddDivision(classId, newDivisionName.trim());
      setNewDivisionName("");
      setAddingDivisionToClass(null);
    }
  };

  const filteredClasses = classList.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Class Management</h1>
        <Button
          onClick={() => setIsAddingClass(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Class Form */}
      {isAddingClass && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-800">Add New Class</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                placeholder="e.g., First Year, Second Year, BTech"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year *
              </label>
              <input
                type="text"
                value={newClass.year}
                onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
                placeholder="e.g., 2024-25, 2025-26"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Class ID Preview */}
            {previewClassId && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      ✓ Class ID Preview
                    </p>
                    <p className="text-xs text-green-600">
                      This ID will be assigned to your class
                    </p>
                  </div>
                </div>
                <div className="bg-white border rounded-md px-3 py-2">
                  <p className="font-mono text-sm font-bold text-gray-800">
                    {previewClassId}
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
              onClick={handleAddClass}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newClass.name || !newClass.year}
            >
              Add Class
            </Button>
            <Button
              onClick={() => {
                setIsAddingClass(false);
                setNewClass({ name: "", year: "" });
                setPreviewClassId("");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Class List */}
      <div className="space-y-3">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No classes found</p>
            {searchTerm && (
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your search terms
              </p>
            )}
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Class Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingClassId === cls.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={cls.name}
                        onChange={(e) => onUpdateClass(cls.id, { name: e.target.value })}
                        className="w-full text-lg font-semibold p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={cls.year}
                        onChange={(e) => onUpdateClass(cls.id, { year: e.target.value })}
                        className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{cls.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{cls.divisions.length} divisions</span>
                        </div>
                      </div>
                      
                      {/* Display Class ID with Lock Icon */}
                      {cls.classId && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Lock className="w-3 h-3" />
                            <span>Permanent Class ID</span>
                          </div>
                          <p className="font-mono text-sm font-bold text-gray-800">
                            {cls.classId}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingClassId === cls.id ? (
                    <>
                      <Button
                        onClick={() => setEditingClassId(null)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingClassId(null)}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditingClassId(cls.id)}
                        size="sm"
                        variant="outline"
                        className="p-2"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm('⚠️ WARNING: This action is IRREVERSIBLE!\n\nDeleting this class will permanently remove:\n- All class data\n- All divisions\n- All associated records\n\nThis cannot be undone. Are you absolutely sure?')) {
                            onDeleteClass(cls.id);
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Divisions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Divisions</h4>
                  <Button
                    onClick={() => setAddingDivisionToClass(cls.id)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Division
                  </Button>
                </div>

                {addingDivisionToClass === cls.id && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newDivisionName}
                        onChange={(e) => setNewDivisionName(e.target.value)}
                        placeholder="Division name (e.g., A, B, C)"
                        className="flex-1 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddDivision(cls.id);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleAddDivision(cls.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newDivisionName.trim()}
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => {
                          setAddingDivisionToClass(null);
                          setNewDivisionName("");
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                    
                    {/* Division ID Preview */}
                    {newDivisionName.trim() && (
                      <div className="p-2 bg-blue-50 rounded-md border">
                        <p className="text-xs text-blue-600 mb-1">Division ID Preview:</p>
                        <p className="font-mono text-sm font-bold text-blue-800">
                          {generateDivisionId(cls.name, newDivisionName.trim())}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {cls.divisions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {cls.divisions.map((division) => (
                      <div
                        key={division.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-800">
                            Division {division.name}
                          </span>
                          {division.divisionId && (
                            <div className="mt-1">
                              <p className="font-mono text-xs text-gray-600">
                                ID: {division.divisionId}
                              </p>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            if (confirm('⚠️ WARNING: This action is IRREVERSIBLE!\n\nDeleting this division will permanently remove all associated data.\n\nThis cannot be undone. Continue?')) {
                              onDeleteDivision(cls.id, division.id);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No divisions added yet</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
