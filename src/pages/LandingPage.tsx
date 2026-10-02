import React from 'react';
import { useMission } from '../store/missionContext';
import { ThemeToggle, LanguageSelector } from '../components/ThemeAndLanguageControls';
import {
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Play,
  Flame,
  Wheat,
  Building,
  HeartPulse,
  Car,
  Package,
  Wrench,
  GraduationCap,
  Briefcase,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC<{
  onLaunchMission: () => void;
  onEnterDashboard: () => void;
  onRunDemo: () => void;
}> = ({ onLaunchMission, onEnterDashboard, onRunDemo }) => {
  const { t, language, activeMission } = useMission();

  const workflowSteps = [
    {
      title: language === 'hi' ? 'लक्ष्य अंतर्ग्रहण' : language === 'mr' ? 'उद्दिष्ट आकलन' : 'Goal Ingestion',
      desc: language === 'hi' ? 'प्राकृतिक भाषा उद्देश्य एवं सीमाएं' : language === 'mr' ? 'नैसर्गिक भाषा ध्येय व मर्यादा' : 'Natural language real-world objectives & constraints',
      icon: '01',
    },
    {
      title: language === 'hi' ? 'कार्य विभाजन' : language === 'mr' ? 'काम विभाजन' : 'Decomposition',
      desc: language === 'hi' ? 'निर्भरता ग्राफ एवं उपकरण आवंटन' : language === 'mr' ? 'अवलंबित्व आलेख व साधन वाटप' : 'Dependency graph synthesis & tool allocation',
      icon: '02',
    },
    {
      title: language === 'hi' ? 'समानांतर निष्पादन' : language === 'mr' ? 'समांतर अंमलबजावणी' : 'Parallel Execution',
      desc: language === 'hi' ? 'रीयल-टाइम एपीआई द्वारा स्वायत्त प्रेषण' : language === 'mr' ? 'थेट एपीआय द्वारे स्वायत्त कृती' : 'Autonomous dispatch through real-time APIs',
      icon: '03',
    },
    {
      title: language === 'hi' ? 'निरंतर निगरानी' : language === 'mr' ? 'सतत देखरेख' : 'Continuous Monitoring',
      desc: language === 'hi' ? 'सब-सेकंड विसंगति व मौसम ट्रैकिंग' : language === 'mr' ? 'अतिजलद अडथळा व हवामान शोध' : 'Sub-second anomaly, sensor & weather sweep',
      icon: '04',
    },
    {
      title: language === 'hi' ? 'अनुकूलनीय पुनर्योजना' : language === 'mr' ? 'लवचिक पुनर्नियोजन' : 'Adaptive Re-planning',
      desc: language === 'hi' ? 'गतिशील पुनः मार्ग निर्धारण एवं संसाधन संतुलन' : language === 'mr' ? 'मार्ग बदल व संसाधन पुनर्वाटप' : 'Dynamic rerouting & resource reallocation',
      icon: '05',
    },
    {
      title: language === 'hi' ? 'मानवीय शासन' : language === 'mr' ? 'मानवी मंजुरी' : 'Human Governance',
      desc: language === 'hi' ? 'उच्च-प्रभाव निर्णयों के लिए स्वीकृति द्वार' : language === 'mr' ? 'संवेदनशील कृतींसाठी पूर्वपरवानगी' : 'Risk-gated approval for high-impact directives',
      icon: '06',
    },
    {
      title: language === 'hi' ? 'सत्यापन व समापन' : language === 'mr' ? 'पडताळणी व पूर्तता' : 'Verification',
      desc: language === 'hi' ? 'उद्देश्य साक्ष्य ऑडिट एवं अंतिम डोजियर' : language === 'mr' ? 'पुरावे तपासणी व अंतिम अहवाल' : 'Objective evidence audit & incident dossier',
      icon: '07',
    },
  ];

  const domains = [
    {
      name: t.domains.emergency,
      icon: Flame,
      example: language === 'hi' ? 'बाढ़ निकासी व बहु-आश्रय समन्वय' : language === 'mr' ? 'पूर बचाव व निवारा समन्वय' : 'Flash flood triage & multi-shelter evacuation',
      accent: 'text-rose-500 bg-rose-500/10',
    },
    {
      name: t.domains.disaster,
      icon: Shield,
      example: language === 'hi' ? 'भूकंप उपरांत ड्रोन सहायता गलियारे' : language === 'mr' ? 'भूकंपोत्तर ड्रोन पुरवठा मार्ग' : 'Post-earthquake drone airdrop corridors',
      accent: 'text-amber-500 bg-amber-500/10',
    },
    {
      name: t.domains.agriculture,
      icon: Wheat,
      example: language === 'hi' ? 'उपग्रह फसल नुकसान सत्यापन व दावा' : language === 'mr' ? 'उपग्रह पीक नुकसान पडताळणी' : 'Satellite crop damage verification & claim DBT',
      accent: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      name: t.domains.government,
      icon: Building,
      example: language === 'hi' ? 'बहु-विभागीय नागरिक अधिकार ऑडिट' : language === 'mr' ? 'शासकीय सेवा व योजना एकत्रीकरण' : 'Multi-department citizen entitlement audit',
      accent: 'text-blue-500 bg-blue-500/10',
    },
    {
      name: t.domains.healthcare,
      icon: HeartPulse,
      example: language === 'hi' ? 'क्षेत्रीय आईसीयू बिस्तर व ऑक्सीजन संतुलन' : language === 'mr' ? 'रुग्णालय खाटा व ऑक्सिजन संतुलन' : 'Regional ICU bed & liquid oxygen balancing',
      accent: 'text-rose-400 bg-rose-400/10',
    },
    {
      name: t.domains.accident,
      icon: Car,
      example: language === 'hi' ? 'राजमार्ग बहु-वाहन आपातकालीन गलियारा' : language === 'mr' ? 'महामार्ग बहु-वाहन मदत कार्य' : 'Multi-vehicle highway pileup trauma corridor',
      accent: 'text-amber-600 bg-amber-600/10',
    },
    {
      name: t.domains.logistics,
      icon: Package,
      example: language === 'hi' ? 'अंतिम छोर तक आवश्यक वैक्सीन कोल्ड-चेन' : language === 'mr' ? 'लस शीत-साखळी पुरवठा समन्वय' : 'Disrupted cold-chain insulin reroute',
      accent: 'text-cyan-500 bg-cyan-500/10',
    },
    {
      name: t.domains.industrial,
      icon: Wrench,
      example: language === 'hi' ? 'रिफाइनरी गैस रिसाव शटडाउन' : language === 'mr' ? 'रिफायनरी गळती सुरक्षा कार्य' : 'Refinery toxic flare containment sequence',
      accent: 'text-orange-500 bg-orange-500/10',
    },
    {
      name: t.domains.career,
      icon: GraduationCap,
      example: language === 'hi' ? 'आईआईटी प्रवेश व छात्रवृत्ति पूर्णता' : language === 'mr' ? 'आयआयटी प्रवेश व शिष्यवृत्ती प्रक्रिया' : 'Multi-university credential & visa pipeline',
      accent: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      name: t.domains.project,
      icon: Briefcase,
      example: language === 'hi' ? 'शून्य-डाउनटाइम बैंकिंग डेटाबेस कटओवर' : language === 'mr' ? 'बँकिंग डेटाबेस शून्य-डाउनटाइम स्थलांतर' : 'Zero-downtime banking ledger migration',
      accent: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Hero Header Nav */}
      <header className="border-b border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-950 dark:text-white leading-none">
              PLANOVA<span className="text-indigo-600 dark:text-indigo-400 font-light ml-0.5">AI</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              {t.tagline}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Language Selector */}
          <LanguageSelector variant="dropdown" />

          {/* Active Theme Toggle */}
          <ThemeToggle showLabel={false} />

          <button
            onClick={onEnterDashboard}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-3 py-1.5 transition-colors cursor-pointer hidden sm:inline-block"
          >
            {t.nav.dashboard}
          </button>

          <button
            onClick={onRunDemo}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold">{t.runFlagshipDemo}</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 pt-16 pb-14 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 rounded-full text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t.landing.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.12]">
          PLANOVA AI
          <span className="block text-2xl sm:text-4xl font-medium text-slate-500 dark:text-slate-400 mt-2 font-mono">
            {t.tagline}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroDescription}
        </p>

        {/* Primary Call to Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onLaunchMission}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{t.launchMission}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRunDemo}
            className="px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold rounded-xl border border-slate-200/90 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <Play className="w-4 h-4 fill-current text-amber-500" />
            <span>{t.viewLiveDemo}</span>
          </button>
          <button
            onClick={onEnterDashboard}
            className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t.exploreHowItWorks} →
          </button>
        </div>

        {/* LIVE MISSION PREVIEW CARD (Requirement 5) */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  {t.landing.previewTitle}
                </span>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {t.landing.missionName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {t.landing.adaptiveStatus}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 py-1 font-mono text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.tasks}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">24</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.completed}</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">14</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.inProgress}</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">6</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.waitingAppr}</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">2</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.replanned}</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">{t.landing.system}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-1.5">{t.landing.operational}</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{t.landing.progressText}</span>
                <span>{t.landing.etaText}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '58%' }}></div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                {t.landing.disruptionHandled}
              </span>
              <button
                onClick={onEnterDashboard}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 text-xs cursor-pointer"
              >
                {t.landing.inspectConsole}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL MISSION PIPELINE SECTION */}
      <section className="py-12 border-y border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
              Autonomous Lifecycle
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {t.landing.pipelineTitle}
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.pipelineSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50/80 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {step.icon}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                </div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">{step.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 REAL-WORLD DOMAINS GRID */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
            {t.landing.domainsTitle}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {t.landing.domainsSubtitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            {t.landing.domainsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {domains.map((dom, i) => {
            const Icon = dom.icon;
            return (
              <div
                key={i}
                onClick={onEnterDashboard}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md group space-y-2 shadow-xs"
              >
                <div className={`p-2.5 w-fit rounded-lg ${dom.accent} transition-colors`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {dom.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {dom.example}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200/90 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 font-mono bg-white dark:bg-slate-950">
        <p>{t.landing.footerTag}</p>
        <p className="text-[10px] text-slate-400 mt-1">
          {t.landing.footerSub}
        </p>
      </footer>
    </div>
  );
};
