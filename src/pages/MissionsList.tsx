import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import { Mission, MissionCategory } from '../types';
import {
  FolderGit2,
  Search,
  Filter,
  ArrowRight,
  Flame,
  Shield,
  Wheat,
  Building,
  HeartPulse,
  Car,
  Package,
  Wrench,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react';

export const MissionsList: React.FC<{
  onSelectMission: (id: string) => void;
  onLaunchNew: () => void;
}> = ({ onSelectMission, onLaunchNew }) => {
  const { missions, setActiveMissionId, t, language } = useMission();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMissions = missions.filter((m) => {
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getDomainIcon = (cat: MissionCategory) => {
    switch (cat) {
      case 'emergency':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'disaster':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'agriculture':
        return <Wheat className="w-4 h-4 text-emerald-500" />;
      case 'government':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'healthcare':
        return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'accident':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'logistics':
        return <Package className="w-4 h-4 text-cyan-500" />;
      case 'industrial':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'career':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'project':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      default:
        return <FolderGit2 className="w-4 h-4 text-slate-500" />;
    }
  };

  const getDomainLabel = (cat: MissionCategory) => {
    return t.domains[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{t.missionsList.kicker}</span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            {t.missionsList.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            {t.missionsList.subtitle}
          </p>
        </div>

        <button
          onClick={onLaunchNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <span>{t.dashboard.launchNew}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.missionsList.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 w-72"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono capitalize cursor-pointer focus:outline-hidden"
          >
            <option value="all">{t.missionsList.allDomains}</option>
            <option value="emergency">{t.domains.emergency}</option>
            <option value="disaster">{t.domains.disaster}</option>
            <option value="agriculture">{t.domains.agriculture}</option>
            <option value="government">{t.domains.government}</option>
            <option value="healthcare">{t.domains.healthcare}</option>
            <option value="accident">{t.domains.accident}</option>
            <option value="logistics">{t.domains.logistics}</option>
            <option value="industrial">{t.domains.industrial}</option>
            <option value="career">{t.domains.career}</option>
            <option value="project">{t.domains.project}</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500 font-medium">
          {filteredMissions.length} {t.missionsList.missionsLoaded}
        </span>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isComplete = mission.status === 'completed';
          return (
            <div
              key={mission.id}
              onClick={() => {
                setActiveMissionId(mission.id);
                onSelectMission(mission.id);
              }}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-md space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getDomainIcon(mission.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400">
                      <span>{getDomainLabel(mission.category)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        {t.missionCard.priority}: {mission.priority}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
                      {mission.title}
                    </h2>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                    isComplete
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {isComplete ? t.status.completed : t.status.executing}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {mission.objective}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.landing.tasks}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {mission.completedCount} / {mission.tasksCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.missionCard.eta}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {mission.eta}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.missionCard.location}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {mission.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {t.missionsList.inspectPlan} <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {t.missionCard.planVersion} v{mission.planVersion}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
