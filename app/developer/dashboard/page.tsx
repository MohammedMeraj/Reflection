"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Users, 
  Building, 
  Shield, 
  ShieldOff, 
  Edit3, 
  Trash2, 
  Key, 
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Code,
  LogOut,
  Settings,
  Database
} from "lucide-react";

interface SuperAdmin {
  _id: string;
  name: string;
  email: string;
  institute: string;
  instituteId: string;
  accessActive: boolean;
  secretKey: string;
  _creationTime: number;
}

export default function DeveloperDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const auth = localStorage.getItem("developerAuth");
        if (auth === "true") {
          setIsAuthenticated(true);
        } else {
          router.push("/developer");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("developerAuth");
      localStorage.removeItem("developerId");
      localStorage.removeItem("developerData");
    }
    router.push("/developer");
  };

  // Dashboard states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);
  const [selectedSuperAdmin, setSelectedSuperAdmin] = useState<SuperAdmin | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institute: "",
    accessActive: true,
  });

  // Real Convex data and mutations
  const [superAdminsData, setSuperAdminsData] = useState<SuperAdmin[]>([]);
  const [statsData, setStatsData] = useState({
    totalSuperAdmins: 0,
    activeSuperAdmins: 0,
    inactiveSuperAdmins: 0,
    totalInstitutes: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch data from Convex
  const fetchSuperAdmins = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:getAllSuperAdmins',
          args: {}
        })
      });
      const result = await response.json();
      if (result.value) {
        setSuperAdminsData(result.value);
      }
    } catch (error) {
      console.error("Error fetching super admins:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:getSuperAdminStats',
          args: {}
        })
      });
      const result = await response.json();
      if (result.value) {
        setStatsData(result.value);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setDataLoading(true);
        await Promise.all([fetchSuperAdmins(), fetchStats()]);
        setDataLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated]);

  // Real mutations
  const createSuperAdminMutation = async (data: { name: string; email: string; institute: string; accessActive: boolean }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:createSuperAdmin',
          args: data
        })
      });
      const result = await response.json();
      if (result.value) {
        await fetchSuperAdmins();
        await fetchStats();
        setShowAddModal(false);
        setFormData({ name: "", email: "", institute: "", accessActive: true });
        alert("Super admin created successfully!");
      }
    } catch (error) {
      console.error("Error creating super admin:", error);
      alert("Failed to create super admin. Please check if email already exists.");
    }
  };

  const updateSuperAdminMutation = async (id: string, data: { name: string; email: string; institute: string; accessActive: boolean }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:updateSuperAdmin',
          args: { id, ...data }
        })
      });
      const result = await response.json();
      if (result.value) {
        await fetchSuperAdmins();
        await fetchStats();
        setShowEditModal(false);
        setSelectedSuperAdmin(null);
        setFormData({ name: "", email: "", institute: "", accessActive: true });
        alert("Super admin updated successfully!");
      }
    } catch (error) {
      console.error("Error updating super admin:", error);
      alert("Failed to update super admin. Please check if email already exists.");
    }
  };

  const deleteSuperAdminMutation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this super admin? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:deleteSuperAdmin',
          args: { id }
        })
      });
      const result = await response.json();
      if (result.value) {
        await fetchSuperAdmins();
        await fetchStats();
        alert("Super admin deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting super admin:", error);
      alert("Failed to delete super admin");
    }
  };

  const toggleAccessMutation = async (id: string, accessActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:toggleSuperAdminAccess',
          args: { id, accessActive: !accessActive }
        })
      });
      const result = await response.json();
      if (result.value) {
        await fetchSuperAdmins();
        await fetchStats();
        alert(`Super admin access ${!accessActive ? 'enabled' : 'disabled'} successfully!`);
      }
    } catch (error) {
      console.error("Error toggling access:", error);
      alert("Failed to toggle access");
    }
  };

  const regenerateKeyMutation = async (id: string) => {
    if (!confirm("Are you sure you want to regenerate the secret key? This will invalidate the current key.")) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'developer:regenerateSecretKey',
          args: { id }
        })
      });
      const result = await response.json();
      if (result.value) {
        await fetchSuperAdmins();
        alert("Secret key regenerated successfully!");
      }
    } catch (error) {
      console.error("Error regenerating key:", error);
      alert("Failed to regenerate key");
    }
  };

  // Action handlers
  const handleRegenerateKey = (id: string) => {
    regenerateKeyMutation(id);
  };

  const handleDelete = (id: string) => {
    deleteSuperAdminMutation(id);
  };

  const handleToggleAccess = (id: string, currentStatus: boolean) => {
    toggleAccessMutation(id, currentStatus);
  };

  const openEditModal = (admin: SuperAdmin) => {
    setSelectedSuperAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      institute: admin.institute,
      accessActive: admin.accessActive,
    });
    setShowEditModal(true);
  };

  const copyToClipboard = async (text: string, adminId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(adminId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      institute: "",
      accessActive: true,
    });
  };

  // Filter super admins based on search
  const filteredSuperAdmins = superAdminsData?.filter((admin: SuperAdmin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.institute.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSuperAdminMutation(formData);
    } catch (error) {
      console.error("Error creating super admin:", error);
      alert("Error creating super admin: " + (error as Error).message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuperAdmin) return;

    try {
      await updateSuperAdminMutation(selectedSuperAdmin._id, formData);
    } catch (error) {
      console.error("Error updating super admin:", error);
      alert("Error updating super admin: " + (error as Error).message);
    }
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying developer access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Show loading skeleton for data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Developer Portal</h1>
                  <p className="text-xs text-slate-500">System Administration</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="h-16 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Developer Portal</h1>
                <p className="text-xs text-slate-500">System Administration</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
                  <Users className="w-4 h-4" />
                  Super Admins
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  <Database className="w-4 h-4" />
                  Database
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </nav>

              <div className="h-6 w-px bg-slate-200"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Super Admin Management</h1>
              <p className="text-slate-600 mt-1">Manage system administrators and their access permissions</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Super Admin
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{statsData.totalSuperAdmins}</p>
                  <p className="text-sm text-slate-600">Total Admins</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{statsData.activeSuperAdmins}</p>
                  <p className="text-sm text-slate-600">Active Admins</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ShieldOff className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{statsData.inactiveSuperAdmins}</p>
                  <p className="text-sm text-slate-600">Inactive Admins</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{statsData.totalInstitutes}</p>
                  <p className="text-sm text-slate-600">Institutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Super Admins Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-slate-900">Admin Info</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-900">Institute</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-900">Status</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-900">Secret Key</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-900">Created</th>
                    <th className="text-right px-6 py-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSuperAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{admin.name}</p>
                          <p className="text-sm text-slate-600">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{admin.institute}</p>
                          <p className="text-xs text-slate-500">{admin.instituteId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAccess(admin._id, admin.accessActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              admin.accessActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {admin.accessActive ? (
                              <>
                                <Shield className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <ShieldOff className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                            <code className="text-xs font-mono text-slate-700">
                              {showSecretKey === admin._id 
                                ? admin.secretKey 
                                : "*".repeat(admin.secretKey.length)
                              }
                            </code>
                            <button
                              onClick={() => setShowSecretKey(
                                showSecretKey === admin._id ? null : admin._id
                              )}
                              className="text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              {showSecretKey === admin._id ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(admin.secretKey, admin._id)}
                              className="text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              {copiedKey === admin._id ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(admin._creationTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRegenerateKey(admin._id)}
                            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Regenerate Secret Key"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Admin"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSuperAdmins.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No super admins found</p>
                {searchTerm && (
                  <p className="text-sm text-slate-500 mt-1">
                    Try adjusting your search criteria
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Super Admin</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Institute</label>
                    <input
                      type="text"
                      value={formData.institute}
                      onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="accessActive"
                      checked={formData.accessActive}
                      onChange={(e) => setFormData({ ...formData, accessActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="accessActive" className="text-sm font-medium text-slate-700">
                      Grant access immediately
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Add Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedSuperAdmin && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Super Admin</h2>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Institute</label>
                    <input
                      type="text"
                      value={formData.institute}
                      onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="editAccessActive"
                      checked={formData.accessActive}
                      onChange={(e) => setFormData({ ...formData, accessActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="editAccessActive" className="text-sm font-medium text-slate-700">
                      Access active
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedSuperAdmin(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Update Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}