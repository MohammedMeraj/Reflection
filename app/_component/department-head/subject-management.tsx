"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpenCheck, Calendar, Clock, Edit3, Trash2, Search, Check, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SmoothScrollContainer } from "@/components/ui/smooth-scroll-container";
import { SubjectManagementSkeleton } from "@/components/ui/skeleton";

interface Subject {
  _id: string;
  subjectId: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  isActive: boolean;
  createdAt: number;
}

export const SubjectManagement = () => {
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    credits: 1,
  });
  const [editSubject, setEditSubject] = useState({
    name: "",
    code: "",
    credits: 1,
  });
  const [previewSubjectId, setPreviewSubjectId] = useState("");

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{id: string, name: string} | null>(null);

  // Convex queries and mutations
  const subjects = useQuery(api.subjects.getAllSubjects, {});
  const createSubjectMutation = useMutation(api.subjects.createSubject);
  const updateSubjectMutation = useMutation(api.subjects.updateSubject);
  const deleteSubjectMutation = useMutation(api.subjects.deleteSubject);

  // Generate subject ID for preview
  const generateSubjectId = (name: string, code: string) => {
    if (!name || !code) return "";
    const namePrefix = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const codePrefix = code.replace(/\s+/g, '').toUpperCase();
    return `SUB_${codePrefix}_${namePrefix}`;
  };

  // Update preview ID when form changes
  useEffect(() => {
    const id = generateSubjectId(newSubject.name, newSubject.code);
    setPreviewSubjectId(id);
  }, [newSubject.name, newSubject.code]);

  // Show skeleton loading
  const isLoading = subjects === undefined;
  if (isLoading) {
    return <SubjectManagementSkeleton />;
  }

  const handleAddSubject = async () => {
    if (newSubject.name && newSubject.code) {
      try {
        await createSubjectMutation({
          name: newSubject.name,
          code: newSubject.code,
          credits: newSubject.credits,
          department: "Computer Science & Engineering", // Auto-selected from department head
        });
        
        setNewSubject({ name: "", code: "", credits: 1 });
        setIsAddingSubject(false);
        setPreviewSubjectId("");
      } catch (error) {
        console.error("Error creating subject:", error);
      }
    }
  };

  const handleEditSubject = async (subjectId: string) => {
    try {
      await updateSubjectMutation({
        id: subjectId as Id<"subjects">,
        name: editSubject.name,
        code: editSubject.code,
        credits: editSubject.credits,
      });
      
      setEditingSubjectId(null);
      setEditSubject({ name: "", code: "", credits: 1 });
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const openDeleteDialog = (id: string, name: string) => {
    setSubjectToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubjectMutation({ id: subjectToDelete.id as Id<"subjects"> });
        setIsDeleteDialogOpen(false);
        setSubjectToDelete(null);
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  const cancelDeleteSubject = () => {
    setIsDeleteDialogOpen(false);
    setSubjectToDelete(null);
  };

  const startEdit = (subject: Subject) => {
    setEditingSubjectId(subject._id);
    setEditSubject({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
    });
  };

  const cancelEdit = () => {
    setEditingSubjectId(null);
    setEditSubject({ name: "", code: "", credits: 1 });
  };

  const filteredSubjects = subjects!.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Subject Management</h1>
            <Button
              onClick={() => setIsAddingSubject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Subject
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <SmoothScrollContainer className="p-4 max-w-md mx-auto space-y-4">
        {/* Add Subject Form */}
        {isAddingSubject && (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Add New Subject</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g., Data Structures, Database Management"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., CS101, DBMS102"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <select
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(credit => (
                    <option key={credit} value={credit}>{credit}</option>
                  ))}
                </select>
              </div>

              {/* Preview Subject ID */}
              {previewSubjectId && (
                <div className="p-2 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Preview ID:</span> {previewSubjectId}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleAddSubject}
                disabled={!newSubject.name || !newSubject.code}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                <Check className="w-4 h-4 mr-1" />
                Add Subject
              </Button>
              <Button
                onClick={() => {
                  setIsAddingSubject(false);
                  setNewSubject({ name: "", code: "", credits: 1 });
                  setPreviewSubjectId("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first subject"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddingSubject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Subject
              </Button>
            )}
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <div key={subject._id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingSubjectId === subject._id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={editSubject.name}
                      onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      value={editSubject.code}
                      onChange={(e) => setEditSubject({ ...editSubject, code: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits
                    </label>
                    <select
                      value={editSubject.credits}
                      onChange={(e) => setEditSubject({ ...editSubject, credits: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(credit => (
                        <option key={credit} value={credit}>{credit}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEditSubject(subject._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => startEdit(subject)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(subject._id, subject.name)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Code:</span>
                      <p className="font-medium text-gray-800">{subject.code}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Credits:</span>
                      <p className="font-medium text-gray-800">{subject.credits}</p>
                    </div>
                  </div>

                  <div className="p-2 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">Subject ID</span>
                    </div>
                    <p className="text-sm font-mono text-blue-800">{subject.subjectId}</p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </SmoothScrollContainer>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && subjectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete Subject</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete "{subjectToDelete.name}"? 
                  <span className="text-red-600 font-medium"> This action is irreversible.</span>
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={confirmDeleteSubject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Subject
              </Button>
              <Button
                onClick={cancelDeleteSubject}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
