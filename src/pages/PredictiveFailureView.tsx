import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  TrendingDown,
  Layers,
  Wrench,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface PredictiveRiskItem {
  id: string;
  risk: string;
  cause: string;
  probability: number;
  timeToFailure: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affectedTasks: { id: string; title: string }[];
  preventiveAction: string;
  actionStatus: 'pending' | 'executed' | 'dismissed';
}

export const PredictiveFailureView: React.FC = () => {
  const { activeMission, setSelectedPlanVersion, triggerDisruption, t } = useMission();

  const [risks, setRisks] = useState<PredictiveRiskItem[]>([
    {
      id: 'risk-01',
      risk: 'Hydrological Bridge Structural Overload & Water Inundation',
      cause: 'Upstream reservoir runoff crest rate measured at 1.4 m/s. Sensor #12 telemetry indicates water elevation will breach bridge deck in 18 minutes.',
      probability: 94,
      timeToFailure: '18 minutes',
      severity: 'CRITICAL',
      affectedTasks: [
        { id: 'task-09', title: 'Route R2 Causeway Primary Medical Transit' },
        { id: 'task-17', title: 'Shelter 1 Batch-2 ICU Ambulance Convoy' },
        { id: 'task-21', title: 'Emergency Fuel Supply Resupply via R2' },
      ],
      preventiveAction: 'Proactively detour all 8 ALS units to Elevated Bypass Route R4 (KM 14) and notify Highway Patrol to close Causeway Bridge barricades.',
      actionStatus: 'pending',
    },
    {
      id: 'risk-02',
      risk: 'Shelter 2 Auxiliary Backup Generator Overheating',
      cause: 'Ambient temperature 34°C with 100% electrical load for ICU ventilators. Coolant loop pressure dropping 0.2 bar/hour.',
      probability: 76,
      timeToFailure: '42 minutes',
      severity: 'HIGH',
      affectedTasks: [
        { id: 'task-12', title: 'Civic Stadium ICU Ventilator Array Operation' },
        { id: 'task-18', title: 'Cold-Chain Insulin Storage Refrigeration' },
      ],
      preventiveAction: 'Dispatch mobile diesel generator unit DG-04 from Sector 3 reserve and shift non-critical lighting to battery inverter.',
      actionStatus: 'pending',
    },
    {
      id: 'risk-03',
      risk: 'Ambulance A-5 and A-6 Fuel Depletion Before Wave 3',
      cause: 'Extended detour route and congested single-lane bottleneck consuming fuel at 1.8x standard burn rate.',
      probability: 62,
      timeToFailure: '55 minutes',
      severity: 'MEDIUM',
      affectedTasks: [
        { id: 'task-15', title: 'Pediatric Evacuation to Holy Cross Shelter 3' },
      ],
      preventiveAction: 'Stage mobile refuel bowser at KM 8 Bypass junction for rapid 3-minute hot refueling.',
      actionStatus: 'pending',
    },
    {
      id: 'risk-04',
      risk: 'Communication Blackout in Lower Riverbank Hollow',
      cause: 'Cellular tower battery backup estimated exhausted by 14:00 due to flood substation immersion.',
      probability: 88,
      timeToFailure: '25 minutes',
      severity: 'HIGH',
      affectedTasks: [
        { id: 'task-03', title: 'First Responder VHF Radio & Telemetry Relay' },
        { id: 'task-08', title: 'Survivor Biometric Sync to Central Cloud' },
      ],
      preventiveAction: 'Deploy tethered quadcopter RF repeater at 120m altitude above Staging Point Alpha.',
      actionStatus: 'pending',
    },
  ]);

  const handleExecutePreventiveAction = (riskId: string) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === riskId ? { ...r, actionStatus: 'executed' } : r))
    );

    if (riskId === 'risk-01') {
      triggerDisruption('route_r2_blocked');
      setSelectedPlanVersion(2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>PREDICTIVE FAILURE DETECTION ENGINE</span>
            <span aria-hidden="true">·</span>
            <span>PROACTIVE BOTTLENECK MITIGATION</span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Predictive Risk Horizon & Automated Preventive Actions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Analyzing real-time sensor streams, dependency chains, and resource consumption rates to neutralize points of failure *before* they disrupt the mission.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>4 Emerging Risks Tracked</span>
          </span>
        </div>
      </div>

      {/* RISKS LIST (Risk → Cause → Affected Tasks → Preventive Action) */}
      <div className="space-y-4">
        {risks.map((item) => (
          <div
            key={item.id}
            className={`p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-xs space-y-4 transition-all ${
              item.actionStatus === 'executed'
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20'
                : item.severity === 'CRITICAL'
                ? 'border-rose-300 dark:border-rose-800'
                : 'border-slate-200/90 dark:border-slate-800'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    item.severity === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {item.severity} RISK
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-semibold">Probability: {item.probability}%</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Estimated Failure In: {item.timeToFailure}</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {item.risk}
                </h3>
              </div>

              {item.actionStatus === 'executed' ? (
                <span className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Mitigation Executed & Verified</span>
                </span>
              ) : (
                <button
                  onClick={() => handleExecutePreventiveAction(item.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Preventive Action</span>
                </button>
              )}
            </div>

            {/* Structured Breakdown: Cause → Affected Tasks → Preventive Action */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-mono">
              {/* Root Cause */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">
                  Root Cause / Telemetry Trigger
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
                  {item.cause}
                </p>
              </div>

              {/* Affected Tasks */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">
                  Vulnerable Downstream Tasks ({item.affectedTasks.length})
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {item.affectedTasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong className="text-indigo-600 dark:text-indigo-400">{t.id}:</strong>
                      <span className="truncate">{t.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preventive Action */}
              <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-1.5">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase text-[10px] block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Prescribed Preventive Action
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-sans text-xs leading-relaxed font-medium">
                  {item.preventiveAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
