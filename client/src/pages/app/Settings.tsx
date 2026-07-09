import { useSearchParams } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useAuth } from '../../contexts/AuthContext';
import { BRAND } from '../../config/brand';
import { Bell, Key, LockKeyhole, Shield, User } from 'lucide-react';
import { cn } from '../../lib/cn';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api-keys', label: 'API keys', icon: Key },
] as const;

const availability = {
  security: {
    title: 'Security changes are managed through support',
    body: 'Password changes and active-session management are not available in this workspace. Your current session remains protected by the existing authentication service.',
  },
  notifications: {
    title: 'Notification preferences are not configurable yet',
    body: 'Briefloom does not currently expose an account notification-preference endpoint. No preference has been changed.',
  },
  'api-keys': {
    title: 'Developer API access is not available',
    body: 'This workspace cannot create or revoke API keys. We will never display a generated placeholder key.',
  },
} as const;

export function Settings() {
  useDocumentMeta({ title: 'Settings' });
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <header>
        <p className="eyebrow text-[#b9573b]">Account</p>
        <h1 className="font-display mt-2 text-4xl text-foreground">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review your account information and see which controls are available in this workspace.
        </p>
      </header>

      <div className="grid items-start gap-7 md:grid-cols-[210px_1fr]">
        <nav className="flex gap-1 overflow-x-auto border-b border-border pb-3 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-4" aria-label="Settings sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSearchParams({ tab: id })}
              aria-current={activeTab === id ? 'page' : undefined}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs font-bold transition-colors',
                activeTab === id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {activeTab === 'profile' ? (
          <section className="surface-card max-w-2xl rounded-2xl p-6" aria-labelledby="profile-title">
            <h2 id="profile-title" className="text-base font-bold">Account profile</h2>
            <dl className="mt-6 divide-y divide-border">
              <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                <dt className="text-xs font-bold text-muted-foreground">Name</dt>
                <dd className="text-sm font-semibold">{user?.name || 'Not provided'}</dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                <dt className="text-xs font-bold text-muted-foreground">Email</dt>
                <dd className="text-sm font-semibold">{user?.email || 'Not available'}</dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                <dt className="text-xs font-bold text-muted-foreground">Role</dt>
                <dd className="text-sm font-semibold capitalize">{user?.role || 'user'}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs leading-5 text-muted-foreground">{BRAND.support.availability}</p>
            </div>
          </section>
        ) : (
          <section className="surface-card max-w-2xl rounded-2xl p-7" aria-labelledby="availability-title">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 id="availability-title" className="mt-5 text-lg font-bold">
              {availability[activeTab as keyof typeof availability]?.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {availability[activeTab as keyof typeof availability]?.body}
            </p>
            <p className="mt-5 text-xs font-semibold text-[#b9573b]">{BRAND.support.contactLabel}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Settings;