"use client";

import { useState } from "react";
import { Users, UserCheck, UserPlus, Shield, Settings, Search, Filter, Edit, Trash2, Mail, Phone } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Admin' | 'Faculty' | 'Student';
  institution: string;
  department?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  joinedDate: string;
  avatar?: string;
}

interface UserManagementProps {
  users: User[];
  onAddUser?: () => void;
  onEditUser?: (id: string) => void;
  onDeleteUser?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const UserManagement = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<'All' | 'Super Admin' | 'Admin' | 'Faculty' | 'Student'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return <Shield size={16} className="text-purple-600" />;
      case 'Admin':
        return <Settings size={16} className="text-blue-600" />;
      case 'Faculty':
        return <UserCheck size={16} className="text-green-600" />;
      case 'Student':
        return <Users size={16} className="text-orange-600" />;
      default:
        return <Users size={16} className="text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Faculty':
        return 'bg-green-100 text-green-800';
      case 'Student':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-600 mt-1">{users.length} users total</p>
          </div>
          <button
            onClick={onAddUser}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 mb-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-3 overflow-x-auto">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="text-sm border-none bg-transparent focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Faculty">Faculty</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border-none bg-transparent focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {['Super Admin', 'Admin', 'Faculty', 'Student'].map((role) => (
            <div key={role} className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-1">
                {getRoleIcon(role)}
              </div>
              <p className="text-xs text-gray-600">{role}</p>
              <p className="text-lg font-bold text-gray-800">
                {users.filter(u => u.role === role).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="px-4 space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {/* Header */}
            <div className="flex items-start space-x-3 mb-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <span className="text-purple-600 font-semibold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleStatus?.(user.id)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        user.status === 'Active' ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2 text-gray-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-2 text-gray-400" />
                {user.phone}
              </div>
            </div>

            {/* Institution & Department */}
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{user.institution}</span>
                {user.department && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{user.department}</span>
                  </>
                )}
              </p>
            </div>

            {/* Dates */}
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>Joined: {formatDate(user.joinedDate)}</span>
              <span>Last login: {formatDate(user.lastLogin)}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEditUser?.(user.id)}
                className="flex-1 py-2 px-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDeleteUser?.(user.id)}
                className="py-2 px-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="px-4">
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterRole !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first user'
              }
            </p>
            {(!searchTerm && filterRole === 'All' && filterStatus === 'All') && (
              <button
                onClick={onAddUser}
                className="py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Add User
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
