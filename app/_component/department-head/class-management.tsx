"use client";

import { useState } from "react";
import { Plus, BookOpen, Calendar, Users, Edit3, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Division {
  id: string;
  name: string;
  classId: string;
}

interface Class {
  id: string;
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

  const handleAddClass = () => {
    if (newClass.name && newClass.year) {
      onAddClass(newClass);
      setNewClass({ name: "", year: "" });
      setIsAddingClass(false);
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

            {newClass.name && newClass.year && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">Auto-generated Class ID:</p>
                <p className="text-sm text-blue-700 font-mono">
                  {generateClassId(newClass.name, newClass.year)}
                </p>
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
            {searchTerm ? "No classes found matching your search" : "No classes added yet"}
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{cls.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{cls.year}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">ID: {cls.id}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => setEditingClassId(editingClassId === cls.id ? null : cls.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeleteClass(cls.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Divisions */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Divisions ({cls.divisions.length})
                    </span>
                  </div>
                  <Button
                    onClick={() => setAddingDivisionToClass(addingDivisionToClass === cls.id ? null : cls.id)}
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Division
                  </Button>
                </div>

                {/* Add Division Form */}
                {addingDivisionToClass === cls.id && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-md">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newDivisionName}
                        onChange={(e) => setNewDivisionName(e.target.value)}
                        placeholder="Division name (e.g., A, B, C)"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Button
                        onClick={() => handleAddDivision(cls.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                        disabled={!newDivisionName.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {newDivisionName.trim() && (
                      <div className="mt-2 p-2 bg-white rounded-md">
                        <p className="text-xs font-medium text-purple-800">Auto-generated Division ID:</p>
                        <p className="text-xs text-purple-700 font-mono">
                          {generateDivisionId(cls.name, newDivisionName)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Division List */}
                <div className="space-y-1">
                  {cls.divisions.length === 0 ? (
                    <span className="text-xs text-gray-500 italic">No divisions created</span>
                  ) : (
                    cls.divisions.map((division) => (
                      <div
                        key={division.id}
                        className="flex items-center justify-between p-2 bg-purple-50 rounded-md"
                      >
                        <div>
                          <span className="text-sm font-medium text-purple-800">
                            Division {division.name}
                          </span>
                          <p className="text-xs text-purple-600 font-mono">ID: {division.id}</p>
                        </div>
                        <Button
                          onClick={() => onDeleteDivision(cls.id, division.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
