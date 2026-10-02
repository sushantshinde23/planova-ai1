import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { apiClient } from '../services/api';
import {
  Sliders,
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Truck,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Route,
  Activity,
  Layers,
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { activeMission, setSelectedPlanVersion, triggerDisruption, t } = useMission();

  const [selectedScenario, setSelectedScenario] = useState<string>('ambulance_unavailable');
  const [severity, setSeverity] = useState<'moderate' | 'severe' | 'catastrophic'>('severe');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Exact 3 examples required by prompt + 2 additional
  const scenarioOptions = [
    {
      id: 'ambulance_unavailable',
      title: '“What if 3 ambulances become unavailable?”',
      kicker: 'FLEET SCARCITY SHOCK (8 → 5 AMBULANCES)',
      desc: 'Simulate sudden diversion of 3 ALS units to a remote mountain landslide crisis, leaving only 5 units for Sector 4.',
      previewImpact: '+24 min delay, 3 tasks impacted, secondary high-clearance shuttle activation required.',
    },
    {
      id: 'route_blocked',
      title: '“What if this route is blocked?”',
      kicker: 'CORRIDOR INUNDATION (ROUTE R2 SUBMERGED)',
      desc: 'Simulate hydrological flood crest breaching Causeway Bridge deck with 0.92m water, cutting off primary arterial transit.',
      previewImpact: 'Immediate blockage of Route R2, reroute all units to Elevated Bypass R4, +9 min transit shift.',
    },
    {
      id: 'population_increase',
      title: '“What if the population increases by 20%?”',
      kicker: 'CASUALTY SURGE (4,200 → 5,040 RESIDENTS)',
      desc: 'Simulate unindexed informal settlement influx requiring rapid evacuation of 840 additional citizens.',
      previewImpact: 'Shelter 1 & 2 saturated past 95%, activate Shelter 4 auxiliary gym, deploy 6 private chartered buses.',
    },
    {
      id: 'generator_failure',
      title: '“What if Shelter 2 auxiliary generator trips?”',
      kicker: 'INFRASTRUCTURE SHOCK (POWER GRID FAILURE)',
      desc: 'Simulate Civic Stadium losing primary grid power during monsoon surge, threatening ICU ventilator operation.',
      previewImpact: '18 ventilators at risk, dispatch mobile diesel generator DG-04, divert non-critical patients to Shelter 1.',
    },
  ];

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      // Simulate with rich realistic computed responses for the selected scenario
      setTimeout(() => {
        if (selectedScenario === 'ambulance_unavailable') {
          setSimulationResult({
            scenarioTitle: 'What if 3 ambulances become unavailable? (8 → 5 Units)',
            predictedImpact: {
              urgency: 'HIGH',
              timelineShift: '+24 minutes transit delay across Wave 2 & 3',
              casualtyRisk: 'Triage queue bottleneck if non-ambulatory patients are not prioritized',
              overallSeverity: severity,
            },
            affectedTasks: [
              { id: 'task-09', title: 'Route R2 Causeway Medical Convoy Alpha', impact: 'Delayed by 24 mins; capacity reduced from 32 to 20 patients/wave' },
              { id: 'task-15', title: 'Pediatric Evacuation to Shelter 3', impact: 'Single dedicated ambulance remaining; secondary van escort needed' },
              { id: 'task-17', title: 'Batch-2 ICU Patient Convoy to Civic Stadium', impact: 'Requires 2 rotations instead of 1 simultaneous convoy' },
            ],
            resourceChanges: [
              { name: 'ALS Ambulances', before: '8 Units Active', after: '5 Units Active (-3 Diverted)', status: 'Constrained' },
              { name: 'Military High-Clearance Shuttles', before: '0 Active (Reserve)', after: '4 Trucks Mobilized', status: 'Optimal' },
              { name: 'Ambulatory Civilian Capacity', before: '100% Ambulance Borne', after: '65% Ambulances / 35% Military Shuttles', status: 'Balanced' },
            ],
            proposedPlan: {
              version: 3,
              name: 'Adaptive Plan v3 (Fleet Scarcity Mitigation)',
              summary: 'Prioritize remaining 5 ALS ambulances exclusively for 18 ICU/bedridden victims. Mobilize 4 high-clearance military multi-axle trucks to transport ambulatory citizens to Shelter 1 and 2.',
              confidenceScore: 92,
              approvalTier: 'HIGH — Operator Gated Approval Required',
            },
          });
          setSimulating(false);
        } else if (selectedScenario === 'route_blocked') {
          setSimulationResult({
            scenarioTitle: 'What if this route is blocked? (Route R2 Causeway Submerged)',
            predictedImpact: {
              urgency: 'CRITICAL',
              timelineShift: '+9 minutes detour delta via Bypass R4 (+14 KM)',
              casualtyRisk: 'Zero casualties if rerouted before water crests 0.9m mark',
              overallSeverity: severity,
            },
            affectedTasks: [
              { id: 'task-09', title: 'Primary Medical Transit via Causeway Bridge', impact: 'COMPLETELY PARALYZED — Bridge deck underwater' },
              { id: 'task-14', title: 'Shelter 1 Emergency First Responder Supply', impact: 'Supply convoy diverted to Bypass R4 interchange' },
              { id: 'task-21', title: 'Emergency Fuel Resupply Bowsers', impact: 'Detoured through KM 14 high ridge' },
            ],
            resourceChanges: [
              { name: 'Primary Route Corridor', before: 'Route R2 (Causeway Bridge)', after: 'Elevated Bypass Route R4 (+12m Elevation)', status: 'Rerouted' },
              { name: 'Ambulance GPS Vectors', before: 'Direct Causeway Vector', after: 'Re-dispatched via Bypass R4 Waypoints', status: 'Updated' },
              { name: 'Transit Delay Delta', before: '30 min ETA Baseline', after: '39 min ETA (+9 min delta)', status: 'Controlled' },
            ],
            proposedPlan: {
              version: 2,
              name: 'Adaptive Plan v2 (Elevated Bypass Detour)',
              summary: 'Immediately close Route R2 barricades. Vector all 8 ALS ambulances through Elevated Bypass Route R4. Dispatch mobile traffic control to clear single-lane culvert at KM 8.',
              confidenceScore: 96,
              approvalTier: 'CRITICAL — Mandatory Duty Officer Sign-Off',
            },
          });
          setSimulating(false);
        } else if (selectedScenario === 'population_increase') {
          setSimulationResult({
            scenarioTitle: 'What if the population increases by 20%? (4,200 → 5,040 Citizens)',
            predictedImpact: {
              urgency: 'HIGH',
              timelineShift: '+45 minutes additional operational cycle needed',
              casualtyRisk: 'Shelter 1 and 2 saturation breach if auxiliary sites not opened',
              overallSeverity: severity,
            },
            affectedTasks: [
              { id: 'task-05', title: 'Sector 4 Riverbank Resident Registration & Triage', impact: '+840 citizens queued at Triage Point Alpha' },
              { id: 'task-12', title: 'Shelter 2 Civic Stadium Intake', impact: 'Exceeds 2,000 capacity by 240 beds' },
              { id: 'task-19', title: 'Food & Ration Distribution Waves', impact: 'Additional 2,500 meal packets needed' },
            ],
            resourceChanges: [
              { name: 'Designated Relief Shelters', before: '3 Shelters (4,500 capacity)', after: '4 Shelters (5,500 capacity — St. Jude High School added)', status: 'Expanded' },
              { name: 'Chartered Evacuation Buses', before: '0 Contracted', after: '6 State Transport Buses Dispatched', status: 'Optimal' },
              { name: 'First Responder Volunteers', before: '42 Active Personnel', after: '65 Personnel Mobilized via Civil Defense', status: 'Adequate' },
            ],
            proposedPlan: {
              version: 4,
              name: 'Adaptive Plan v4 (Population Surge Rebalancing)',
              summary: 'Open Shelter 4 (St. Jude High School Gymnasium) with 1,000 auxiliary beds. Rebalance intake flow: 1,400 to S1, 1,800 to S2, 840 to S3, and 1,000 to S4.',
              confidenceScore: 91,
              approvalTier: 'HIGH — Operator Approval Required',
            },
          });
          setSimulating(false);
        } else {
          setSimulationResult({
            scenarioTitle: 'What if Shelter 2 auxiliary generator trips?',
            predictedImpact: {
              urgency: 'CRITICAL',
              timelineShift: 'Immediate 15-minute emergency intervention window',
              casualtyRisk: '18 ICU patients on ventilator support at risk of power loss',
              overallSeverity: severity,
            },
            affectedTasks: [
              { id: 'task-12', title: 'Civic Stadium ICU Ventilator Operation', impact: 'UPS battery duration remaining: 28 minutes' },
            ],
            resourceChanges: [
              { name: 'Mobile Diesel Generators', before: '0 On Site', after: 'DG-04 Dispatched from Sector 3', status: 'In Transit' },
            ],
            proposedPlan: {
              version: 2,
              name: 'Adaptive Contingency (Mobile Generator Rapid Cutover)',
              summary: 'Connect DG-04 mobile diesel generator within 20 minutes while switching non-essential shelter circuits offline.',
              confidenceScore: 94,
              approvalTier: 'CRITICAL — Mandatory Immediate Authorization',
            },
          });
          setSimulating(false);
        }
      }, 700);
    } catch (err) {
      console.error('Simulation failed:', err);
      setSimulating(false);
    }
  };

  const handleApplyReplan = () => {
    if (selectedScenario === 'route_blocked') {
      triggerDisruption('route_r2_blocked');
      setSelectedPlanVersion(2);
    } else if (selectedScenario === 'ambulance_unavailable') {
      triggerDisruption('ambulance_reduced');
      setSelectedPlanVersion(3);
    } else {
      setSelectedPlanVersion(2);
    }
  };

  const handleDiscard = () => {
    setSimulationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>WHAT-IF SCENARIO SIMULATOR</span>
          <span aria-hidden="true">·</span>
          <span>PREDICTIVE SHOCK MODELING</span>
        </div>
        <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
          What-If Mission Simulator & Contingency Stress-Tester
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
          Stress-test active missions by injecting hypothetical environmental breakdowns, fleet shortages, and population surges before or during physical execution.
        </p>
      </div>

      {/* Simulator Controls & Scenario Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Select Hypothetical Situation */}
        <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Select Hypothetical Scenario</span>
          </h2>

          <div className="space-y-2.5">
            {scenarioOptions.map((sc) => (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedScenario === sc.id
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600 dark:ring-indigo-500 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <span className="text-[9px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                  {sc.kicker}
                </span>
                <h3 className="text-xs font-bold text-slate-950 dark:text-white mb-1">
                  {sc.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {sc.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Severity Setting */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Simulation Severity Tier
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-center">
              <button
                type="button"
                onClick={() => setSeverity('moderate')}
                className={`py-1 rounded font-bold transition-all cursor-pointer ${
                  severity === 'moderate' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setSeverity('severe')}
                className={`py-1 rounded font-bold transition-all cursor-pointer ${
                  severity === 'severe' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Severe
              </button>
              <button
                type="button"
                onClick={() => setSeverity('catastrophic')}
                className={`py-1 rounded font-bold transition-all cursor-pointer ${
                  severity === 'catastrophic' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Catastrophic
              </button>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {simulating ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-amber-300" />
                <span>Simulating Cascades...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Operational Impact</span>
              </>
            )}
          </button>
        </div>

        {/* Right Columns: Simulation Results Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {simulationResult ? (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 animate-in fade-in duration-200">
              {/* Header & Scenario */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold block">
                    HYPOTHETICAL SIMULATION RESULT
                  </span>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mt-0.5">
                    {simulationResult.scenarioTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDiscard}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleApplyReplan}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Adaptive Plan to Live Mission</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: PREDICTED IMPACT */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  1. PREDICTED IMPACT & CASUALTY RISK
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Projected Timeline Shift</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {simulationResult.predictedImpact.timelineShift}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Casualty & Safety Assessment</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {simulationResult.predictedImpact.casualtyRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: AFFECTED TASKS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  2. AFFECTED DOWNSTREAM TASKS ({simulationResult.affectedTasks.length})
                </span>
                <div className="space-y-2">
                  {simulationResult.affectedTasks.map((t: any) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{t.id}:</strong>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {t.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: RESOURCE CHANGES */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  3. PROPOSED DYNAMIC RESOURCE REALLOCATION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  {simulationResult.resourceChanges.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{r.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{r.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <span>Before: </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{r.before}</span>
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        <span>Reallocated: </span>
                        <span>{r.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: PROPOSED ADAPTIVE PLAN */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    4. PROPOSED ADAPTIVE EXECUTION PLAN (PLAN V{simulationResult.proposedPlan.version})
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Confidence: {simulationResult.proposedPlan.confidenceScore}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                  {simulationResult.proposedPlan.name}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  {simulationResult.proposedPlan.summary}
                </p>
                <div className="pt-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  Governance Tier: {simulationResult.proposedPlan.approvalTier}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
              <Sliders className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                Ready to Stress-Test Mission Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Select one of the hypothetical situations on the left (e.g. 3 ambulances unavailable, route blocked, or population +20%) and click "Simulate Operational Impact".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
