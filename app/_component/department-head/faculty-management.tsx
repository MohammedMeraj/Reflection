"use client";

import { useState } from "react";
import { Plus, User, Mail, BookOpen, Edit3, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Faculty {
  id: string;
  name: string;
  email: string;
  assignedClasses: string[];
}

interface Class {
  id: string;
  name: string;
  year: string;
}

interface FacultyManagementProps {
  facultyList: Faculty[];
  classList: Class[];
  onAddFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  onUpdateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  onDeleteFaculty: (id: string) => void;
}

export const FacultyManagement = ({
  facultyList,
  classList,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty
}: FacultyManagementProps) => {
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    assignedClasses: [] as string[]
  });

  const generateFacultyId = (name: string, email: string) => {
    const namePrefix = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `FAC_${namePrefix}${emailPrefix}_${timestamp}`;
  };

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email) {
      onAddFaculty(newFaculty);
      setNewFaculty({ name: "", email: "", assignedClasses: [] });
      setIsAddingFaculty(false);
    }
  };

  const handleClassAssignment = (facultyId: string, classId: string, isAssigned: boolean) => {
    const faculty = facultyList.find(f => f.id === facultyId);
    if (faculty) {
      const updatedClasses = isAssigned
        ? faculty.assignedClasses.filter(id => id !== classId)
        : [...faculty.assignedClasses, classId];
      onUpdateFaculty(facultyId, { assignedClasses: updatedClasses });
    }
  };

  const filteredFaculty = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Faculty Management</h1>
        <Button
          onClick={() => setIsAddingFaculty(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Faculty
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Faculty Form */}
      {isAddingFaculty && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-800">Add New Faculty</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty Name *
              </label>
              <input
                type="text"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                placeholder="Enter faculty name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty Email *
              </label>
              <input
                type="email"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                placeholder="Enter faculty email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Classes
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {classList.map((cls) => (
                  <label key={cls.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newFaculty.assignedClasses.includes(cls.id)}
                      onChange={(e) => {
                        const updatedClasses = e.target.checked
                          ? [...newFaculty.assignedClasses, cls.id]
                          : newFaculty.assignedClasses.filter(id => id !== cls.id);
                        setNewFaculty({ ...newFaculty, assignedClasses: updatedClasses });
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{cls.name} ({cls.year})</span>
                  </label>
                ))}
              </div>
            </div>

            {newFaculty.name && newFaculty.email && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">Auto-generated Faculty ID:</p>
                <p className="text-sm text-blue-700 font-mono">
                  {generateFacultyId(newFaculty.name, newFaculty.email)}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleAddFaculty}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newFaculty.name || !newFaculty.email}
            >
              Add Faculty
            </Button>
            <Button
              onClick={() => {
                setIsAddingFaculty(false);
                setNewFaculty({ name: "", email: "", assignedClasses: [] });
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Faculty List */}
      <div className="space-y-3">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No faculty found matching your search" : "No faculty added yet"}
          </div>
        ) : (
          filteredFaculty.map((faculty) => (
            <div key={faculty.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{faculty.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{faculty.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">ID: {faculty.id}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => setEditingFacultyId(editingFacultyId === faculty.id ? null : faculty.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeleteFaculty(faculty.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Assigned Classes ({faculty.assignedClasses.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {faculty.assignedClasses.length === 0 ? (
                    <span className="text-xs text-gray-500 italic">No classes assigned</span>
                  ) : (
                    faculty.assignedClasses.map((classId) => {
                      const cls = classList.find(c => c.id === classId);
                      return cls ? (
                        <span
                          key={classId}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {cls.name}
                        </span>
                      ) : null;
                    })
                  )}
                </div>
              </div>

              {/* Class Assignment (when editing) */}
              {editingFacultyId === faculty.id && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Modify Class Assignments</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {classList.map((cls) => {
                      const isAssigned = faculty.assignedClasses.includes(cls.id);
                      return (
                        <label key={cls.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => handleClassAssignment(faculty.id, cls.id, isAssigned)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{cls.name} ({cls.year})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
