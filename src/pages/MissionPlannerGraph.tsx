import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { DependencyGraphCanvas } from '../components/DependencyGraphCanvas';
import { TaskInspectorDrawer } from '../components/TaskInspectorDrawer';
import { Task } from '../types';
import {
  GitCompare,
  Layers,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Route,
  Truck,
  Clock,
} from 'lucide-react';

export const MissionPlannerGraph: React.FC = () => {
  const {
    activeMission,
    tasks,
    plans,
    selectedPlanVersion,
    setSelectedPlanVersion,
    triggerDisruption,
    t,
  } = useMission();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);

  const currentPlan = plans.find((p) => p.version === selectedPlanVersion) || plans[0];
  const originalPlan = plans.find((p) => p.version === 1) || plans[0];

  return (
    <div className="space-y-6">
      {/* Drawer for task inspection */}
      <TaskInspectorDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Header and Version Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{t.planner.kicker}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeMission?.title}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            {t.planner.title}
          </h1>
        </div>

        {/* Plan Version Selector & Diff Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Plan Version Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
            {plans.map((p) => (
              <button
                key={p.version}
                onClick={() => setSelectedPlanVersion(p.version)}
                className={`px-3 py-1.5 font-bold rounded-md transition-all cursor-pointer ${
                  selectedPlanVersion === p.version
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {t.planner.version} v{p.version} {p.version === 1 ? '(Baseline)' : p.version === 2 ? '(R2 Detour)' : '(Scarcity)'}
              </button>
            ))}
          </div>

          {/* Toggle Plan Diff Mode */}
          <button
            onClick={() => setIsDiffMode(!isDiffMode)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isDiffMode
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isDiffMode ? t.common.close : t.planner.diffToggle}</span>
          </button>
        </div>
      </div>

      {/* PLAN VERSION METADATA & REASON BANNER */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {t.planner.version}: Plan v{currentPlan.version}
            </span>
            <span aria-hidden="true">·</span>
            <span>{new Date(currentPlan.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-500">
              {t.planner.tasksTotal}: <strong className="text-slate-900 dark:text-white font-mono">24</strong>
            </span>
            <span className="text-slate-500">
              {t.planner.criticalPath}: <strong className="text-amber-600 dark:text-amber-400 font-mono">{currentPlan.summaryDiff.reroutedPaths}</strong>
            </span>
            <span className="text-slate-500">
              {t.planner.disruptionsHandled}: <strong className="text-purple-600 dark:text-purple-400 font-mono">{currentPlan.summaryDiff.resourceAdjustments}</strong>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 font-mono">
          <strong className="text-indigo-600 dark:text-indigo-400">{t.approval.reason}:</strong> {currentPlan.reason}
        </p>
      </div>

      {/* SIDE-BY-SIDE DIFF COMPARATOR (Requirement 15 & 38) */}
      {isDiffMode && (
        <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4 shadow-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.planner.diffToggle}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Automated Impact & Reroute Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Original Plan Column */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
              <span className="font-bold text-slate-400 block border-b border-slate-800 pb-1">
                ORIGINAL BASELINE PLAN (v1)
              </span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <Route className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Primary Transit Corridor: Route R2 Causeway Bridge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Ambulance Convoy: 8 Dedicated ALS Units</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Transit ETA: 30 minutes to Shelter 1</span>
                </li>
                <li className="text-[11px] text-slate-500 mt-2">
                  Status: DEPRECATED due to telemetry submergence alert.
                </li>
              </ul>
            </div>

            {/* Replanned Column */}
            <div className="p-4 bg-slate-950 rounded-lg border border-amber-900/60 space-y-2.5">
              <span className="font-bold text-amber-400 block border-b border-amber-900/60 pb-1 flex items-center justify-between">
                <span>ADAPTIVE RE-PLAN (v{currentPlan.version})</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                  AUTONOMOUSLY RE-SYNTHESIZED
                </span>
              </span>
              <ul className="space-y-1.5 text-slate-200">
                {currentPlan.version === 2 ? (
                  <>
                    <li className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Route className="w-3.5 h-3.5 shrink-0" />
                      <span>Reroute: Submerged R2 replaced with Elevated Bypass R4</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Fleet: All 8 units re-dispatched via GPS telemetry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Updated ETA: 45 minutes (+15 min delta calculated)</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2 text-rose-300 font-semibold">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      <span>Fleet Shock: 3 ambulances diverted to critical ICU transit</span>
                    </li>
                    <li className="flex items-center gap-2 text-amber-300">
                      <Route className="w-3.5 h-3.5 shrink-0" />
                      <span>Shuttle Staging: Rapid 2-wave rotation mobilized</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Updated ETA: 65 minutes with priority triage</span>
                    </li>
                  </>
                )}
                <li className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approved & executing with zero unassigned casualties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE DEPENDENCY GRAPH CANVAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              {t.planner.graphView}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-semibold">
              DAG Visualizer
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click any task node to inspect telemetry, dependencies, and state machine transitions.
          </span>
        </div>

        {/* The Visual Canvas */}
        <DependencyGraphCanvas
          onSelectTask={(task) => setSelectedTask(task)}
        />
      </div>
    </div>
  );
};
