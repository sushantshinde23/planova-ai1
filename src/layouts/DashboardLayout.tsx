import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { ThemeToggle, LanguageSelector } from '../components/ThemeAndLanguageControls';
import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  PlayCircle,
  Truck,
  Sliders,
  Wrench,
  MapPin,
  FileText,
  BarChart3,
  ScrollText,
  MessageSquareCode,
  Settings,
  Search,
  Bell,
  Shield,
  Zap,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Compass,
  Brain,
  ShieldAlert,
  History,
} from 'lucide-react';
import { HackathonDemoModal } from '../components/HackathonDemoModal';
import { AutopilotModal } from '../components/AutopilotModal';
import { HumanApprovalModal } from '../components/HumanApprovalModal';
import { ExplainableAIDrawer } from '../components/ExplainableAIDrawer';

interface DashboardLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  const {
    t,
    language,
    theme,
    currentUser,
    setUserRole,
    approvals,
    activeMission,
  } = useMission();

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAutopilotModalOpen, setIsAutopilotModalOpen] = useState(false);
  const [isExplainDrawerOpen, setIsExplainDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'missions', label: t.nav.missions, icon: FolderGit2 },
    { id: 'digital-twin', label: 'Mission Digital Twin', icon: Compass },
    { id: 'planner', label: t.nav.planner, icon: GitBranch },
    { id: 'agents', label: 'Multi-Agent Collab', icon: Brain },
    { id: 'predictive', label: 'Predictive Failure', icon: ShieldAlert },
    { id: 'execution', label: t.nav.execution, icon: PlayCircle },
    { id: 'resources', label: t.nav.resources, icon: Truck },
    { id: 'simulator', label: t.nav.simulator, icon: Sliders },
    { id: 'memory', label: 'Mission Memory', icon: History },
    { id: 'tools', label: t.nav.tools, icon: Wrench },
    { id: 'tactical-map', label: t.nav.tacticalMap, icon: MapPin },
    { id: 'documents', label: t.nav.documents, icon: FileText },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'audit', label: t.nav.audit, icon: ScrollText },
    { id: 'ai-chat', label: t.nav.aiChat, icon: MessageSquareCode },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-[#0f172a] dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Human Approval Modal */}
      <HumanApprovalModal />

      {/* Flagship Mission Autopilot Modal */}
      <AutopilotModal
        isOpen={isAutopilotModalOpen}
        onClose={() => setIsAutopilotModalOpen(false)}
      />

      {/* Flagship Hackathon Demo Modal */}
      <HackathonDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Explainable AI Drawer */}
      <ExplainableAIDrawer
        isOpen={isExplainDrawerOpen}
        onClose={() => setIsExplainDrawerOpen(false)}
      />

      {/* TOP COMMAND HEADER */}
      <header className="h-14 border-b border-[#e2e8f0] dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md px-4 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-1.5 text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#172554] dark:bg-blue-600 text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-xs">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-[#0f172a] dark:text-white leading-none">
                PLANOVA<span className="text-[#6366f1] dark:text-indigo-400 font-light ml-0.5">AI</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#64748b] dark:text-slate-400 font-medium">
                {t.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-3">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] dark:bg-slate-800/90 border border-[#e2e8f0] dark:border-slate-700/60 rounded-lg text-[#0f172a] dark:text-slate-100 placeholder-[#64748b] focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>
        </div>

        {/* Top Right Controls & Switchers */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Flagship Mission Autopilot Button */}
          <button
            onClick={() => setIsAutopilotModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#172554] hover:bg-[#1e3a8a] text-white dark:bg-[#2563eb] dark:hover:bg-blue-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-[#6366f1] dark:text-white" />
            <span className="hidden sm:inline font-semibold">Mission Autopilot</span>
            <span className="sm:hidden font-semibold">Autopilot</span>
          </button>

          {/* Explainable AI Trigger */}
          <button
            onClick={() => setIsExplainDrawerOpen(true)}
            className="px-2.5 py-1.5 bg-[#f8fafc] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0f172a] dark:text-slate-200 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Inspect AI reasoning and evidence"
          >
            <span className="hidden sm:inline">{t.common.whyThisPlan}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-indigo-50 dark:bg-indigo-950/80 text-[#6366f1] dark:text-indigo-400 font-bold rounded">
              AI
            </span>
          </button>

          {/* System Health Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#f8fafc] dark:bg-slate-800/60 rounded-lg border border-[#e2e8f0] dark:border-slate-700/60 text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[#64748b] dark:text-slate-400 font-mono text-[11px] font-semibold">{t.status.operational}</span>
          </div>

          {/* Notifications / Approvals Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="p-1.5 text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-xl p-3 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0] dark:border-slate-800 mb-2">
                  <span className="font-bold text-[#0f172a] dark:text-slate-100">{t.common.notifications}</span>
                  <span className="text-[10px] font-mono text-[#64748b]">{pendingApprovalsCount} {t.status.waiting_approval}</span>
                </div>
                {pendingApprovalsCount > 0 ? (
                  <div
                    onClick={() => {
                      onNavigate('planner');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                  >
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">
                      {t.approval.title}
                    </span>
                    <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                      {t.approval.subtitle}
                    </p>
                  </div>
                ) : (
                  <span className="text-[#64748b] text-center block py-2">{t.status.operational}</span>
                )}
              </div>
            )}
          </div>

          {/* DEDICATED RELIABLE MULTILINGUAL SELECTOR */}
          <LanguageSelector variant="dropdown" />

          {/* DEDICATED RELIABLE THEME TOGGLE */}
          <ThemeToggle showLabel={false} />

          {/* RBAC Role Selector */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-[#f8fafc] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs transition-colors cursor-pointer border border-[#e2e8f0] dark:border-slate-700"
            >
              <div className="w-5 h-5 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="font-semibold text-[#0f172a] dark:text-slate-200 hidden md:inline text-[11px] font-mono">
                {currentUser.role.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-[#64748b]" />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-lg shadow-lg py-1.5 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-[#64748b] font-semibold border-b border-[#e2e8f0] dark:border-slate-800 mb-1">
                  {t.common.role}
                </div>
                {(['admin', 'operator', 'viewer'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-colors ${
                      currentUser.role === r ? 'font-bold text-[#2563eb] dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-[#64748b] dark:text-slate-400'
                    }`}
                  >
                    <span className="capitalize">{r === 'admin' ? t.common.admin : r === 'operator' ? t.common.operator : t.common.viewer}</span>
                    {currentUser.role === r && <CheckCircle className="w-3.5 h-3.5 text-[#2563eb] dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enterprise Desktop Sidebar */}
        <aside className="w-60 border-r border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#0f172a] hidden md:flex flex-col justify-between shrink-0 select-none shadow-2xs">
          {/* Top Nav links */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <span className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#64748b] dark:text-slate-400 block font-bold">
              PLANOVA MISSION OS
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                      : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'planner' && pendingApprovalsCount > 0 && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar: Active Mission Telemetry Widget */}
          <div className="p-3 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0b1120] text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
              <span className="font-bold">{t.dashboard.activeMissionKicker}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                LIVE
              </span>
            </div>
            <div className="font-semibold text-[#0f172a] dark:text-slate-100 line-clamp-1">
              {activeMission?.title || 'Flood Evacuation: Sector 4'}
            </div>
            <div className="w-full bg-[#e2e8f0] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2563eb] dark:bg-blue-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${activeMission?.progress || 58}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#64748b] font-mono">
              <span>{t.missionCard.progress}: {activeMission?.progress || 58}%</span>
              <span>v{activeMission?.planVersion || 2}</span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            ></div>
            <div className="relative w-64 bg-white dark:bg-[#0f172a] h-full z-50 flex flex-col p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-slate-800 mb-3">
                <span className="font-bold text-sm">PLANOVA AI</span>
                <button onClick={() => setIsMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-[#64748b]" />
                </button>
              </div>
              <div className="space-y-1 overflow-y-auto flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer ${
                        isActive
                          ? 'bg-[#2563eb] text-white font-bold'
                          : 'text-[#64748b] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
