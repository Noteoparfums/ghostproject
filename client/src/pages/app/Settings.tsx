import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { evaluatePasswordStrength } from '../../lib/passwordStrength';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { User, Shield, Bell, Key, Copy, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { z } from 'zod';

export function Settings() {
  useDocumentMeta({
    title: 'Settings — Ghostwriter OS',
  });

  const { user, refreshMe } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  // Tabs structure
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api-keys', label: 'API Keys', icon: Key },
  ];

  const handleTabChange = (id: string) => {
    setSearchParams({ tab: id });
  };

  // 1. Profile State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // Mock profile update
      await new Promise(r => setTimeout(r, 800));
      toast.success('Profile details saved successfully.');
      refreshMe();
    } catch (e) {
      toast.error('Failed to save profile details.');
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState({ score: 0, feedback: '', isBlocked: false });
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = (val: string) => {
    setNewPassword(val);
    setPwdStrength(evaluatePasswordStrength(val));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdStrength.score < 2) {
      toast.error('Please define a stronger password.');
      return;
    }
    setChangingPassword(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setPwdStrength({ score: 0, feedback: '', isBlocked: false });
    } catch (e) {
      toast.error('Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  // Sessions Table
  const sessions = [
    { id: '1', device: 'Safari (macOS)', ip: '192.168.1.45', lastActive: 'Active now', current: true },
    { id: '2', device: 'Chrome (Windows)', ip: '82.203.4.19', lastActive: '3 days ago', current: false },
  ];

  // 3. Notifications state
  const [notifs, setNotifs] = useState({
    credits_low: true,
    generation_finished: true,
    invoice_paid: false,
    security_alerts: true,
  });

  const handleToggleNotif = (key: keyof typeof notifs, val: boolean) => {
    // Optimistic UI updates
    setNotifs(p => ({ ...p, [key]: val }));
    toast.success('Notification preferences updated.');
  };

  // 4. API Keys state
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; prefix: string; created: string }>>([
    { id: 'key_1', name: 'Staging Server', prefix: 'gw_live_a1b2...', created: 'June 10, 2026' }
  ]);
  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomKey = `gw_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setGeneratedKey(randomKey);
    setApiKeys(p => [
      ...p,
      { id: `key_${Date.now()}`, name: newKeyName, prefix: `${randomKey.slice(0, 12)}...`, created: 'Just now' }
    ]);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(p => p.filter(k => k.id !== id));
    toast.info('API Key revoked.');
  };

  return (
    <div className="flex flex-col gap-6 select-none min-w-0">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight dark:text-zinc-50 text-zinc-900">
          Account Settings
        </h1>
        <p className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
          Manage profile details, security access, and API configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
        {/* Navigation Tabs List */}
        <nav className="flex md:flex-col gap-1 border-b md:border-b-0 md:border-r dark:border-zinc-900 border-zinc-200 pb-4 md:pb-0 md:pr-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab views */}
        <div className="min-w-0">
          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-5 max-w-xl">
              <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                Personal Profile
              </h3>
              
              <Field label="Full Name" id="name">
                <Input
                  id="name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </Field>

              <Field label="Email Address" id="email" hint="Contact support to change your account email.">
                <Input
                  id="email"
                  disabled
                  value={user?.email || ''}
                />
              </Field>

              <Toggle
                label="Receive marketing promotions and engine feature announcements"
                checked={marketingOptIn}
                onChange={setMarketingOptIn}
              />

              <div className="flex justify-end mt-2">
                <Button type="submit" variant="primary" size="sm" loading={savingProfile}>
                  Save Details
                </Button>
              </div>
            </form>
          )}

          {/* SECURITY VIEW */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6 max-w-2xl min-w-0">
              {/* Change Password form */}
              <form onSubmit={handleUpdatePassword} className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-5">
                <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                  Update Password
                </h3>

                <Field label="Current Password" id="curr-pwd">
                  <Input
                    id="curr-pwd"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Field>

                <Field label="New Password" id="new-pwd">
                  <Input
                    id="new-pwd"
                    type="password"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  {newPassword && (
                    <div className="mt-2.5 flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="dark:text-zinc-500 text-zinc-400">Password Strength</span>
                        <span className={cn(pwdStrength.score <= 1 ? 'text-red-500' : pwdStrength.score === 2 ? 'text-amber-500' : 'text-emerald-500')}>
                          {pwdStrength.feedback}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1 bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden mt-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'flex-1 h-full rounded',
                              i < pwdStrength.score ? pwdStrength.score <= 2 ? 'bg-red-500' : 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Field>

                <div className="flex justify-end mt-2">
                  <Button type="submit" variant="primary" size="sm" loading={changingPassword} disabled={pwdStrength.score < 2}>
                    Change Password
                  </Button>
                </div>
              </form>

              {/* Sessions Table */}
              <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-4">
                <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                  Active Sessions
                </h3>
                <DataTable
                  columns={[
                    { key: 'device', label: 'Device' },
                    { key: 'ip', label: 'IP Address' },
                    { 
                      key: 'lastActive', 
                      label: 'Last Active',
                      render: (row) => row.current ? <Badge tone="success">Current Device</Badge> : row.lastActive 
                    },
                  ]}
                  rows={sessions}
                />
              </div>
            </div>
          )}

          {/* NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-6 max-w-xl">
              <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                Notification Preferences
              </h3>

              <div className="flex flex-col gap-4 divide-y dark:divide-zinc-900 divide-zinc-100">
                <Toggle
                  className="py-4"
                  label="Notify when credit balance falls below 10.00 credits"
                  checked={notifs.credits_low}
                  onChange={(v) => handleToggleNotif('credits_low', v)}
                />
                <Toggle
                  className="py-4"
                  label="Receive push updates when copy funnel generation finishes"
                  checked={notifs.generation_finished}
                  onChange={(v) => handleToggleNotif('generation_finished', v)}
                />
                <Toggle
                  className="py-4"
                  label="Email receipts when invoice payment completes successfully"
                  checked={notifs.invoice_paid}
                  onChange={(v) => handleToggleNotif('invoice_paid', v)}
                />
                <Toggle
                  className="py-4"
                  label="High priority security alerts regarding account logins"
                  checked={notifs.security_alerts}
                  onChange={(v) => handleToggleNotif('security_alerts', v)}
                />
              </div>
            </div>
          )}

          {/* API KEYS VIEW */}
          {activeTab === 'api-keys' && (
            <div className="flex flex-col gap-6 max-w-3xl min-w-0">
              <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800">
                      Developer API Keys
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Integrate copy outputs into workflows or headless marketing sites.
                    </p>
                  </div>
                  <Button onClick={() => {
                    setGeneratedKey(null);
                    setNewKeyModalOpen(true);
                  }} variant="primary" size="sm">
                    Create Key
                  </Button>
                </div>

                <DataTable
                  columns={[
                    { key: 'name', label: 'Key Name', render: (row) => <span className="font-bold">{row.name}</span> },
                    { key: 'prefix', label: 'Token Prefix', render: (row) => <span className="font-mono text-xs">{row.prefix}</span> },
                    { key: 'created', label: 'Created Date' },
                    {
                      key: 'actions',
                      label: 'Actions',
                      render: (row) => (
                        <Button onClick={() => handleRevokeKey(row.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                          Revoke
                        </Button>
                      )
                    }
                  ]}
                  rows={apiKeys}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Key Modal */}
      <Modal
        open={newKeyModalOpen}
        onClose={() => setNewKeyModalOpen(false)}
        title="Create API Key"
        size="sm"
      >
        {generatedKey ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-grow min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider">Save this key</h4>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  For security, we will only display this key once. Make sure to copy it now.
                </p>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl font-mono text-xs text-zinc-800 dark:text-zinc-200 flex justify-between items-center gap-4">
              <span className="truncate select-all">{generatedKey}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey);
                  toast.success('Key copied!');
                }}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100"
                title="Copy Key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setNewKeyModalOpen(false)} variant="primary" size="sm">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateApiKey} className="flex flex-col gap-4">
            <Field label="Key Name" id="key-name">
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Webhook Integration"
              />
            </Field>
            <div className="flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setNewKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!newKeyName.trim()}>
                Generate Key
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
export default Settings;
