"use client"
import { SuperAdminAnalytics } from "@/app/_component/super-admin/analytics-dashboard";

// Mock analytics data
const mockAnalyticsData = {
  attendanceTrend: [82, 85, 79, 88, 84, 86],
  departmentPerformance: [
    { name: "CSE", attendance: 84, students: 450 },
    { name: "IT", attendance: 78, students: 380 },
    { name: "ECE", attendance: 82, students: 320 },
    { name: "MECH", attendance: 76, students: 400 },
    { name: "CIVIL", attendance: 80, students: 280 },
  ],
  monthlyStats: [
    { month: "January", attendance: 82, defaulters: 145 },
    { month: "February", attendance: 84, defaulters: 132 },
    { month: "March", attendance: 81, defaulters: 158 },
    { month: "April", attendance: 85, defaulters: 128 },
  ],
};

export default function AnalyticsPage() {
  return (
    <SuperAdminAnalytics 
      data={mockAnalyticsData}
      organizationName="Maharashtra State Board of Technical Education"
    />
  );
}
