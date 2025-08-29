"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Building2, 
  UserPlus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Shield,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Department {
  _id: Id<"departments">;
  name: string;
  code: string;
  description?: string;
  establishedYear?: number;
  isActive: boolean;
  createdAt: number;
}

interface DepartmentHead {
  _id: Id<"departmentHeads">;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  uniqueId: string;
  managementEnabled: boolean;
  isActive: boolean;
  createdAt: number;
  qualification?: string;
  experience?: number;
  department: Department | null;
}

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<"departments" | "heads">("heads");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddDepartmentHead, setShowAddDepartmentHead] = useState(false);
  const [editingHead, setEditingHead] = useState<DepartmentHead | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteDepartmentConfirm, setDeleteDepartmentConfirm] = useState<string | null>(null);

  // Convex queries
  const departmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);
  const departments = useQuery(api.superAdmin.getAllDepartments);
  const searchResults = useQuery(api.superAdmin.searchDepartmentHeads, 
    searchTerm.length > 0 ? { searchTerm } : "skip"
  );

  // Convex mutations
  const toggleManagement = useMutation(api.superAdmin.toggleDepartmentHeadManagement);
  const deleteDepartmentHead = useMutation(api.superAdmin.deleteDepartmentHead);
  const deleteDepartment = useMutation(api.superAdmin.deleteDepartment);
  const addDepartment = useMutation(api.superAdmin.addDepartment);
  const addDepartmentHead = useMutation(api.superAdmin.addDepartmentHead);

  // Helper function to generate unique department ID
  const generateUniqueDepartmentId = async (baseName: string): Promise<string> => {
    const generateId = (name: string, suffix: number = 0) => {
      const baseId = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      return suffix > 0 ? `${baseId}_${suffix}` : baseId;
    };

    let suffix = 0;
    let candidateId = generateId(baseName);
    
    // Check if ID exists in database (check against department codes)
    while (departments?.some(dept => dept.code === candidateId.toUpperCase())) {
      suffix++;
      candidateId = generateId(baseName, suffix);
    }
    
    return candidateId.toUpperCase();
  };

  // Helper function to generate unique department head ID
  const generateUniqueDepartmentHeadId = async (baseName: string): Promise<string> => {
    const generateId = (name: string, suffix: number = 0) => {
      const baseId = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      return suffix > 0 ? `${baseId}_${suffix}` : baseId;
    };

    let suffix = 0;
    let candidateId = generateId(baseName);
    
    // Check if ID exists in database (check against employee IDs)
    while (departmentHeads?.some(head => head.employeeId === candidateId.toUpperCase())) {
      suffix++;
      candidateId = generateId(baseName, suffix);
    }
    
    return candidateId.toUpperCase();
  };

  // Wrapper function for adding department with unique ID
  const handleAddDepartment = async (data: any) => {
    try {
      const uniqueCode = await generateUniqueDepartmentId(data.name);
      await addDepartment({
        ...data,
        code: uniqueCode, // Use generated code
      });
    } catch (error) {
      console.error("Failed to add department:", error);
      throw error;
    }
  };

  // Wrapper function for adding department head with unique ID
  const handleAddDepartmentHead = async (data: any) => {
    try {
      const uniqueEmployeeId = await generateUniqueDepartmentHeadId(data.name);
      await addDepartmentHead({
        ...data,
        employeeId: uniqueEmployeeId, // Use generated employee ID
      });
    } catch (error) {
      console.error("Failed to add department head:", error);
      throw error;
    }
  };
  const updateDepartmentHead = useMutation(api.superAdmin.updateDepartmentHead);
  const updateDepartment = useMutation(api.superAdmin.updateDepartment);

  const displayedHeads = searchTerm.length > 0 ? searchResults : departmentHeads;

  const handleToggleManagement = async (headId: Id<"departmentHeads">) => {
    try {
      await toggleManagement({ id: headId });
    } catch (error) {
      console.error("Failed to toggle management:", error);
    }
  };

  const handleDeleteHead = async (headId: Id<"departmentHeads">) => {
    try {
      await deleteDepartmentHead({ id: headId });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete department head:", error);
    }
  };

  const handleDeleteDepartment = async (deptId: Id<"departments">) => {
    try {
      await deleteDepartment({ id: deptId });
      setDeleteDepartmentConfirm(null);
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/superAdmin" 
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Management Center</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage departments and department heads</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("heads")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "heads"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Department Heads
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "departments"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Departments
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "heads" && (
          <DepartmentHeadsTab
            departmentHeads={displayedHeads}
            departments={departments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleManagement={handleToggleManagement}
            onEdit={setEditingHead}
            onDelete={(id) => setDeleteConfirm(id)}
            onShowAdd={() => setShowAddDepartmentHead(true)}
          />
        )}

        {activeTab === "departments" && (
          <DepartmentsTab
            departments={departments}
            onShowAdd={() => setShowAddDepartment(true)}
            onEdit={setEditingDepartment}
            onDelete={(id) => setDeleteDepartmentConfirm(id)}
          />
        )}
      </div>

      {/* Modals */}
      {showAddDepartment && (
        <AddDepartmentModal
          onClose={() => setShowAddDepartment(false)}
          onAdd={handleAddDepartment}
        />
      )}

      {showAddDepartmentHead && (
        <AddDepartmentHeadModal
          departments={departments}
          onClose={() => setShowAddDepartmentHead(false)}
          onAdd={handleAddDepartmentHead}
        />
      )}

      {editingHead && (
        <EditDepartmentHeadModal
          departmentHead={editingHead}
          departments={departments}
          onClose={() => setEditingHead(null)}
          onUpdate={updateDepartmentHead}
        />
      )}

      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          onClose={() => setEditingDepartment(null)}
          onUpdate={updateDepartment}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          title="Delete Department Head"
          message="Once deleted, all data associated with this department head will be permanently removed from the system and cannot be recovered."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteHead(deleteConfirm as Id<"departmentHeads">)}
        />
      )}

      {deleteDepartmentConfirm && (
        <DeleteConfirmModal
          title="Delete Department"
          message="Once deleted, this department and all associated data will be permanently removed from the system and cannot be recovered."
          onClose={() => setDeleteDepartmentConfirm(null)}
          onConfirm={() => handleDeleteDepartment(deleteDepartmentConfirm as Id<"departments">)}
        />
      )}
    </div>
  );
}

