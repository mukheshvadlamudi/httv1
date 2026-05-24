import React from "react";
import { ArrowRight, Sparkles, Cpu, Mail, ShieldAlert, PhoneCall, Code, FileTerminal } from "lucide-react";

interface TrackSelectorProps {
  onSelectTrack: (track: "everyday" | "developer") => void;
}

export function TrackSelector({ onSelectTrack }: TrackSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 md:py-24">
      {/* Visual Subtitle and Dotted grid element */}
      <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full mb-4">
        Futurelab Learning Universe
      </span>
      
      {/* Centered Premium Headline */}
      <h2 className="text-center font-sans font-bold text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight max-w-2xl">
        What would you like to <span className="text-slate-500">master</span> today?
      </h2>
      <p className="text-center text-slate-500 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
        Choose a custom track designed specifically for your experience level. Everything is laid out in plain language.
      </p>

      {/* Grid of Two Neomorphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12 md:mt-16">
        {/* Card 1: Everyday Technology */}
        <div 
          onClick={() => onSelectTrack("everyday")}
          className="group cursor-pointer soft-clay-card p-8 md:p-10 flex flex-col justify-between hover:border-emerald-200/80 transition-all bg-white relative overflow-hidden"
        >
          {/* Accent pastel gradient background element */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10" />

          <div>
            {/* Header circular icon badge */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <Sparkles className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50/60 border border-emerald-100 px-2 py-0.5 rounded-md">
              Beginner-Friendly
            </span>

            <h3 className="font-sans font-bold text-2xl text-slate-900 mt-4 leading-tight">
              Everyday Technology
            </h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Simple, gentle guides for common tech tasks. Read big-font instructions, get AI coaching, and listen to spoken directions out loud.
            </p>

            {/* Simulated pills matching Piramal style */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <Mail className="w-3 h-3 text-slate-400" />
                Gmail Reset
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <ShieldAlert className="w-3 h-3 text-slate-400" />
                Spot Scams
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <PhoneCall className="w-3 h-3 text-slate-400" />
                Zoom Calls
              </span>
            </div>
          </div>

          <div className="mt-8 md:mt-10 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              No Tech Jargon
            </span>
            <button className="flex items-center gap-1 bg-slate-900 text-white rounded-full pl-5 pr-4 py-2 text-xs font-bold shadow-sm group-hover:bg-slate-800 transition-colors">
              Start Learning
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Developer & Tech Hub */}
        <div 
          onClick={() => onSelectTrack("developer")}
          className="group cursor-pointer soft-clay-card p-8 md:p-10 flex flex-col justify-between hover:border-blue-200/80 transition-all bg-white relative overflow-hidden"
        >
          {/* Accent blue gradient background element */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10" />

          <div>
            {/* Header circular icon badge */}
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <Cpu className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded-md">
              Advanced Track
            </span>

            <h3 className="font-sans font-bold text-2xl text-slate-900 mt-4 leading-tight">
              Developer Hub
            </h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Explore resources on modern frameworks, web architectures, backend engines, databases, security protocols, and machine learning models.
            </p>

            {/* Simulated pills matching Piramal style */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <Code className="w-3 h-3 text-slate-400" />
                MDN Web Docs
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <FileTerminal className="w-3 h-3 text-slate-400" />
                FastAPI & APIs
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <Cpu className="w-3 h-3 text-slate-400" />
                AI SDKs
              </span>
            </div>
          </div>

          <div className="mt-8 md:mt-10 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              140+ Resources Loaded
            </span>
            <button className="flex items-center gap-1 bg-slate-900 text-white rounded-full pl-5 pr-4 py-2 text-xs font-bold shadow-sm group-hover:bg-slate-800 transition-colors">
              Access Vault
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
