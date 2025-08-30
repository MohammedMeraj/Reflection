"use client";

import { useState, useEffect } from "react";
import { Plus, User, Mail, BookOpen, Edit3, Trash2, Search, Check, Lock, Crown, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Faculty {
  id: string;
  name: string;
  email: string;
  assignedClasses: string[];
  coordinatorInfo?: {
    type: 'class' | 'division';
    name?: string;
    year?: string;
    classId?: string;
    divisionId?: string;
  };
  isClassCoordinator?: boolean;
}

interface Class {
  id: string;
  name: string;
  year: string;
  divisions?: Array<{
    id: string;
    name: string;
    classId: string;
  }>;
}

interface FacultyManagementProps {
  facultyList: Faculty[];
  classList: Class[];
  onAddFaculty: (faculty: { name: string; email: string; assignedClasses: string[]; qualification?: string }) => void;
  onUpdateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  onDeleteFaculty: (id: string) => void;
  onAssignCoordinator?: (facultyId: string, target: { type: "class" | "division"; classId?: string; divisionId?: string }) => void;
  onRemoveCoordinator?: (facultyId: string) => void;
}

export const FacultyManagement = ({
  facultyList,
  classList,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty,
  onAssignCoordinator,
  onRemoveCoordinator
}: FacultyManagementProps) => {
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    assignedClasses: [] as string[],
    qualification: ""
  });
  const [previewFacultyId, setPreviewFacultyId] = useState("");
  const [isUniqueId, setIsUniqueId] = useState(false);
  const [assigningCoordinatorFor, setAssigningCoordinatorFor] = useState<string | null>(null);

  // Query to check ID uniqueness
  const uniquenessCheck = useQuery(
    api.faculty.checkFacultyIdUniqueness,
    newFaculty.name && newFaculty.email ? { name: newFaculty.name, email: newFaculty.email } : "skip"
  );

  // Update preview ID when uniqueness check returns
  useEffect(() => {
    if (uniquenessCheck) {
      setPreviewFacultyId(uniquenessCheck.id);
      setIsUniqueId(uniquenessCheck.isUnique);
    }
  }, [uniquenessCheck]);

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email && isUniqueId) {
      onAddFaculty(newFaculty);
      setNewFaculty({ name: "", email: "", assignedClasses: [], qualification: "" });
      setIsAddingFaculty(false);
      setPreviewFacultyId("");
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

  const handleCoordinatorAssignment = (facultyId: string, target: { type: "class" | "division"; classId?: string; divisionId?: string }) => {
    if (onAssignCoordinator) {
      onAssignCoordinator(facultyId, target);
      setAssigningCoordinatorFor(null);
    }
  };

  const handleRemoveCoordinator = (facultyId: string) => {
    if (onRemoveCoordinator) {
      onRemoveCoordinator(facultyId);
    }
  };

  // Get available targets for coordinator assignment
  const getAvailableTargets = () => {
    const targets: Array<{ type: "class" | "division"; id: string; name: string; year: string }> = [];
    
    classList.forEach(cls => {
      // Check if class has no divisions (treat as single class)
      if (!cls.divisions || cls.divisions.length === 0) {
        // Check if class already has a coordinator
        const hasCoordinator = facultyList.some(f => 
          f.coordinatorInfo?.type === "class" && f.coordinatorInfo.classId === cls.id
        );
        if (!hasCoordinator) {
          targets.push({
            type: "class",
            id: cls.id,
            name: cls.name,
            year: cls.year
          });
        }
      } else {
        // Add divisions as targets
        cls.divisions.forEach(div => {
          const hasCoordinator = facultyList.some(f => 
            f.coordinatorInfo?.type === "division" && f.coordinatorInfo.divisionId === div.id
          );
          if (!hasCoordinator) {
            targets.push({
              type: "division",
              id: div.id,
              name: `${cls.name} - Division ${div.name}`,
              year: cls.year
            });
          }
        });
      }
    });

    return targets;
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
                Qualification
              </label>
              <input
                type="text"
                value={newFaculty.qualification}
                onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                placeholder="e.g., Ph.D in Computer Science, M.Tech"
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

            {/* Enhanced Faculty ID Preview with Uniqueness Check */}
            {previewFacultyId && (
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
                      {isUniqueId ? '✓ Unique Faculty ID Available' : '⚠ ID Being Generated...'}
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
                    {previewFacultyId}
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
              onClick={handleAddFaculty}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newFaculty.name || !newFaculty.email || !isUniqueId}
            >
              Add Faculty
            </Button>
            <Button
              onClick={() => {
                setIsAddingFaculty(false);
                setNewFaculty({ name: "", email: "", assignedClasses: [], qualification: "" });
                setPreviewFacultyId("");
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
            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No faculty found</p>
            {searchTerm && (
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your search terms
              </p>
            )}
          </div>
        ) : (
          filteredFaculty.map((faculty) => (
            <div key={faculty.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Faculty Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{faculty.name}</h3>
                    {faculty.isClassCoordinator && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                        <Crown className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">CC</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{faculty.email}</p>
                  </div>

                  {/* Display Faculty ID with Lock Icon */}
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Lock className="w-3 h-3" />
                      <span>Permanent Faculty ID</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-gray-800">
                      {faculty.id}
                    </p>
                  </div>

                  {/* Class Coordinator Info */}
                  {faculty.coordinatorInfo && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-md border border-purple-200">
                      <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
                        <Crown className="w-3 h-3" />
                        <span>Class Coordinator</span>
                      </div>
                      <p className="text-sm font-medium text-purple-800">
                        {faculty.coordinatorInfo.name}
                      </p>
                      <p className="text-xs text-purple-600">
                        {faculty.coordinatorInfo.year} • {faculty.coordinatorInfo.type === 'class' ? 'Full Class' : 'Division'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setEditingFacultyId(editingFacultyId === faculty.id ? null : faculty.id)}
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('⚠️ WARNING: This action is IRREVERSIBLE!\n\nDeleting this faculty will permanently remove:\n- All faculty data\n- Class assignments\n- Coordinator assignments\n\nThis cannot be undone. Are you absolutely sure?')) {
                        onDeleteFaculty(faculty.id);
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
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

              {/* Class Coordinator Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Class Coordinator</span>
                  </div>
                  
                  {!faculty.isClassCoordinator ? (
                    <Button
                      onClick={() => setAssigningCoordinatorFor(faculty.id)}
                      size="sm"
                      variant="outline"
                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Assign CC
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (confirm('Remove this faculty as Class Coordinator?\n\nThis will unassign them from their coordinator role.')) {
                          handleRemoveCoordinator(faculty.id);
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <UserX className="w-3 h-3 mr-1" />
                      Remove CC
                    </Button>
                  )}
                </div>

                {/* Coordinator Assignment Form */}
                {assigningCoordinatorFor === faculty.id && (
                  <div className="p-3 bg-purple-50 rounded-md space-y-3">
                    <h4 className="text-sm font-medium text-purple-800">Assign as Class Coordinator</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getAvailableTargets().map((target) => (
                        <button
                          key={target.id}
                          onClick={() => {
                            if (target.type === "class") {
                              handleCoordinatorAssignment(faculty.id, { type: "class", classId: target.id });
                            } else {
                              handleCoordinatorAssignment(faculty.id, { type: "division", divisionId: target.id });
                            }
                          }}
                          className="w-full text-left p-2 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                        >
                          <div className="text-sm font-medium text-purple-800">{target.name}</div>
                          <div className="text-xs text-purple-600">{target.year} • {target.type}</div>
                        </button>
                      ))}
                      {getAvailableTargets().length === 0 && (
                        <p className="text-sm text-purple-600 italic">No available classes or divisions for coordinator assignment</p>
                      )}
                    </div>
                    <Button
                      onClick={() => setAssigningCoordinatorFor(null)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
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
