import React from "react";
import { Cpu, Sparkles, User, LogOut } from "lucide-react";

interface HeaderProps {
  currentTrack: "everyday" | "developer";
  onTrackChange: (track: "everyday" | "developer") => void;
  currentUser: { name: string; email: string } | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onSignOut: () => void;
}

export function Header({ 
  currentTrack, 
  onTrackChange, 
  currentUser, 
  onOpenAuth, 
  onOpenDashboard, 
  onSignOut 
}: HeaderProps) {
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

        {/* Right side Actions (Authentication / Profile Desk) */}
        <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 transition-all shadow-sm"
                title="View Explorer Panel"
              >
                <User className="w-3.5 h-3.5 text-slate-950" />
                <span className="line-clamp-1">{currentUser.name}</span>
              </button>
              <button
                onClick={onSignOut}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
