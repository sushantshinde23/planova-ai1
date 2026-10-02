import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { useMission } from '../store/missionContext';
import {
  X,
  Play,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Clock,
  ArrowRight,
  User,
  Wrench,
  FileText,
  Activity,
  CheckCheck,
} from 'lucide-react';

interface TaskInspectorDrawerProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskInspectorDrawer: React.FC<TaskInspectorDrawerProps> = ({ task, onClose }) => {
  const { updateTaskStatus, openApprovalModal, approvals, t, currentUser } = useMission();
  const [updating, setUpdating] = useState(false);

  if (!task) return null;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setUpdating(true);
    await updateTaskStatus(task.id, newStatus);
    setUpdating(false);
  };

  const associatedApproval = approvals.find((a) => a.taskId === task.id && a.status === 'pending');

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-500 uppercase">
            <span>{task.id}</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{task.status.toUpperCase()}</span>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {task.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Details */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
            Description
          </span>
          <p className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 leading-relaxed font-normal">
            {task.description}
          </p>
        </div>

        {/* Operational Assignment */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Assigned Agent</span>
            <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span className="truncate">{task.assignedAgent}</span>
            </div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Required Tool</span>
            <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100 font-mono">
              <Wrench className="w-3.5 h-3.5 text-zinc-500" />
              <span className="truncate">{task.requiredTool || 'Internal Orchestrator'}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Output / Evidence */}
        {task.output && (
          <div>
            <span className="font-semibold text-zinc-500 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              Live Execution Telemetry / Output
            </span>
            <div className="bg-zinc-900 text-zinc-100 font-mono p-3 rounded-lg text-[11px] leading-relaxed border border-zinc-800">
              {task.output}
            </div>
          </div>
        )}

        {/* Evidence Logs */}
        {task.evidence && task.evidence.length > 0 && (
          <div>
            <span className="font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
              Verification Proof & Sensor Logs
            </span>
            <div className="space-y-1">
              {task.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State Machine Transition Actions */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <span className="font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
            Operator State Machine Transitions
          </span>
          <div className="grid grid-cols-2 gap-2">
            {task.status !== 'in_progress' && task.status !== 'completed' && task.status !== 'verified' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('in_progress')}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start In Progress</span>
              </button>
            )}

            {task.status !== 'completed' && task.status !== 'verified' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('completed')}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}

            {task.status === 'completed' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('verified')}
                className="py-2 px-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 col-span-2"
              >
                <CheckCheck className="w-4 h-4 text-emerald-500" />
                <span>Execute Verification Signoff</span>
              </button>
            )}

            {task.status === 'waiting_approval' && associatedApproval && (
              <button
                onClick={() => openApprovalModal(associatedApproval)}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors col-span-2 shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open Approval Authorization Gateway</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
