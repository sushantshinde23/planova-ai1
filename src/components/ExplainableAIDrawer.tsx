import React from 'react';
import { useMission } from '../store/missionContext';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Database,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';

export const ExplainableAIDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { activeMission, selectedPlanVersion, plans, approvals, t } = useMission();

  if (!isOpen || !activeMission) return null;

  const currentPlan = plans.find((p) => p.version === selectedPlanVersion) || plans[0];
  const pendingApproval = approvals.find((a) => a.status === 'pending');

  const riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    selectedPlanVersion >= 3 ? 'CRITICAL' : selectedPlanVersion === 2 ? 'HIGH' : 'LOW';

  const confidenceScore =
    selectedPlanVersion === 2 ? 94 : selectedPlanVersion === 3 ? 89 : 98;

  const isApprovalReq = riskTier === 'HIGH' || riskTier === 'CRITICAL';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              EXPLAINABLE AI DECISION AUDIT
            </span>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Transparent Decision Governance Panel
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content — Exact 6 Required Fields (Requirement 9) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
        {/* 1. Why this action? */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            1. Why This Action?
          </span>
          <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-xs">
            {selectedPlanVersion >= 2
              ? 'Telemetry sensor IOT-WATER-12 detected Causeway Bridge R2 submerged by 0.92m water. PLANOVA AI autonomously detoured medical transit to Elevated Bypass R4 to eliminate casualty submergence risk while maintaining ambulance wave schedules.'
              : 'Initial mission plan decomposed 4,200 evacuees across 3 safe shelters using shortest hydrological arrival vectors to minimize citizen exposure.'}
          </p>
        </div>

        {/* 2. Data used */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            2. Empirical Data Used
          </span>
          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-sans text-xs">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>Hydrology Telemetry:</strong> Water level depth 0.92m above bridge deck (1.4 m/s runoff)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>Google Maps Platform:</strong> Live traffic and elevation check on Elevated Bypass R4 (+14m)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>Civil Hospital Registry:</strong> 142 ICU bedridden patients indexed with triage priority</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>Fleet GPS:</strong> Real-time positions for Ambulances A-1 through A-8</span>
            </li>
          </ul>
        </div>

        {/* 3. Expected impact */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            3. Expected Operational Impact
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Timeline Shift:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {selectedPlanVersion >= 2 ? '+9 min detour delta' : 'Baseline ETA 30m'}
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Casualty Safety:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                0 Casualties Projected
              </span>
            </div>
          </div>
        </div>

        {/* 4. Risk level & 5. Confidence score */}
        <div className="grid grid-cols-2 gap-3">
          {/* Risk Level */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              4. Risk Level
            </span>
            <div className="pt-1">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                riskTier === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  : riskTier === 'HIGH'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {riskTier} TIER
              </span>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              5. Confidence Score
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 pt-0.5">
              {confidenceScore}%
            </div>
          </div>
        </div>

        {/* 6. Approval required? */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isApprovalReq
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              6. Human-In-The-Loop Approval Required?
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isApprovalReq
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-emerald-500 text-white'
            }`}>
              {isApprovalReq ? 'YES — MANDATORY' : 'NO — AUTOMATIC'}
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 font-sans text-xs leading-relaxed">
            {isApprovalReq
              ? 'Because diverting primary medical convoys through alternate bypass corridors carries high municipal liability, PLANOVA AI requires digital sign-off from an authorized Mission Operator or Administrator.'
              : 'Low-risk autonomous actions (telemetry sweeps, queue balancing, tool pings) execute automatically without operator interruption.'}
          </p>
        </div>
      </div>
    </div>
  );
};
