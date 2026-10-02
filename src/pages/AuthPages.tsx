import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import {
  User,
  Shield,
  Key,
  Mail,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const AuthPages: React.FC<{
  onAuthSuccess: () => void;
}> = ({ onAuthSuccess }) => {
  const { currentUser, setUserRole } = useMission();

  const [tab, setTab] = useState<'profile' | 'security' | 'integrations'>('profile');
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span>OPERATOR CREDENTIALS & RBAC ACCESS</span>
          <span aria-hidden="true">·</span>
          <span>ENTERPRISE GOVERNANCE</span>
        </div>
        <h1 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
          Operator Profile & System Access Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono">
        {[
          { id: 'profile', label: 'Operator Identity' },
          { id: 'security', label: 'RBAC Authorization' },
          { id: 'integrations', label: 'API Integrations & Keys' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
              tab === t.id
                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5 shadow-2xs">
          <div className="flex items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-xl">
              {userName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {userName}
              </h2>
              <span className="text-xs font-mono text-zinc-500">{userEmail}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Full Legal / Operational Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Duty Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Civil Defense Department
              </label>
              <input
                type="text"
                disabled
                value={currentUser.department}
                className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedMessage ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully</span>
                </span>
              ) : (
                <span></span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RBAC Tab */}
      {tab === 'security' && (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Control what operations this authenticated session can execute or authorize.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                role: 'admin' as const,
                title: 'Administrator',
                desc: 'Full sovereign clearance: Launch, terminate, override security boundaries, edit plan rules, and approve critical risk actions.',
              },
              {
                role: 'operator' as const,
                title: 'Mission Operator (Active Duty)',
                desc: 'Standard command clearance: Create and execute missions, authorize high-impact re-plans, inject telemetry disruptions.',
              },
              {
                role: 'viewer' as const,
                title: 'Auditor / Viewer',
                desc: 'Read-only access: Monitor telemetry streams, inspect dependency graphs, and download verified audit ledgers.',
              },
            ].map((r) => (
              <div
                key={r.role}
                onClick={() => setUserRole(r.role)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  currentUser.role === r.role
                    ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-950 dark:ring-white'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {r.title}
                  </span>
                  {currentUser.role === r.role && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {tab === 'integrations' && (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5 shadow-2xs font-mono text-xs">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              External Real-Time API Connections
            </h2>
            <p className="text-zinc-500 mt-0.5">
              Secure environment variables and authenticated gateways.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Google Gemini AI (3.8-Flash & 3.1-Pro)', status: 'Connected via Secrets', ping: '142ms' },
              { name: 'OpenRouting & Traffic GIS Telemetry', status: 'Active (24 Nodes)', ping: '84ms' },
              { name: 'Copernicus Sentinel SAR Doppler Radar', status: 'Pass #4412 Ingested', ping: '190ms' },
              { name: 'Ayushman Health Registry API', status: 'Secured via Token', ping: '210ms' },
              { name: 'Google Workspace Drive / Gmail / Keep', status: 'OAuth Scopes Initialized', ping: '120ms' },
            ].map((conn, i) => (
              <div
                key={i}
                className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{conn.name}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{conn.status}</span>
                </div>
                <span className="text-zinc-400 text-[11px]">{conn.ping}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
