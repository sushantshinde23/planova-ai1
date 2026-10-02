import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Mission,
  Task,
  PlanVersion,
  ResourceItem,
  ToolDefinition,
  ApprovalRequest,
  AuditLogEntry,
  DocumentRecord,
  User,
  UserRole,
} from '../types';
import { apiClient } from '../services/api';
import { Language, translations } from '../i18n/translations';
import {
  SEED_MISSIONS,
  SEED_TASKS_FLOOD,
  SEED_PLAN_VERSIONS,
  SEED_RESOURCES,
  SEED_TOOLS,
  SEED_APPROVALS,
  SEED_AUDIT_LOGS,
  SEED_DOCUMENTS,
} from '../data/seedData';

interface MissionContextType {
  missions: Mission[];
  activeMissionId: string;
  activeMission: Mission | undefined;
  tasks: Task[];
  plans: PlanVersion[];
  selectedPlanVersion: number;
  approvals: ApprovalRequest[];
  resources: ResourceItem[];
  tools: ToolDefinition[];
  auditLogs: AuditLogEntry[];
  documents: DocumentRecord[];
  analytics: any;
  language: Language;
  theme: 'light' | 'dark';
  currentUser: User;
  isDemoRunning: boolean;
  demoStep: number;
  isApprovalModalOpen: boolean;
  activeApproval: ApprovalRequest | null;
  t: typeof translations['en'];

  // Actions
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setUserRole: (role: UserRole) => void;
  setActiveMissionId: (id: string) => void;
  setSelectedPlanVersion: (v: number) => void;
  updateTaskStatus: (taskId: string, status: any) => Promise<void>;
  decideApproval: (id: string, decision: 'approved' | 'rejected', notes?: string) => Promise<void>;
  openApprovalModal: (appr: ApprovalRequest) => void;
  closeApprovalModal: () => void;
  triggerDisruption: (type: 'route_r2_blocked' | 'ambulance_reduced') => void;
  startHackathonDemo: () => void;
  stopHackathonDemo: () => void;
  stepDemoForward: () => void;
  resetDemo: () => void;
  addDocument: (doc: DocumentRecord) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>(SEED_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string>('mission-flood-evac-01');
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS_FLOOD);
  const [plans, setPlans] = useState<PlanVersion[]>(SEED_PLAN_VERSIONS);
  const [selectedPlanVersion, setSelectedPlanVersion] = useState<number>(2);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(SEED_APPROVALS);
  const [resources, setResources] = useState<ResourceItem[]>(SEED_RESOURCES);
  const [tools, setTools] = useState<ToolDefinition[]>(SEED_TOOLS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT_LOGS);
  const [documents, setDocuments] = useState<DocumentRecord[]>(SEED_DOCUMENTS);
  const [analytics, setAnalytics] = useState<any>({
    missionCompletionRate: 98.4,
    taskCompletionRate: 96.2,
    avgExecutionTimeMinutes: 44.5,
    avgReplanningLatencySeconds: 1.8,
    totalReplanningEvents: 14,
    failedTasksCount: 2,
    resourceUtilizationRate: 88.5,
    humanApprovalResponseMinutes: 3.2,
    toolSuccessRate: 99.4,
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('planova_language');
      if (saved === 'en' || saved === 'hi' || saved === 'mr') return saved;
    } catch {}
    return 'en';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('planova_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'light'; // Light mode by default as requested
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('planova_language', lang);
    } catch {}
  };

