/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MissionProvider, useMission } from './store/missionContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { MissionsList } from './pages/MissionsList';
import { MissionCreator } from './pages/MissionCreator';
import { MissionPlannerGraph } from './pages/MissionPlannerGraph';
import { ExecutionCenter } from './pages/ExecutionCenter';
import { ResourceCenterView } from './pages/ResourceCenterView';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { ToolOrchestratorView } from './pages/ToolOrchestratorView';
import { TacticalMapView } from './pages/TacticalMapView';
import { DocumentCenterView } from './pages/DocumentCenterView';
import { AnalyticsView } from './pages/AnalyticsView';
import { AuditLogView } from './pages/AuditLogView';
import { AITacticalChatView } from './pages/AITacticalChatView';
import { AuthPages } from './pages/AuthPages';
import { DigitalTwinView } from './pages/DigitalTwinView';
import { MultiAgentCollabView } from './pages/MultiAgentCollabView';
import { PredictiveFailureView } from './pages/PredictiveFailureView';
import { MissionMemoryView } from './pages/MissionMemoryView';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const { startHackathonDemo, setActiveMissionId } = useMission();

  const handleLaunchMissionFromLanding = () => {
    setCurrentView('create-mission');
  };

  const handleEnterDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleRunDemoFromLanding = () => {
    startHackathonDemo();
    setCurrentView('planner');
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchMission={handleLaunchMissionFromLanding}
        onEnterDashboard={handleEnterDashboard}
        onRunDemo={handleRunDemoFromLanding}
      />
    );
  }

  return (
    <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'dashboard' && (
        <DashboardOverview
          onLaunchNewMission={() => setCurrentView('create-mission')}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'missions' && (
        <MissionsList
          onSelectMission={(id) => {
            setActiveMissionId(id);
            setCurrentView('planner');
          }}
          onLaunchNew={() => setCurrentView('create-mission')}
        />
      )}

      {currentView === 'create-mission' && (
        <MissionCreator
          onMissionCreated={(id) => {
            setActiveMissionId(id);
            setCurrentView('planner');
          }}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'planner' && <MissionPlannerGraph />}

      {currentView === 'digital-twin' && <DigitalTwinView />}

      {currentView === 'agents' && <MultiAgentCollabView />}

      {currentView === 'predictive' && <PredictiveFailureView />}

      {currentView === 'memory' && <MissionMemoryView />}

      {currentView === 'execution' && <ExecutionCenter />}

      {currentView === 'resources' && <ResourceCenterView />}

      {currentView === 'simulator' && <WhatIfSimulator />}

      {currentView === 'tools' && <ToolOrchestratorView />}

      {currentView === 'tactical-map' && <TacticalMapView />}

      {currentView === 'documents' && <DocumentCenterView />}

      {currentView === 'analytics' && <AnalyticsView />}

      {currentView === 'audit' && <AuditLogView />}

      {currentView === 'ai-chat' && <AITacticalChatView />}

      {currentView === 'settings' && (
        <AuthPages onAuthSuccess={() => setCurrentView('dashboard')} />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <MissionProvider>
      <AppContent />
    </MissionProvider>
  );
}