// Department Heads Tab Component
function DepartmentHeadsTab({
  departmentHeads,
  departments,
  searchTerm,
  setSearchTerm,
  onToggleManagement,
  onEdit,
  onDelete,
  onShowAdd,
}: {
  departmentHeads: DepartmentHead[] | undefined;
  departments: Department[] | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleManagement: (id: Id<"departmentHeads">) => void;
  onEdit: (head: DepartmentHead) => void;
  onDelete: (id: string) => void;
  onShowAdd: () => void;
}) {
  return (
    <div>
      {/* Actions Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search department heads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={onShowAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Department Head</span>
            <span className="sm:hidden">Add Head</span>
          </button>
        </div>
      </div>

      {/* Department Heads List */}
      <div className="space-y-4">
        {departmentHeads?.map((head) => (
          <div key={head._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{head.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{head.department?.name || "No Department"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{head.email}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">{head.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-gray-500 flex-shrink-0">ID:</span>
                    <span className="text-xs sm:text-sm font-mono text-gray-700 truncate">{head.uniqueId}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">
                      {new Date(head.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    head.managementEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {head.managementEnabled ? 'Management Enabled' : 'Management Disabled'}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    head.isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {head.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end lg:justify-start lg:ml-4 flex-shrink-0">
                {/* Toggle Management */}
                <button
                  onClick={() => onToggleManagement(head._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    head.managementEnabled 
                      ? 'bg-green-100 hover:bg-green-200' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={head.managementEnabled ? 'Disable Management' : 'Enable Management'}
                >
                  {head.managementEnabled ? (
                    <ToggleRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => onEdit(head)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                  title="Edit Department Head"
                >
                  <Edit className="h-5 w-5 text-blue-600" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDelete(head._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                  title="Delete Department Head"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {departmentHeads?.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Department Heads</h3>
            <p className="text-gray-600 mb-4">Add your first department head to get started</p>
            <button
              onClick={onShowAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add Department Head
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Departments Tab Component
function DepartmentsTab({
  departments,
  onShowAdd,
  onEdit,
  onDelete,
}: {
  departments: Department[] | undefined;
  onShowAdd: () => void;
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}) {
  // Get all department heads to check which departments have heads assigned
  const allDepartmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);

  const getDepartmentHeadForDept = (deptId: string) => {
    return allDepartmentHeads?.find(head => head.department?._id === deptId);
  };
  return (
    <div>
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Departments</h2>
        <button
          onClick={onShowAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Add Department</span>
          <span className="sm:hidden">Add Dept</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((dept) => {
          const departmentHead = getDepartmentHeadForDept(dept._id);
          
          return (
            <div key={dept._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{dept.name}</h3>
                    <p className="text-sm text-gray-600 truncate">Code: {dept.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dept.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {dept.description && (
                <p className="text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis line-clamp-2" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const
                }}>{dept.description}</p>
              )}

              {dept.establishedYear && (
                <p className="text-xs text-gray-500 mb-4">
                  Established: {dept.establishedYear}
                </p>
              )}

              {/* Department Head Status */}
              {departmentHead ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-800">Department Head Assigned</p>
                  </div>
                  <p className="text-xs text-green-700 mt-1 truncate">
                    {departmentHead.name}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm font-medium text-yellow-800">No Department Head</p>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Ready for assignment
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onEdit(dept)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                  title="Edit Department"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => onDelete(dept._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                  title="Delete Department"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {departments?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments</h3>
          <p className="text-gray-600 mb-4">Create your first department to get started</p>
          <button
            onClick={onShowAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Add Department
          </button>
        </div>
      )}
    </div>
  );
}

// Add Department Modal
function AddDepartmentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: any;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    establishedYear: new Date().getFullYear(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewId, setPreviewId] = useState("");

  // Generate preview ID when name changes
  useEffect(() => {
    if (formData.name.trim()) {
      const generateId = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .toUpperCase();
      };
      setPreviewId(generateId(formData.name));
    } else {
      setPreviewId("");
    }
  }, [formData.name]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAdd({
        name: formData.name,
        description: formData.description || undefined,
        establishedYear: formData.establishedYear || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-[9999] overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-lg mx-auto p-6 my-8 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Department</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Computer Science & Engineering"
            />
          </div>

          {/* Auto-generated Department ID Preview */}
          {previewId && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-800">
                    ✨ Unique Department ID Available
                  </p>
                  <p className="text-xs text-purple-600">
                    This code will be permanently assigned to the department
                  </p>
                </div>
              </div>
              <div className="bg-white border border-purple-300 rounded-md px-4 py-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg text-purple-900 font-bold tracking-wider">
                    {previewId}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">AVAILABLE</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Auto-generated and verified for uniqueness</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of the department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Department Head Modal
function AddDepartmentHeadModal({
  departments,
  onClose,
  onAdd,
}: {
  departments: Department[] | undefined;
  onClose: () => void;
  onAdd: any;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    managementEnabled: false,
    qualification: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewEmployeeId, setPreviewEmployeeId] = useState("");

  // Generate preview Employee ID when name changes
  useEffect(() => {
    if (formData.name.trim()) {
      const generateId = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .toUpperCase();
      };
      setPreviewEmployeeId(generateId(formData.name));
    } else {
      setPreviewEmployeeId("");
    }
  }, [formData.name]);

  // Get all department heads to check which departments are already assigned
  const allDepartmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);

  // Filter out departments that already have a department head assigned
  const availableDepartments = departments?.filter(dept => {
    const isAssigned = allDepartmentHeads?.some(head => head.department?._id === dept._id);
    return dept.isActive && !isAssigned;
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAdd({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId as Id<"departments">,
        managementEnabled: formData.managementEnabled,
        qualification: formData.qualification || undefined,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add department head:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-[9999] overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl mx-auto p-6 my-8 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Department Head</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter full name"
              />
            </div>

          {/* Auto-generated Employee ID Preview */}
          {previewEmployeeId && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-800">
                    ✨ Unique Department Head ID Available
                  </p>
                  <p className="text-xs text-purple-600">
                    This ID will be permanently assigned and cannot be changed
                  </p>
                </div>
              </div>
              <div className="bg-white border border-purple-300 rounded-md px-4 py-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg text-purple-900 font-bold tracking-wider">
                    {previewEmployeeId}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">AVAILABLE</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Auto-generated and verified for uniqueness</span>
              </div>
            </div>
          )}            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                {availableDepartments?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {availableDepartments?.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ All active departments already have department heads assigned. Please create a new department first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Years of experience"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Ph.D. in Computer Science"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="managementEnabled"
              checked={formData.managementEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, managementEnabled: e.target.checked }))}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="managementEnabled" className="text-sm font-medium text-gray-700">
              Enable department management access
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Department Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Department Modal
function EditDepartmentModal({
  department,
  onClose,
  onUpdate,
}: {
  department: Department;
  onClose: () => void;
  onUpdate: any;
}) {
  const [formData, setFormData] = useState({
    name: department.name,
    code: department.code,
    description: department.description || "",
    establishedYear: department.establishedYear || new Date().getFullYear(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate({
        id: department._id,
        name: formData.name,
        description: formData.description || undefined,
        establishedYear: formData.establishedYear || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-[9999] overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-lg mx-auto p-6 my-8 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Department</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Computer Science & Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Code (Permanent)
            </label>
            <div className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg text-gray-800 cursor-not-allowed font-mono text-lg font-bold tracking-wider shadow-inner">
              {formData.code}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Department code cannot be changed once created for system consistency</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of the department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Department Head Modal (similar to Add but with existing data)
function EditDepartmentHeadModal({
  departmentHead,
  departments,
  onClose,
  onUpdate,
}: {
  departmentHead: DepartmentHead;
  departments: Department[] | undefined;
  onClose: () => void;
  onUpdate: any;
}) {
  const [formData, setFormData] = useState({
    name: departmentHead.name,
    email: departmentHead.email,
    phone: departmentHead.phone,
    employeeId: departmentHead.employeeId,
    departmentId: departmentHead.department?._id || "",
    managementEnabled: departmentHead.managementEnabled,
    qualification: departmentHead.qualification || "",
    experience: departmentHead.experience?.toString() || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all department heads to check which departments are already assigned
  const allDepartmentHeads = useQuery(api.superAdmin.getAllDepartmentHeads);

  // Filter out departments that already have a department head assigned, 
  // but include the current department head's department
  const availableDepartments = departments?.filter(dept => {
    const isAssigned = allDepartmentHeads?.some(head => 
      head.department?._id === dept._id && head._id !== departmentHead._id
    );
    return dept.isActive && !isAssigned;
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate({
        id: departmentHead._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId as Id<"departments">,
        managementEnabled: formData.managementEnabled,
        qualification: formData.qualification || undefined,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update department head:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-[9999] overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl mx-auto p-6 my-8 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Department Head</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID (Permanent)
              </label>
              <div className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg text-gray-800 cursor-not-allowed font-mono text-lg font-bold tracking-wider shadow-inner">
                {formData.employeeId}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Employee ID cannot be changed once created for security and consistency</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                {availableDepartments?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {availableDepartments?.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ All active departments already have department heads assigned.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="editManagementEnabled"
              checked={formData.managementEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, managementEnabled: e.target.checked }))}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="editManagementEnabled" className="text-sm font-medium text-gray-700">
              Enable department management access
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Department Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  title,
  message,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-[9999] overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 my-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-800">Warning: This is irreversible</span>
          </div>
          <p className="text-sm text-red-700">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
