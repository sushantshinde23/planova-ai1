import React from 'react';
import { useMission } from '../store/missionContext';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  ShieldAlert,
  Truck,
} from 'lucide-react';

export const DashboardOverview: React.FC<{
  onLaunchNewMission: () => void;
  onNavigate: (view: string) => void;
}> = ({ onLaunchNewMission, onNavigate }) => {
  const {
    t,
    language,
    missions,
    activeMission,
    tasks,
    resources,
    auditLogs,
    approvals,
    triggerDisruption,
    openApprovalModal,
    setSelectedPlanVersion,
  } = useMission();

  const activeMissionsCount = missions.filter((m) => m.status === 'executing' || m.status === 'planning').length;
  const completedMissionsCount = missions.filter((m) => m.status === 'completed').length;
  const tasksExecuting = tasks.filter((t) => t.status === 'in_progress').length;
  const tasksWaitingApproval = tasks.filter((t) => t.status === 'waiting_approval').length;
  const replanningEventsCount = 2; // Adaptive Detours from Flood evacuation

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#0f172a] dark:text-white tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('planner')}
            className="px-3.5 py-2 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0f172a] dark:text-slate-200 text-xs font-semibold rounded-lg border border-[#e2e8f0] dark:border-slate-800 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#2563eb] dark:text-blue-400" />
            <span>{t.dashboard.interactiveGraph}</span>
          </button>
          <button
            onClick={onLaunchNewMission}
            className="px-4 py-2 bg-[#172554] hover:bg-[#1e3a8a] text-white dark:bg-[#2563eb] dark:hover:bg-blue-700 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{t.dashboard.launchNew}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-[#2563eb]/40 dark:hover:border-blue-500/40 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.activeMissions}
          </span>
          <div className="text-2xl font-black text-[#0f172a] dark:text-slate-100 font-mono">
            {activeMissionsCount}
          </div>
          <span className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1 block font-mono">
            {language === 'hi' ? '९ परिचालन क्षेत्र' : language === 'mr' ? '९ नियंत्रण क्षेत्रे' : '9 Operational Zones'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.completedMissions}
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {completedMissionsCount}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 block font-semibold">
            {language === 'hi' ? '१००% सत्यापित' : language === 'mr' ? '१००% पडताळणी' : '100% Verified'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.tasksExecuting}
          </span>
          <div className="text-2xl font-black text-[#2563eb] dark:text-blue-400 font-mono flex items-center gap-2">
            <span>{tasksExecuting}</span>
            <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
          </div>
          <span className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1 block font-mono">
            {language === 'hi' ? 'समानांतर पाइपलाइन्स' : language === 'mr' ? 'समांतर अंमलबजावणी' : 'Parallel Pipelines'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.tasksWaitingApproval}
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {tasksWaitingApproval}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block font-mono">
            {language === 'hi' ? 'ऑपरेटर अनुमोदन प्रतीक्षित' : language === 'mr' ? 'ऑपरेटर मंजुरी आवश्यक' : 'Operator Gated'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.replanningEvents}
          </span>
          <div className="text-2xl font-black text-[#6366f1] dark:text-indigo-400 font-mono">
            {replanningEventsCount}
          </div>
          <span className="text-[11px] text-[#6366f1] dark:text-indigo-400 mt-1 block font-mono font-medium">
            {language === 'hi' ? 'अनुकूलित मार्ग परिवर्तन' : language === 'mr' ? 'लवचिक मार्ग बदल' : 'Adaptive Detours'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-slate-400 block mb-1">
            {t.metrics.systemHealth}
          </span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{t.status.operational}</span>
          </div>
          <span className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1 block font-mono">Latency 142ms</span>
        </div>
      </div>

      {/* PENDING HUMAN APPROVAL ALERT CALLOUT (IF ANY) */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <span>{t.dashboard.humanApprovalReq}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-[10px] uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                  CRITICAL RISK GATEWAY
                </span>
              </div>
              <p className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-1">
                {pendingApprovals[0].action} — AI Confidence {pendingApprovals[0].aiConfidence}%
              </p>
            </div>
          </div>
          <button
            onClick={() => openApprovalModal(pendingApprovals[0])}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{t.dashboard.reviewAuthorize}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN SECTION: ACTIVE MISSION CARD */}
      <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#64748b] dark:text-slate-400 font-mono">
              <span className="uppercase font-semibold">{t.domains[activeMission?.category as keyof typeof t.domains] || activeMission?.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">
                {t.missionCard.priority}: {activeMission?.priority}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.missionCard.planVersion} v{activeMission?.planVersion || 2}</span>
            </div>
            <h2 className="text-lg font-bold text-[#0f172a] dark:text-slate-100 mt-1">
              {activeMission?.title}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400 max-w-3xl leading-relaxed mt-1">
              {activeMission?.objective}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <span>{t.missionCard.viewMission}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status / Location / ETA Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f8fafc] dark:bg-slate-800/50 rounded-xl border border-[#e2e8f0] dark:border-slate-700/60 text-xs font-mono">
          <div>
            <span className="text-[#64748b] dark:text-slate-400 uppercase text-[10px] block">{t.missionCard.location}</span>
            <span className="font-semibold text-[#0f172a] dark:text-slate-100 truncate block mt-0.5">
              {activeMission?.location}
            </span>
          </div>
          <div>
            <span className="text-[#64748b] dark:text-slate-400 uppercase text-[10px] block">{t.missionCard.eta}</span>
            <span className="font-semibold text-[#0f172a] dark:text-slate-100 block mt-0.5">
              {activeMission?.eta}
            </span>
          </div>
          <div>
            <span className="text-[#64748b] dark:text-slate-400 uppercase text-[10px] block">{t.missionCard.activeAgents}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              7 Agents Orchestrating
            </span>
          </div>
          <div>
            <span className="text-[#64748b] dark:text-slate-400 uppercase text-[10px] block">Status</span>
            <span className="font-semibold text-[#2563eb] dark:text-blue-400 block mt-0.5 capitalize">
              {t.status[activeMission?.status as keyof typeof t.status] || activeMission?.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748b] dark:text-slate-400">{t.missionCard.progress}: {activeMission?.progress}%</span>
            <span className="font-semibold text-[#0f172a] dark:text-slate-200">
              {activeMission?.completedCount} / {activeMission?.tasksCount} {language === 'hi' ? 'कार्य पूर्ण' : language === 'mr' ? 'कामे पूर्ण' : 'Tasks Resolved'}
            </span>
          </div>
          <div className="w-full bg-[#e2e8f0] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563eb] dark:bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${activeMission?.progress || 58}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Disruption Trigger Shortcuts for Flagship Demo */}
        <div className="pt-3 border-t border-[#e2e8f0] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#64748b] dark:text-slate-400 font-mono text-[11px] font-medium">
            {t.missionCard.quickActions}:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerDisruption('route_r2_blocked');
                setSelectedPlanVersion(2);
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.dashboard.injectR2}</span>
            </button>
            <button
              onClick={() => {
                triggerDisruption('ambulance_reduced');
                setSelectedPlanVersion(3);
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.dashboard.injectFleet}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: RESOURCE UTILIZATION & RECENT AUDIT LEDGER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization */}
        <div className="p-5 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2563eb] dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-slate-100">
                {t.dashboard.resourceStrainTitle}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('resources')}
              className="text-xs text-[#2563eb] dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {t.dashboard.viewAllResources}
            </button>
          </div>

          <div className="space-y-3">
            {resources.slice(0, 4).map((res) => {
              const pct = Math.round((res.inUse / res.total) * 100);
              return (
                <div key={res.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0f172a] dark:text-slate-200">{res.name}</span>
                    <span className="font-mono text-[#64748b] dark:text-slate-400">
                      {res.inUse} / {res.total} {res.unit} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#e2e8f0] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Events */}
        <div className="p-5 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-800 rounded-xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563eb] dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-slate-100">
                {t.dashboard.auditEventsTitle}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs text-[#2563eb] dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {t.dashboard.fullLedger}
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#f8fafc] dark:bg-slate-800/40 rounded-lg border border-[#e2e8f0]/80 dark:border-slate-800/70 text-xs space-y-1 hover:border-[#2563eb]/40 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b] dark:text-slate-400">
                  <span className="font-semibold text-[#2563eb] dark:text-blue-400">{log.agent}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-semibold text-[#0f172a] dark:text-slate-100 line-clamp-1">
                  {log.action}
                </p>
                <div className="text-[11px] text-[#64748b] dark:text-slate-400 line-clamp-1 font-mono">
                  {log.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