  const setTheme = (th: 'light' | 'dark') => {
    setThemeState(th);
    try {
      localStorage.setItem('planova_theme', th);
    } catch {}
  };

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-001',
    name: 'Sushant Shinde',
    email: 'sushantshinde5598@gmail.com',
    role: 'operator',
    department: 'Emergency & Civil Defense Operations',
  });

  // Demo flow state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [activeApproval, setActiveApproval] = useState<ApprovalRequest | null>(null);

  // Apply theme to HTML root & body synchronously and reliably
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (body) body.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      if (body) body.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Synchronize document lang attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Initial fetch from backend if available
  const refreshAll = useCallback(async () => {
    try {
      const [m, a, r, tl, ad, dc, an] = await Promise.all([
        apiClient.getMissions().catch(() => SEED_MISSIONS),
        apiClient.getApprovals().catch(() => SEED_APPROVALS),
        apiClient.getResources().catch(() => SEED_RESOURCES),
        apiClient.getTools().catch(() => SEED_TOOLS),
        apiClient.getAuditLogs().catch(() => SEED_AUDIT_LOGS),
        apiClient.getDocuments().catch(() => SEED_DOCUMENTS),
        apiClient.getAnalytics().catch(() => ({})),
      ]);
      setMissions(m);
      setApprovals(a);
      setResources(r);
      setTools(tl);
      setAuditLogs(ad);
      setDocuments(dc);
      if (an && an.missionCompletionRate) setAnalytics(an);

      if (activeMissionId) {
        const tks = await apiClient.getTasks(activeMissionId).catch(() => SEED_TASKS_FLOOD);
        setTasks(tks);
        const pls = await apiClient.getPlans(activeMissionId).catch(() => SEED_PLAN_VERSIONS);
        setPlans(pls);
      }
    } catch (err) {
      console.warn('Backend sync failed, maintaining robust local store:', err);
    }
  }, [activeMissionId]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Load mission tasks when activeMissionId changes
  useEffect(() => {
    if (activeMissionId === 'mission-flood-evac-01') {
      setTasks(SEED_TASKS_FLOOD);
      setPlans(SEED_PLAN_VERSIONS);
    } else {
      apiClient.getTasks(activeMissionId).then((t) => setTasks(t)).catch(() => {});
      apiClient.getPlans(activeMissionId).then((p) => setPlans(p)).catch(() => {});
    }
  }, [activeMissionId]);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const updateTaskStatus = async (taskId: string, status: any) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, completedTime: status === 'completed' ? new Date().toLocaleTimeString() : t.completedTime } : t))
    );
    try {
      await apiClient.updateTask(activeMissionId, taskId, { status });
    } catch {
      // local updated
    }
  };

  const decideApproval = async (id: string, decision: 'approved' | 'rejected', notes?: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: decision,
              decidedAt: new Date().toISOString(),
              decidedBy: currentUser.name,
              decisionNotes: notes,
            }
          : a
      )
    );

    // If approved, update the task in the mission
    const targetApproval = approvals.find((a) => a.id === id);
    if (targetApproval) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === targetApproval.taskId
            ? { ...t, status: decision === 'approved' ? 'completed' : 'failed', approvalStatus: decision }
            : t.id === 'task-21' && decision === 'approved'
            ? { ...t, status: 'in_progress' }
            : t
        )
      );

      // Add to audit trail
      const auditEntry: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        missionId: targetApproval.missionId,
        missionTitle: activeMission?.title || 'Flood Evacuation',
        agent: 'Human-in-the-Loop Gateway',
        action: `High-Impact Decision: ${decision.toUpperCase()} - ${targetApproval.action}`,
        user: currentUser.name,
        riskLevel: targetApproval.riskLevel,
        approvalRequired: true,
        approvalStatus: decision,
        result: decision === 'approved' ? 'success' : 'rejected',
        details: notes || `Operator ${decision} proposed route diversion & van requisition.`,
      };
      setAuditLogs((prev) => [auditEntry, ...prev]);
    }

    try {
      await apiClient.decideApproval(id, decision, notes);
    } catch {
      // local updated
    }
    setIsApprovalModalOpen(false);
  };

  const openApprovalModal = (appr: ApprovalRequest) => {
    setActiveApproval(appr);
    setIsApprovalModalOpen(true);
  };

  const closeApprovalModal = () => {
    setIsApprovalModalOpen(false);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    apiClient.setRole(role).catch(() => {});
  };

  // Triggering live real-time disruptions
  const triggerDisruption = (type: 'route_r2_blocked' | 'ambulance_reduced') => {
    if (type === 'route_r2_blocked') {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === 'task-09') return { ...t, status: 'replanning' as const };
          if (t.id === 'task-15') return { ...t, status: 'completed' as const };
          if (t.id === 'task-16') return { ...t, status: 'completed' as const };
          if (t.id === 'task-17') return { ...t, status: 'completed' as const };
          return t;
        })
      );
      setSelectedPlanVersion(2);
      setAuditLogs((prev) => [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          missionId: 'mission-flood-evac-01',
          missionTitle: 'Coordinate Flood Evacuation',
          agent: 'Monitoring Agent',
          action: 'Detected hydrological bridge overflow on Route R2 (+0.92m)',
          toolUsed: 'IoT Flood Sensor Stream',
          user: 'System Autonomous',
          riskLevel: 'critical',
          approvalRequired: false,
          result: 're-planned',
          details: 'Triggered immediate dependency cascade analysis across 6 transit tasks.',
        },
        ...prev,
      ]);
    } else if (type === 'ambulance_reduced') {
      setResources((prev) =>
        prev.map((r) => (r.id === 'res-amb-als' ? { ...r, total: 5, available: 5, inUse: 5, status: 'critical' as const } : r))
      );
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === 'task-18') return { ...t, status: 'completed' as const };
          if (t.id === 'task-19') return { ...t, status: 'completed' as const };
          if (t.id === 'task-20') return { ...t, status: 'waiting_approval' as const };
          return t;
        })
      );
      setSelectedPlanVersion(3);
      const targetAppr = approvals.find((a) => a.id === 'appr-01');
      if (targetAppr) {
        openApprovalModal(targetAppr);
      }
    }
  };

  // Flagship Demo Engine
  const startHackathonDemo = () => {
    setIsDemoRunning(true);
    setDemoStep(1);
    setActiveMissionId('mission-flood-evac-01');
    setSelectedPlanVersion(1);
  };

  const stopHackathonDemo = () => {
    setIsDemoRunning(false);
  };

  const stepDemoForward = () => {
    setDemoStep((prev) => {
      const next = prev + 1;
      if (next === 2) {
        // Plan v1 established
        setSelectedPlanVersion(1);
      } else if (next === 3) {
        // Execution running smoothly
        setTasks((tks) =>
          tks.map((t) => (['task-01', 'task-02', 'task-03', 'task-04', 'task-05', 'task-06'].includes(t.id) ? { ...t, status: 'completed' } : t))
        );
      } else if (next === 4) {
        // Disruption 1: Route R2 Blocked
        triggerDisruption('route_r2_blocked');
      } else if (next === 5) {
        // Adaptive Plan v2
        setSelectedPlanVersion(2);
      } else if (next === 6) {
        // Disruption 2: Ambulances 8 -> 5
        triggerDisruption('ambulance_reduced');
      } else if (next === 7) {
        // Human Approval
        const targetAppr = approvals.find((a) => a.id === 'appr-01');
        if (targetAppr) openApprovalModal(targetAppr);
      } else if (next === 8) {
        // Resumed execution & verification
        setTasks((tks) =>
          tks.map((t) => (t.id === 'task-20' ? { ...t, status: 'completed' } : t.id === 'task-21' || t.id === 'task-22' ? { ...t, status: 'completed' } : t.id === 'task-23' ? { ...t, status: 'verified' } : t))
        );
      } else if (next >= 9) {
        // Mission Completed
        setTasks((tks) => tks.map((t) => ({ ...t, status: 'verified' })));
        setMissions((ms) =>
          ms.map((m) =>
            m.id === 'mission-flood-evac-01'
              ? { ...m, status: 'completed' as const, progress: 100, completedCount: 24, inProgressCount: 0, waitingApprovalCount: 0 }
              : m
          )
        );
        setIsDemoRunning(false);
      }
      return next > 9 ? 9 : next;
    });
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setDemoStep(1);
    setTasks(SEED_TASKS_FLOOD.map((t) => ({ ...t })));
    setPlans(SEED_PLAN_VERSIONS.map((p) => ({ ...p })));
    setSelectedPlanVersion(2);
    setMissions(SEED_MISSIONS.map((m) => ({ ...m })));
    setResources(SEED_RESOURCES.map((r) => ({ ...r })));
    setApprovals(SEED_APPROVALS.map((a) => ({ ...a, status: 'pending' as const })));
  };

  const addDocument = async (docRecord: DocumentRecord) => {
    setDocuments((prev) => [docRecord, ...prev]);
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      missionId: activeMissionId,
      missionTitle: activeMission?.title || 'Active Mission',
      agent: 'Multimodal Ingestion Agent',
      action: `Ingested & Parsed: ${docRecord.name} (Source: ${docRecord.source || 'Upload'})`,
      toolUsed: 'Google Gemini 2.5 Flash Vision / Document OCR',
      user: currentUser.name,
      riskLevel: 'low',
      approvalRequired: false,
      result: 'success',
      details: `Extracted ${docRecord.extractedEntities.names.length} entities, ${docRecord.extractedEntities.locations.length} locations, and ${docRecord.extractedEntities.requirements.length} operational constraints.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const t = translations[language] || translations.en;

  return (
    <MissionContext.Provider
      value={{
        missions,
        activeMissionId,
        activeMission,
        tasks,
        plans,
        selectedPlanVersion,
        approvals,
        resources,
        tools,
        auditLogs,
        documents,
        analytics,
        language,
        theme,
        currentUser,
        isDemoRunning,
        demoStep,
        isApprovalModalOpen,
        activeApproval,
        t,
        setLanguage,
        setTheme,
        setUserRole,
        setActiveMissionId,
        setSelectedPlanVersion,
        updateTaskStatus,
        decideApproval,
        openApprovalModal,
        closeApprovalModal,
        triggerDisruption,
        startHackathonDemo,
        stopHackathonDemo,
        stepDemoForward,
        resetDemo,
        addDocument,
        refreshAll,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
