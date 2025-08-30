"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Database, Save, Download, Upload } from "lucide-react";

interface SystemSettings {
  general: {
    systemName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    defaultAttendanceThreshold: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    lowAttendanceAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    passwordMinLength: number;
    requireSpecialCharacters: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
    lastBackup: string;
  };
}

interface SystemSettingsProps {
  settings: SystemSettings;
  onSaveSettings?: (settings: SystemSettings) => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onCreateBackup?: () => void;
}

export const SystemSettings = ({
  settings: initialSettings,
  onSaveSettings,
  onExportData,
  onImportData,
  onCreateBackup,
}: SystemSettingsProps) => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'backup'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveSettings?.(settings);
    setHasChanges(false);
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'backup' as const, label: 'Backup', icon: Database },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">System Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Configure system-wide settings</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.systemName}
                    onChange={(e) => updateSettings('general', 'systemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSettings('general', 'supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Attendance Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.general.defaultAttendanceThreshold}
                    onChange={(e) => updateSettings('general', 'defaultAttendanceThreshold', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Disable system access for maintenance</p>
                    </div>
                    <button
                      onClick={() => updateSettings('general', 'maintenanceMode', !settings.general.maintenanceMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.general.maintenanceMode ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow Registration</label>
                      <p className="text-xs text-gray-500">Allow new users to register</p>
                    </div>
                    <button
                      onClick={() => updateSettings('general', 'allowRegistration', !settings.general.allowRegistration)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.general.allowRegistration ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.general.allowRegistration ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="text-xs text-gray-500">
                        {key === 'emailNotifications' && 'Send notifications via email'}
                        {key === 'smsNotifications' && 'Send notifications via SMS'}
                        {key === 'pushNotifications' && 'Send push notifications'}
                        {key === 'lowAttendanceAlerts' && 'Alert when attendance drops below threshold'}
                        {key === 'systemAlerts' && 'Send system maintenance and update alerts'}
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', key, !value)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Minimum Length
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="32"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Special Characters</label>
                      <p className="text-xs text-gray-500">Passwords must contain special characters</p>
                    </div>
                    <button
                      onClick={() => updateSettings('security', 'requireSpecialCharacters', !settings.security.requireSpecialCharacters)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.security.requireSpecialCharacters ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.security.requireSpecialCharacters ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                      <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <button
                      onClick={() => updateSettings('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.security.twoFactorAuth ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Settings */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Backup & Data Management</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                    <p className="text-xs text-gray-500">Automatically create system backups</p>
                  </div>
                  <button
                    onClick={() => updateSettings('backup', 'autoBackup', !settings.backup.autoBackup)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.backup.autoBackup ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backup.backupFrequency}
                    onChange={(e) => updateSettings('backup', 'backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.backup.retentionPeriod}
                    onChange={(e) => updateSettings('backup', 'retentionPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    Last backup: {new Date(settings.backup.lastBackup).toLocaleString()}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={onCreateBackup}
                      className="flex items-center justify-center space-x-2 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Database size={16} />
                      <span>Create Backup Now</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={onExportData}
                        className="flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <Download size={16} />
                        <span>Export</span>
                      </button>
                      
                      <button
                        onClick={onImportData}
                        className="flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Upload size={16} />
                        <span>Import</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
