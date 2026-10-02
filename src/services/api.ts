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
} from '../types';

export const apiClient = {
  // Auth
  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async setRole(role: 'admin' | 'operator' | 'viewer'): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to set role');
    return res.json();
  },

  // Missions
  async getMissions(): Promise<Mission[]> {
    const res = await fetch('/api/missions');
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  async getMission(id: string): Promise<Mission & { tasks: Task[]; plans: PlanVersion[] }> {
    const res = await fetch(`/api/missions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch mission');
    return res.json();
  },

  async createMission(missionData: Partial<Mission>): Promise<Mission> {
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionData),
    });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    const res = await fetch(`/api/missions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update mission');
    return res.json();
  },

  // Tasks
  async getTasks(missionId: string): Promise<Task[]> {
    const res = await fetch(`/api/missions/${missionId}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async updateTask(missionId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`/api/missions/${missionId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  // Plans
  async getPlans(missionId: string): Promise<PlanVersion[]> {
    const res = await fetch(`/api/missions/${missionId}/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  },

  // Approvals
  async getApprovals(): Promise<ApprovalRequest[]> {
    const res = await fetch('/api/approvals');
    if (!res.ok) throw new Error('Failed to fetch approvals');
    return res.json();
  },

  async decideApproval(
    approvalId: string,
    decision: 'approved' | 'rejected',
    notes?: string
  ): Promise<{ success: boolean; approval: ApprovalRequest }> {
    const res = await fetch(`/api/approvals/${approvalId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes }),
    });
    if (!res.ok) throw new Error('Failed to process approval');
    return res.json();
  },

  // What-If Simulator
  async simulateScenario(
    missionId: string,
    scenarioType: string,
    severity: string,
    parameters?: any
  ): Promise<any> {
    const res = await fetch(`/api/missions/${missionId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioType, severity, parameters }),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    const res = await fetch('/api/resources');
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async updateResource(id: string, updates: Partial<ResourceItem>): Promise<ResourceItem> {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update resource');
    return res.json();
  },

  // Tools
  async getTools(): Promise<ToolDefinition[]> {
    const res = await fetch('/api/tools');
    if (!res.ok) throw new Error('Failed to fetch tools');
    return res.json();
  },

  async executeTool(
    toolId: string,
    inputPayload: any,
    reason: string,
    missionId?: string
  ): Promise<any> {
    const res = await fetch(`/api/tools/${toolId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputPayload, reason, missionId }),
    });
    if (!res.ok) throw new Error('Failed to execute tool');
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<DocumentRecord[]> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async uploadDocument(docData: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  // Audit & Analytics
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await fetch('/api/audit');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Gemini AI Agents
  async analyzeGoal(goal: string, domain?: string): Promise<any> {
    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, domain }),
    });
    if (!res.ok) throw new Error('Goal analysis failed');
    return res.json();
  },

  async generatePlan(goal: string, constraints?: any): Promise<any> {
    const res = await fetch('/api/gemini/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, constraints }),
    });
    if (!res.ok) throw new Error('Plan generation failed');
    return res.json();
  },

  async sendTacticalChat(messages: { role: string; content: string }[], missionContext?: any): Promise<{ reply: string }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, missionContext }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  },

  async lowLatencyTriage(eventSnippet: string): Promise<{ analysis: string }> {
    const res = await fetch('/api/gemini/low-latency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventSnippet }),
    });
    if (!res.ok) throw new Error('Triage failed');
    return res.json();
  },
};
