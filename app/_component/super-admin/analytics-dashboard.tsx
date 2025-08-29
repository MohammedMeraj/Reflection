"use client";

import { useState, useEffect } from "react";
import { Building2, Users, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  attendanceTrend: number[];
  departmentPerformance: { name: string; attendance: number; students: number }[];
  monthlyStats: { month: string; attendance: number; defaulters: number }[];
}

interface SuperAdminAnalyticsProps {
  data: AnalyticsData;
  organizationName: string;
}

export const SuperAdminAnalytics = ({
  data,
  organizationName,
}: SuperAdminAnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
  const [activeChart, setActiveChart] = useState<'attendance' | 'performance'>('attendance');

  // Attendance trend chart data
  const attendanceChartData = [
    { day: 'Mon', attendance: data.attendanceTrend[0] },
    { day: 'Tue', attendance: data.attendanceTrend[1] },
    { day: 'Wed', attendance: data.attendanceTrend[2] },
    { day: 'Thu', attendance: data.attendanceTrend[3] },
    { day: 'Fri', attendance: data.attendanceTrend[4] },
    { day: 'Sat', attendance: data.attendanceTrend[5] },
  ];

  // Department performance chart data
  const departmentChartData = data.departmentPerformance.map((dept, index) => ({
    name: dept.name,
    attendance: dept.attendance,
    students: dept.students,
    fill: [
      '#8B5CF6',
      '#3B82F6', 
      '#10B981',
      '#F59E0B',
      '#EF4444'
    ][index % 5]
  }));

  // Colors for pie chart
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">{organizationName}</p>
      </div>

      {/* Period Selector */}
      <div className="px-4 mb-4">
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          {(['week', 'month', 'semester'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-800">84.2%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={12} className="text-green-500 mr-1" />
              <span className="text-xs text-green-600">+2.3% from last month</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-800">7</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <TrendingDown size={20} className="text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown size={12} className="text-red-500 mr-1" />
              <span className="text-xs text-red-600">-3 from last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2">
          {[
            { key: 'attendance', label: 'Attendance Trend', icon: Activity },
            { key: 'performance', label: 'Department Performance', icon: BarChart3 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeChart === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-800 shadow-sm'
              }`}
            >
              <Icon size={14} className="mr-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="h-64">
            {activeChart === 'attendance' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    fill="#8B5CF6"
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {activeChart === 'performance' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" name="Attendance %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Department Performance List */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
        <div className="space-y-3">
          {data.departmentPerformance.map((dept, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{dept.name}</h4>
                <span className={`text-sm font-bold ${
                  dept.attendance >= 85 ? 'text-green-600' :
                  dept.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {dept.attendance}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Students: {dept.students}</span>
                <span>Target: 75%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dept.attendance >= 85 ? 'bg-green-500' :
                    dept.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${dept.attendance}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold text-purple-600">84.2%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-xl font-bold text-gray-600">81.9%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-xl font-bold text-green-600">+2.3%</p>
              </div>
            </div>
          </div>
          
          <div className="px-4 pb-4">
            {data.monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0">
                <span className="text-sm text-gray-600">{stat.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{stat.attendance}%</span>
                  <span className="text-xs text-red-600">{stat.defaulters} defaulters</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
