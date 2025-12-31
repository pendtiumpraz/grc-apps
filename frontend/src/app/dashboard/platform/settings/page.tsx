'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, RefreshCw, Database, Shield, Globe, Bell, Mail, Key, CheckCircle, XCircle, AlertTriangle, Clock, Server, HardDrive, Activity, Users, CreditCard, Zap } from 'lucide-react';

interface SystemSettings {
  general: {
    platformName: string;
    platformDomain: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    language: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    emailFrom: string;
    slackWebhookUrl: string;
  };
  storage: {
    maxStoragePerTenant: number;
    storageWarningThreshold: number;
    storageCriticalThreshold: number;
    backupEnabled: boolean;
    backupFrequency: string;
    backupRetentionDays: number;
  };
  api: {
    rateLimitEnabled: boolean;
    rateLimitPerMinute: number;
    rateLimitPerHour: number;
    apiTimeout: number;
    maxConcurrentRequests: number;
  };
  billing: {
    currency: string;
    taxRate: number;
    paymentMethods: string[];
    invoicePrefix: string;
    invoiceDueDays: number;
  };
}

export default function SystemSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'storage' | 'api' | 'billing'>('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setSettings({
        general: {
          platformName: 'Cyber GRC Platform',
          platformDomain: 'cyber.id',
          supportEmail: 'support@cyber.id',
          supportPhone: '+62 21 1234 5678',
          timezone: 'Asia/Jakarta',
          language: 'id',
        },
        security: {
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecialChars: true,
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          twoFactorRequired: false,
        },
        notifications: {
          emailEnabled: true,
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUsername: 'noreply@cyber.id',
          smtpPassword: '********',
          emailFrom: 'noreply@cyber.id',
          slackWebhookUrl: '',
        },
        storage: {
          maxStoragePerTenant: 100,
          storageWarningThreshold: 80,
          storageCriticalThreshold: 95,
          backupEnabled: true,
          backupFrequency: 'daily',
          backupRetentionDays: 30,
        },
        api: {
          rateLimitEnabled: true,
          rateLimitPerMinute: 100,
          rateLimitPerHour: 5000,
          apiTimeout: 30,
          maxConcurrentRequests: 50,
        },
        billing: {
          currency: 'IDR',
          taxRate: 11,
          paymentMethods: ['bank_transfer', 'credit_card', 'ewallet'],
          invoicePrefix: 'INV-',
          invoiceDueDays: 15,
        },
      });
      setLoading(false);
    }, 500);
  };

  const handleSave = async () => {
    setSaving(true);
    // In production, call API to save settings
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleTestEmail = () => {
    // In production, send test email
    console.log('Sending test email...');
  };

  const handleTestSlack = () => {
    // In production, send test notification to Slack
    console.log('Sending test Slack notification...');
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                  <p className="text-gray-400">
                    Pengaturan global platform
                  </p>
                </div>
                <div className="flex gap-2">
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-500/20 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>Settings saved successfully</span>
                    </div>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Grid Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <nav className="space-y-1">
                      <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'general'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        <span>General</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'security'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Security</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'notifications'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('storage')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'storage'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <HardDrive className="w-5 h-5" />
                        <span>Storage</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('api')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'api'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                        <span>API</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'billing'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Billing</span>
                      </button>
                    </nav>
                  </div>
                </Card>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  {activeTab === 'general' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-cyan-400" />
                          General Settings
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-400">Platform Name</Label>
                            <Input
                              value={settings.general.platformName}
                              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })}
                              className="mt-1 bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Platform Domain</Label>
                            <Input
                              value={settings.general.platformDomain}
                              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformDomain: e.target.value } })}
                              className="mt-1 bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-400">Support Email</Label>
                              <Input
                                value={settings.general.supportEmail}
                                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
                                className="mt-1 bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-400">Support Phone</Label>
                              <Input
                                value={settings.general.supportPhone}
                                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportPhone: e.target.value } })}
                                className="mt-1 bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-400">Timezone</Label>
                              <select
                                value={settings.general.timezone}
                                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })}
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                              >
                                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                                <option value="Asia/Singapore">Asia/Singapore</option>
                                <option value="UTC">UTC</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-gray-400">Language</Label>
                              <select
                                value={settings.general.language}
                                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, language: e.target.value } })}
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                              >
                                <option value="id">Indonesian</option>
                                <option value="en">English</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'security' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-cyan-400" />
                          Security Settings
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Password Requirements</h4>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-400">Minimum Length</Label>
                                <Input
                                  type="number"
                                  value={settings.security.passwordMinLength}
                                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordMinLength: parseInt(e.target.value) } })}
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Require Uppercase</p>
                                  <p className="text-gray-400 text-sm">Password must contain at least one uppercase letter</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, security: { ...settings.security, passwordRequireUppercase: !settings.security.passwordRequireUppercase } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.security.passwordRequireUppercase ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.security.passwordRequireUppercase ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Require Lowercase</p>
                                  <p className="text-gray-400 text-sm">Password must contain at least one lowercase letter</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, security: { ...settings.security, passwordRequireLowercase: !settings.security.passwordRequireLowercase } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.security.passwordRequireLowercase ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.security.passwordRequireLowercase ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Require Numbers</p>
                                  <p className="text-gray-400 text-sm">Password must contain at least one number</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, security: { ...settings.security, passwordRequireNumbers: !settings.security.passwordRequireNumbers } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.security.passwordRequireNumbers ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.security.passwordRequireNumbers ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Require Special Characters</p>
                                  <p className="text-gray-400 text-sm">Password must contain at least one special character</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, security: { ...settings.security, passwordRequireSpecialChars: !settings.security.passwordRequireSpecialChars } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.security.passwordRequireSpecialChars ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.security.passwordRequireSpecialChars ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Session & Login</h4>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-400">Session Timeout (seconds)</Label>
                                <Input
                                  type="number"
                                  value={settings.security.sessionTimeout}
                                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: parseInt(e.target.value) } })}
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-400">Max Login Attempts</Label>
                                <Input
                                  type="number"
                                  value={settings.security.maxLoginAttempts}
                                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) } })}
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Require Two-Factor Authentication</p>
                                  <p className="text-gray-400 text-sm">All users must enable 2FA</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, security: { ...settings.security, twoFactorRequired: !settings.security.twoFactorRequired } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.security.twoFactorRequired ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.security.twoFactorRequired ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'notifications' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <Bell className="w-5 h-5 text-cyan-400" />
                          Notification Settings
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Email Configuration</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Enable Email Notifications</p>
                                  <p className="text-gray-400 text-sm">Send email notifications for important events</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, emailEnabled: !settings.notifications.emailEnabled } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.notifications.emailEnabled ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications.emailEnabled ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">SMTP Host</Label>
                                  <Input
                                    value={settings.notifications.smtpHost}
                                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtpHost: e.target.value } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">SMTP Port</Label>
                                  <Input
                                    type="number"
                                    value={settings.notifications.smtpPort}
                                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtpPort: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">SMTP Username</Label>
                                  <Input
                                    value={settings.notifications.smtpUsername}
                                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtpUsername: e.target.value } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">SMTP Password</Label>
                                  <Input
                                    type="password"
                                    value={settings.notifications.smtpPassword}
                                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtpPassword: e.target.value } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-gray-400">From Email</Label>
                                <Input
                                  value={settings.notifications.emailFrom}
                                  onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, emailFrom: e.target.value } })}
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <Button
                                onClick={handleTestEmail}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Test Email
                              </Button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Slack Integration</h4>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-400">Slack Webhook URL</Label>
                                <Input
                                  value={settings.notifications.slackWebhookUrl}
                                  onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, slackWebhookUrl: e.target.value } })}
                                  placeholder="https://hooks.slack.com/services/..."
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <Button
                                onClick={handleTestSlack}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Bell className="w-4 h-4 mr-2" />
                                Send Test Notification
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'storage' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <HardDrive className="w-5 h-5 text-cyan-400" />
                          Storage Settings
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Storage Limits</h4>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-400">Max Storage Per Tenant (GB)</Label>
                                <Input
                                  type="number"
                                  value={settings.storage.maxStoragePerTenant}
                                  onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, maxStoragePerTenant: parseInt(e.target.value) } })}
                                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">Warning Threshold (%)</Label>
                                  <Input
                                    type="number"
                                    value={settings.storage.storageWarningThreshold}
                                    onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, storageWarningThreshold: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">Critical Threshold (%)</Label>
                                  <Input
                                    type="number"
                                    value={settings.storage.storageCriticalThreshold}
                                    onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, storageCriticalThreshold: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Backup Configuration</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Enable Backups</p>
                                  <p className="text-gray-400 text-sm">Automatically backup database and files</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, storage: { ...settings.storage, backupEnabled: !settings.storage.backupEnabled } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.storage.backupEnabled ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.storage.backupEnabled ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">Backup Frequency</Label>
                                  <select
                                    value={settings.storage.backupFrequency}
                                    onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, backupFrequency: e.target.value } })}
                                    className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                                  >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-gray-400">Retention (days)</Label>
                                  <Input
                                    type="number"
                                    value={settings.storage.backupRetentionDays}
                                    onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, backupRetentionDays: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'api' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-cyan-400" />
                          API Settings
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Rate Limiting</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-white">Enable Rate Limiting</p>
                                  <p className="text-gray-400 text-sm">Limit API requests per tenant</p>
                                </div>
                                <div
                                  onClick={() => setSettings({ ...settings, api: { ...settings.api, rateLimitEnabled: !settings.api.rateLimitEnabled } })}
                                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.api.rateLimitEnabled ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.api.rateLimitEnabled ? 'translate-x-6' : ''}`} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">Requests Per Minute</Label>
                                  <Input
                                    type="number"
                                    value={settings.api.rateLimitPerMinute}
                                    onChange={(e) => setSettings({ ...settings, api: { ...settings.api, rateLimitPerMinute: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">Requests Per Hour</Label>
                                  <Input
                                    type="number"
                                    value={settings.api.rateLimitPerHour}
                                    onChange={(e) => setSettings({ ...settings, api: { ...settings.api, rateLimitPerHour: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Performance</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">API Timeout (seconds)</Label>
                                  <Input
                                    type="number"
                                    value={settings.api.apiTimeout}
                                    onChange={(e) => setSettings({ ...settings, api: { ...settings.api, apiTimeout: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">Max Concurrent Requests</Label>
                                  <Input
                                    type="number"
                                    value={settings.api.maxConcurrentRequests}
                                    onChange={(e) => setSettings({ ...settings, api: { ...settings.api, maxConcurrentRequests: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'billing' && (
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-cyan-400" />
                          Billing Settings
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-3">Currency & Tax</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">Currency</Label>
                                  <select
                                    value={settings.billing.currency}
                                    onChange={(e) => setSettings({ ...settings, billing: { ...settings.billing, currency: e.target.value } })}
                                    className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                                  >
                                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-gray-400">Tax Rate (%)</Label>
                                  <Input
                                    type="number"
                                    value={settings.billing.taxRate}
                                    onChange={(e) => setSettings({ ...settings, billing: { ...settings.billing, taxRate: parseFloat(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Payment Methods</h4>
                            <div className="space-y-2">
                              {['bank_transfer', 'credit_card', 'ewallet'].map((method) => (
                                <div key={method} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                  <p className="text-white capitalize">{method.replace('_', ' ')}</p>
                                  <div
                                    onClick={() => {
                                      const newMethods = settings.billing.paymentMethods.includes(method)
                                        ? settings.billing.paymentMethods.filter(m => m !== method)
                                        : [...settings.billing.paymentMethods, method];
                                      setSettings({ ...settings, billing: { ...settings.billing, paymentMethods: newMethods } });
                                    }}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.billing.paymentMethods.includes(method) ? 'bg-cyan-600' : 'bg-gray-600'}`}
                                  >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.billing.paymentMethods.includes(method) ? 'translate-x-6' : ''}`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-3">Invoice Configuration</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-400">Invoice Prefix</Label>
                                  <Input
                                    value={settings.billing.invoicePrefix}
                                    onChange={(e) => setSettings({ ...settings, billing: { ...settings.billing, invoicePrefix: e.target.value } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400">Payment Due Days</Label>
                                  <Input
                                    type="number"
                                    value={settings.billing.invoiceDueDays}
                                    onChange={(e) => setSettings({ ...settings, billing: { ...settings.billing, invoiceDueDays: parseInt(e.target.value) } })}
                                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
