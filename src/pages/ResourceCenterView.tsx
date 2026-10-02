import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { apiClient } from '../services/api';
import { ResourceItem } from '../types';
import {
  Truck,
  Building,
  Users,
  Shield,
  Clock,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ResourceCenterView: React.FC = () => {
  const { resources, triggerDisruption, setSelectedPlanVersion } = useMission();

  const [filterType, setFilterType] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredResources = resources.filter(
    (r) => filterType === 'all' || r.type === filterType
  );

  const handleAdjustFleet = (res: ResourceItem, delta: number) => {
    if (res.id === 'res-amb-als' && delta < 0) {
      // Trigger ambulance shortage shock!
      triggerDisruption('ambulance_reduced');
      setSelectedPlanVersion(3);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>MULTI-ECHELON RESOURCE ALLOCATION</span>
            <span aria-hidden="true">·</span>
            <span>SCARCITY REBALANCING</span>
          </div>
          <h1 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
            Resource Inventory & Fleet Strain
          </h1>
          <p className="text-xs text-zinc-500 max-w-2xl mt-1">
            Track vehicles, triage shelters, specialized medical personnel, and supplies across active operational theaters.
          </p>
        </div>

        {/* Quick Shortage Injection */}
        <button
          onClick={() => {
            triggerDisruption('ambulance_reduced');
            setSelectedPlanVersion(3);
          }}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Sudden Ambulance Reduction (8 → 5)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs overflow-x-auto">
        {['all', 'vehicle', 'shelter', 'personnel', 'equipment'].map((tp) => (
          <button
            key={tp}
            onClick={() => setFilterType(tp)}
            className={`px-3 py-1.5 font-medium rounded-lg capitalize transition-colors ${
              filterType === tp
                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tp === 'all' ? 'All Resources' : `${tp}s`}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const utilPct = Math.round((res.inUse / res.total) * 100);
          return (
            <div
              key={res.id}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                    {res.type.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mt-0.5">
                    {res.name}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize border ${
                    res.status === 'constrained' || res.status === 'critical'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  {res.status}
                </span>
              </div>

              {/* Progress and Numbers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Utilization Rate</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{utilPct}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      utilPct >= 90 ? 'bg-rose-500' : utilPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${utilPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-4 gap-1 p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg text-center font-mono text-[11px] border border-zinc-200/70 dark:border-zinc-800/70">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Total</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{res.total}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Avail</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{res.available}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Alloc</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{res.allocated}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">In Use</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{res.inUse}</span>
                </div>
              </div>

              {/* Operator Fleet Tuning Controls */}
              {res.type === 'vehicle' && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">Tune Available Pool:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdjustFleet(res, -1)}
                      className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
                      title="Simulate vehicle diversion"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold px-1.5 text-zinc-900 dark:text-zinc-100">
                      {res.total}
                    </span>
                    <button
                      onClick={() => handleAdjustFleet(res, 1)}
                      className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
                      title="Reinforce fleet"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
