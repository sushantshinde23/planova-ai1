import React, { useState, useEffect } from 'react';
import { useMission } from '../store/missionContext';
import {
  Brain,
  Zap,
  Radio,
  Package,
  ShieldCheck,
  Send,
  MessageSquare,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders,
  Terminal,
  Play,
  RotateCcw,
} from 'lucide-react';

interface AgentMessagePacket {
  id: string;
  sender: 'Planning Agent' | 'Execution Agent' | 'Monitoring Agent' | 'Resource Agent' | 'Verification Agent';
  receiver: 'Planning Agent' | 'Execution Agent' | 'Monitoring Agent' | 'Resource Agent' | 'Verification Agent' | 'Orchestration Bus';
  messageType: 'TASK_DISPATCH' | 'TELEMETRY_ANOMALY' | 'REPLAN_DIRECTIVE' | 'RESOURCE_SHRINK' | 'VERIFY_REQUEST' | 'VERIFIED_AUDIT';
  timestamp: string;
  payload: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const MultiAgentCollabView: React.FC = () => {
  const { activeMission, selectedPlanVersion, plans, t } = useMission();

  const [activeAgentTab, setActiveAgentTab] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  const [messages, setMessages] = useState<AgentMessagePacket[]>([
    {
      id: 'msg-01',
      sender: 'Planning Agent',
      receiver: 'Execution Agent',
      messageType: 'TASK_DISPATCH',
      timestamp: '00:02:14 ago',
      riskLevel: 'LOW',
      payload: {
        taskId: 'task-01',
        directive: 'Deploy Riverbank Flood Sensor Array (Triage Point Alpha)',
        toolRequired: 'hydrology_iot_sensor_api',
        allocatedAgents: ['Field Tech Echo-1'],
        dependencies: [],
      },
    },
    {
      id: 'msg-02',
      sender: 'Execution Agent',
      receiver: 'Monitoring Agent',
      messageType: 'TASK_DISPATCH',
      timestamp: '00:01:45 ago',
      riskLevel: 'LOW',
      payload: {
        taskId: 'task-01',
        status: 'in_progress',
        telemetryFeed: 'ws://sensors.hydrology.gov/sec4/stream',
        pollingIntervalMs: 1000,
      },
    },
    {
      id: 'msg-03',
      sender: 'Monitoring Agent',
      receiver: 'Planning Agent',
      messageType: 'TELEMETRY_ANOMALY',
      timestamp: '00:00:58 ago',
      riskLevel: 'CRITICAL',
      payload: {
        anomaly: 'WATER_DEPTH_BREACH',
        sensorId: 'IOT-WATER-12',
        measuredDepthMeters: 0.92,
        clearanceThresholdMeters: 0.35,
        location: 'Route R2 Causeway Bridge',
        affectedDownstreamTasks: ['task-09', 'task-17', 'task-21'],
        impactUrgency: 'IMMEDIATE_REPLAN_REQUIRED',
      },
    },
    {
      id: 'msg-04',
      sender: 'Planning Agent',
      receiver: 'Resource Agent',
      messageType: 'REPLAN_DIRECTIVE',
      timestamp: '00:00:42 ago',
      riskLevel: 'HIGH',
      payload: {
        planVersionFrom: 1,
        planVersionTo: 2,
        reason: 'Route R2 submerged by flood crest. Rerouting medical convoys to Elevated Bypass R4.',
        resourceAdjustmentNeeded: 'Recalculate fuel and turn times for Ambulances A-1 to A-8 via Bypass R4 (+14 KM).',
      },
    },
    {
      id: 'msg-05',
      sender: 'Resource Agent',
      receiver: 'Execution Agent',
      messageType: 'RESOURCE_SHRINK',
      timestamp: '00:00:25 ago',
      riskLevel: 'MEDIUM',
      payload: {
        reallocationConfirmed: true,
        dispatchedRoute: 'Elevated Bypass Route R4 (KM 14)',
        additionalDelayMinutes: 9,
        fleetStatus: '8 ALS Ambulances operational and re-vectored via GPS telemetry.',
      },
    },
    {
      id: 'msg-06',
      sender: 'Execution Agent',
      receiver: 'Verification Agent',
      messageType: 'VERIFY_REQUEST',
      timestamp: '00:00:10 ago',
      riskLevel: 'LOW',
      payload: {
        completedTask: 'task-14',
        action: 'Arrival and Triage intake at Shelter 1 (North Ridge)',
        survivorHeadcountReported: 1120,
        biometricSignaturesIndexed: 1120,
        evidenceAttached: ['biometric_manifest_sha256', 'gate_optical_count_feed'],
      },
    },
    {
      id: 'msg-07',
      sender: 'Verification Agent',
      receiver: 'Orchestration Bus',
      messageType: 'VERIFIED_AUDIT',
      timestamp: '00:00:02 ago',
      riskLevel: 'LOW',
      payload: {
        certificationStatus: 'VERIFIED_100_PERCENT',
        unassignedCasualties: 0,
        cryptographicProofHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        auditLedgerAppended: true,
      },
    },
  ]);

  const agents = [
    {
      name: 'Planning Agent' as const,
      role: 'Goal Decomposition & DAG Synthesis',
      icon: Brain,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      currentStatus: 'Synthesizing Plan v' + selectedPlanVersion,
      activeTasks: 3,
      latency: '84ms',
      responsibility: 'Transforms objectives into executable DAGs, establishes critical path, determines dependencies.',
    },
    {
      name: 'Execution Agent' as const,
      role: 'Tool Dispatch & Agentic State Machine',
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'border-blue-200 dark:border-blue-800',
      currentStatus: 'Dispatched Ambulances via Bypass R4',
      activeTasks: 6,
      latency: '112ms',
      responsibility: 'Invokes external REST APIs and geospatial tools, drives state machine transitions, monitors execution.',
    },
    {
      name: 'Monitoring Agent' as const,
      role: 'Continuous Sub-Second Telemetry Sweep',
      icon: Radio,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/60',
      borderColor: 'border-rose-200 dark:border-rose-800',
      currentStatus: 'Monitoring Hydro Crest Sensor #12',
      activeTasks: 18,
      latency: '45ms',
      responsibility: 'Performs sub-second sweeps across weather radars, bridge stress gauges, water sensors, and GPS.',
    },
    {
      name: 'Resource Agent' as const,
      role: 'Dynamic Allocation & Scarcity Optimizer',
      icon: Package,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      borderColor: 'border-purple-200 dark:border-purple-800',
      currentStatus: 'Reallocated 8 Ambulances & 3 Shelters',
      activeTasks: 4,
      latency: '68ms',
      responsibility: 'Dynamically rebalances fleet, personnel, medical beds, and fuel reserves when shocks occur.',
    },
    {
      name: 'Verification Agent' as const,
      role: 'Objective Evidence & Cryptographic Audit',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      currentStatus: 'Certifying 3,390 Survivor Biometrics',
      activeTasks: 2,
      latency: '95ms',
      responsibility: 'Verifies real outcome evidence before certifying completion. Never assumes success without proof.',
    },
  ];

  const filteredMessages = messages.filter((m) => {
    const matchesAgent =
      activeAgentTab === 'all' || m.sender === activeAgentTab || m.receiver === activeAgentTab;
    const matchesType = filterType === 'all' || m.messageType === filterType;
    return matchesAgent && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>MULTI-AGENT COLLABORATION ARCHITECTURE</span>
            <span aria-hidden="true">·</span>
            <span>STRUCTURED ORCHESTRATION PROTOCOL</span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            5-Agent Collaborative Mission Orchestration Layer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Specialized autonomous agents collaborating in real time over a typed message exchange bus to plan, execute, monitor, reallocate resources, and verify outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            5 Agents Synchronized
          </span>
        </div>
      </div>

      {/* THE 5 SPECIALIZED AGENTS CARDS (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = activeAgentTab === agent.name;
          return (
            <div
              key={agent.name}
              onClick={() => setActiveAgentTab(isSelected ? 'all' : agent.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs space-y-3 ${
                isSelected
                  ? 'ring-2 ring-indigo-500 border-indigo-500 bg-white dark:bg-slate-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${agent.bgColor} ${agent.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {agent.latency}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-950 dark:text-white">
                  {agent.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 block leading-tight mt-0.5">
                  {agent.role}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>State:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 truncate">
                  {agent.currentStatus}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STRUCTURED INTER-AGENT MESSAGE PROTOCOL BUS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">
              Typed Inter-Agent Protocol Exchange Bus
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Live Feed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono"
            >
              <option value="all">All Message Types</option>
              <option value="TASK_DISPATCH">TASK_DISPATCH</option>
              <option value="TELEMETRY_ANOMALY">TELEMETRY_ANOMALY</option>
              <option value="REPLAN_DIRECTIVE">REPLAN_DIRECTIVE</option>
              <option value="RESOURCE_SHRINK">RESOURCE_SHRINK</option>
              <option value="VERIFY_REQUEST">VERIFY_REQUEST</option>
              <option value="VERIFIED_AUDIT">VERIFIED_AUDIT</option>
            </select>

            {activeAgentTab !== 'all' && (
              <button
                onClick={() => setActiveAgentTab('all')}
                className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear Filter ({activeAgentTab})
              </button>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{msg.sender}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{msg.receiver}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                    {msg.messageType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    msg.riskLevel === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse'
                      : msg.riskLevel === 'HIGH'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {msg.riskLevel}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>

              {/* JSON Payload Inspection Box */}
              <div className="p-3 bg-slate-950 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                <pre className="text-slate-300">{JSON.stringify(msg.payload, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
