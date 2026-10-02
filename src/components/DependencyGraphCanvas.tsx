import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { useMission } from '../store/missionContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  Wrench,
  Search,
  CheckCheck,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface DependencyGraphCanvasProps {
  tasks?: Task[];
  onSelectTask: (task: Task) => void;
  selectedTaskId?: string;
}

export const DependencyGraphCanvas: React.FC<DependencyGraphCanvasProps> = ({
  tasks: propTasks,
  onSelectTask,
  selectedTaskId,
}) => {
  const {
    tasks: contextTasks,
    triggerDisruption,
    setSelectedPlanVersion,
    selectedPlanVersion,
  } = useMission();

  const tasks = propTasks || contextTasks;
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [failedTaskId, setFailedTaskId] = useState<string | null>(
    selectedPlanVersion >= 2 ? 'task-09' : null
  );

  // Helper to compute all cascading downstream dependent tasks (Task A → Task B → Task C)
  const getDownstreamTaskIds = (rootId: string): string[] => {
    const result = new Set<string>();
    const queue = [rootId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      tasks.forEach((t) => {
        if (t.dependencies.includes(current) && !result.has(t.id)) {
          result.add(t.id);
          queue.push(t.id);
        }
      });
    }
    return Array.from(result);
  };

  const cascadingImpactedIds = failedTaskId ? getDownstreamTaskIds(failedTaskId) : [];

  // Group tasks into logical execution columns
  const phaseColumns = [
    {
      id: 'phase-1',
      title: 'Phase I: Assessment & Intelligence',
      taskIds: ['task-01', 'task-02', 'task-03'],
    },
    {
      id: 'phase-2',
      title: 'Phase II: Staging & Fleet Allocation',
      taskIds: ['task-04', 'task-05', 'task-06', 'task-07', 'task-08', 'task-14'],
    },
    {
      id: 'phase-3',
      title: 'Phase III: Transit Corridors & Telemetry',
      taskIds: ['task-09', 'task-10', 'task-11', 'task-12', 'task-13'],
    },
    {
      id: 'phase-4',
      title: 'Phase IV: Disruption & Adaptive Replan',
      taskIds: ['task-15', 'task-16', 'task-17', 'task-18', 'task-19', 'task-20'],
    },
    {
      id: 'phase-5',
      title: 'Phase V: Diversion & Verified Closure',
      taskIds: ['task-21', 'task-22', 'task-23', 'task-24'],
    },
  ];

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          className: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          className: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 animate-pulse',
          icon: <Clock className="w-3 h-3 text-blue-500" />,
        };
      case 'waiting_approval':
        return {
          label: 'Waiting Approval',
          className: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 font-bold',
          icon: <ShieldAlert className="w-3 h-3 text-amber-500" />,
        };
      case 'replanning':
        return {
          label: 'Re-planning',
          className: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800',
          icon: <RotateCcw className="w-3 h-3 text-purple-500 animate-spin" />,
        };
      case 'verified':
        return {
          label: 'Verified',
          className: 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-700',
          icon: <CheckCheck className="w-3 h-3 text-emerald-600" />,
        };
      case 'failed':
        return {
          label: 'Failed',
          className: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
          icon: <AlertCircle className="w-3 h-3 text-rose-500" />,
        };
      case 'ready':
        return {
          label: 'Ready',
          className: 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
          icon: <ArrowRight className="w-3 h-3 text-slate-500" />,
        };
      default:
        return {
          label: status,
          className: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800',
          icon: <Clock className="w-3 h-3 text-slate-400" />,
        };
    }
  };

  const handleTriggerTaskFailure = (taskId: string) => {
    if (failedTaskId === taskId) {
      setFailedTaskId(null);
    } else {
      setFailedTaskId(taskId);
    }
  };

  const handleSendToReplanner = () => {
    triggerDisruption('route_r2_blocked');
    setSelectedPlanVersion(2);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (t.requiredTool && t.requiredTool.toLowerCase().includes(filterQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-3">
      {/* Canvas Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes, tools, IDs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 w-56"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-xs font-mono">
            {['all', 'in_progress', 'waiting_approval', 'replanning', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors capitalize cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All (24)' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <button
            onClick={() => handleTriggerTaskFailure('task-09')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              failedTaskId === 'task-09'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white dark:bg-slate-800 text-rose-600 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{failedTaskId === 'task-09' ? 'Clear Simulated Failure' : 'Simulate Task-09 Failure'}</span>
          </button>
        </div>
      </div>

      {/* CASCADE IMPACT FLOATING BANNER (Requirement 7) */}
      {failedTaskId && (
        <div className="mx-4 p-4 bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 text-white font-bold rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono font-bold text-rose-800 dark:text-rose-300">
                <span>DEPENDENCY CASCADE TRIGGERED: Task {failedTaskId} FAILED</span>
                <span className="text-slate-400">·</span>
                <span>{cascadingImpactedIds.length} DOWNSTREAM TASKS PARALYZED</span>
              </div>
              <p className="text-rose-700 dark:text-rose-400 mt-0.5 font-sans">
                Task A ({failedTaskId}) failure detected. Dependent downstream nodes highlighted in red & amber. Ready to dispatch to Autonomous Re-Planning Engine.
              </p>
            </div>
          </div>

          <button
            onClick={handleSendToReplanner}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Send to Re-Planning Engine (Synthesize Plan v2)</span>
          </button>
        </div>
      )}

      {/* Directed Acyclic Graph Columns Canvas */}
      <div className="flex-1 overflow-x-auto p-4 min-h-[500px]">
        <div className="flex gap-4 min-w-[1200px]">
          {phaseColumns.map((col) => {
            const colTasks = tasks.filter((t) => col.taskIds.includes(t.id));
            return (
              <div
                key={col.id}
                className="flex-1 min-w-[240px] flex flex-col gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800"
              >
                {/* Column Header */}
                <div className="pb-2 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {colTasks.filter((t) => t.status === 'completed' || t.status === 'verified').length}/{colTasks.length}
                  </span>
                </div>

                {/* Nodes Stack */}
                <div className="flex flex-col gap-3">
                  {colTasks.map((task) => {
                    const badge = getStatusBadge(task.status);
                    const isSelected = selectedTaskId === task.id;
                    const isFailedRoot = failedTaskId === task.id;
                    const isCascadingImpact = cascadingImpactedIds.includes(task.id);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md ${
                          isFailedRoot
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/60 ring-2 ring-rose-500 shadow-md animate-pulse'
                            : isCascadingImpact
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-2 ring-amber-400 shadow-xs'
                            : isSelected
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Node Header */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                            {task.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              isFailedRoot
                                ? 'bg-rose-500 text-white border-rose-600 font-bold'
                                : isCascadingImpact
                                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                                : badge.className
                            }`}
                          >
                            {isFailedRoot ? 'FAILED / BLOCKED' : isCascadingImpact ? 'CASCADE IMPACTED' : badge.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h5>

                        {/* Agent & Tool */}
                        <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{task.assignedAgent}</span>
                          </div>
                          {task.requiredTool && (
                            <div className="flex items-center gap-1.5 truncate text-[10px] font-mono text-slate-600 dark:text-slate-300">
                              <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{task.requiredTool}</span>
                            </div>
                          )}
                        </div>

                        {/* Dependencies count indicator */}
                        {task.dependencies.length > 0 && (
                          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <span>Requires:</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{task.dependencies.join(' → ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
