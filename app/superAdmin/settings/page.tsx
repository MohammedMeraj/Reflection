"use client"
import { SystemSettings } from "@/app/_component/super-admin/system-settings";

// Mock system settings data
const mockSettings = {
  general: {
    systemName: "Reflektion - Attendance Management System",
    supportEmail: "support@reflektion.edu.in",
    maintenanceMode: false,
    allowRegistration: true,
    defaultAttendanceThreshold: 75,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowAttendanceAlerts: true,
    systemAlerts: true,
  },
  security: {
    passwordMinLength: 8,
    requireSpecialCharacters: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
  },
  backup: {
    autoBackup: true,
    backupFrequency: "daily" as const,
    retentionPeriod: 30,
    lastBackup: "2024-01-16T02:00:00Z",
  },
};

export default function SettingsPage() {
  const handleSaveSettings = (settings: any) => {
    console.log("Save settings:", settings);
    // Save settings to backend
  };

  const handleExportData = () => {
    console.log("Export data");
    // Export system data
  };

  const handleImportData = () => {
    console.log("Import data");
    // Import system data
  };

  const handleCreateBackup = () => {
    console.log("Create backup");
    // Create system backup
  };

  return (
    <SystemSettings 
      settings={mockSettings}
      onSaveSettings={handleSaveSettings}
      onExportData={handleExportData}
      onImportData={handleImportData}
      onCreateBackup={handleCreateBackup}
    />
  );
}
