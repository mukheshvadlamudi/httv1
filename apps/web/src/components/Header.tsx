import React from "react";
import { Settings, BookOpen, Cpu, Sparkles } from "lucide-react";

interface HeaderProps {
  currentTrack: "everyday" | "developer";
  onTrackChange: (track: "everyday" | "developer") => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export function Header({ currentTrack, onTrackChange, onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Brand Identity / Dotted Logo */}
      <div className="flex items-center gap-3">
        {/* Dotted 3x3 grid logo matching The AI School */}
        <div className="grid grid-cols-3 gap-1 w-6 h-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-sm w-1.5 h-1.5" />
          ))}
        </div>
        <div>
          <h1 className="font-sans font-bold text-lg text-slate-900 leading-none flex items-center gap-1.5">
            How to Tech
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-md">
              MVP
            </span>
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            by Futurelab Studios
          </p>
        </div>
      </div>

      {/* Navigation / Track Switches */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full">
          <button
            onClick={() => onTrackChange("everyday")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTrack === "everyday"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Everyday Tech
          </button>
          <button
            onClick={() => onTrackChange("developer")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTrack === "developer"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Developer Hub
          </button>
        </nav>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Configure API Key"
          >
            <Settings className="w-4 h-4" />
            {hasApiKey && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
