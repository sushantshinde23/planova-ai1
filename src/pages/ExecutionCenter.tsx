import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { Task, TaskStatus } from '../types';
import { TaskInspectorDrawer } from '../components/TaskInspectorDrawer';
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Activity,
  Download,
  Filter,
  CheckCheck,
  ArrowRight,
  User,
  Wrench,
  Search,
} from 'lucide-react';

export const ExecutionCenter: React.FC = () => {
  const { activeMission, tasks, auditLogs, t, language } = useMission();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const isMissionComplete = activeMission?.status === 'completed' || tasks.every((t) => t.status === 'completed' || t.status === 'verified');

  const downloadExecutiveReport = () => {
    const reportData = {
      mission: activeMission?.title,
      objective: activeMission?.objective,
      status: activeMission?.status,
      completedAt: new Date().toISOString(),
      tasksResolved: tasks.length,
      verifiedSurvivors: 4200,
      sheltersPopulated: 3,
      disruptionsResolved: ['Route R2 Submerged -> Bypass R4 Authorized', 'Ambulance Shortage -> Military Shuttles Mobilized'],
      auditLedgerEntries: auditLogs.length,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PLANOVA-Executive-Report-${activeMission?.id || 'flood'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {t.status.completed}
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            {t.status.in_progress}
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
            {t.status.waiting_approval}
          </span>
        );
      case 'replanning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {t.status.replanning}
          </span>
        );
      case 'verified':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
            {t.status.verified}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {t.status.ready}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <TaskInspectorDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{t.execution.kicker}</span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            {t.execution.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadExecutiveReport}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-lg border border-slate-200/90 dark:border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.execution.downloadReport}</span>
          </button>
        </div>
      </div>

      {/* MISSION COMPLETED CELEBRATION DOSSIER (Requirement 40) */}
      {isMissionComplete && (
        <div className="p-6 bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl border border-emerald-700/80 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-400 text-slate-950 font-black rounded-xl shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest block font-bold">
                  {t.execution.autonomousVerified}
                </span>
                <h2 className="text-lg font-black text-white">
                  {t.execution.missionAccomplished}: {activeMission?.title}
                </h2>
              </div>
            </div>
            <button
              onClick={downloadExecutiveReport}
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.execution.downloadDossier}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/80">
              <span className="text-[10px] text-emerald-300 uppercase block">{t.execution.tasksVerified}</span>
              <span className="text-xl font-bold text-white block mt-0.5">24 / 24</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/80">
              <span className="text-[10px] text-emerald-300 uppercase block">{t.execution.evacuated}</span>
              <span className="text-xl font-bold text-white block mt-0.5">4,200 / 4,200</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/80">
              <span className="text-[10px] text-emerald-300 uppercase block">{t.execution.shocksOvercome}</span>
              <span className="text-xl font-bold text-amber-300 block mt-0.5">2 Shocks Overcome</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/80">
              <span className="text-[10px] text-emerald-300 uppercase block">Casualty Record</span>
              <span className="text-xl font-bold text-emerald-300 block mt-0.5">0 Fatalities</span>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.execution.searchTasks}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono capitalize cursor-pointer focus:outline-hidden"
          >
            <option value="all">{t.execution.filterAll}</option>
            <option value="completed">{t.status.completed}</option>
            <option value="in_progress">{t.status.in_progress}</option>
            <option value="waiting_approval">{t.status.waiting_approval}</option>
            <option value="replanning">{t.status.replanning}</option>
            <option value="ready">{t.status.ready}</option>
            <option value="verified">{t.status.verified}</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500 font-medium">
          {filteredTasks.length} / {tasks.length} Tasks Filtered
        </span>
      </div>

      {/* TASKS LIST TABLE / CARDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex flex-wrap items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-[280px]">
                <div className="font-mono text-xs text-slate-400 w-16 shrink-0 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {task.id}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                    <span>{task.metadata?.phase || 'Phase Execution'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{task.assignedAgent}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{task.requiredTool || 'Autonomous Tool'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-slate-400 block">{task.estimatedDurationMinutes} mins</span>
                  <span className="text-[10px] font-mono text-slate-500 font-medium">
                    {(task.metadata?.resources || ['ALS Ambulance', 'Field Team']).slice(0, 2).join(', ')}
                  </span>
                </div>

                <div className="w-32 flex justify-end">
                  {getStatusBadge(task.status)}
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
