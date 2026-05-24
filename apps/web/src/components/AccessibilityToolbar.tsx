import React from "react";
import { Type, Eye, Palette, Sparkles, RefreshCw } from "lucide-react";

export type FontScale = "normal" | "large" | "extra";
export type ContrastTheme = "standard" | "pastel" | "highcontrast";

interface AccessibilityToolbarProps {
  fontScale: FontScale;
  onChangeFontScale: (scale: FontScale) => void;
  theme: ContrastTheme;
  onChangeTheme: (theme: ContrastTheme) => void;
}

export function AccessibilityToolbar({
  fontScale,
  onChangeFontScale,
  theme,
  onChangeTheme
}: AccessibilityToolbarProps) {
  return (
    <div className="w-full bg-slate-900 text-slate-300 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 text-[11px] font-medium shadow-inner relative z-[80]">
      {/* Visual Indicator */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>Accessibility Coaching Desk (Perfect for Seniors & Elders)</span>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* Font Scale Controllers */}
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <span>Text Size:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onChangeFontScale("normal")}
              className={`px-3 py-1 rounded-md transition-all ${
                fontScale === "normal"
                  ? "bg-slate-750 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Aa (Normal)
            </button>
            <button
              onClick={() => onChangeFontScale("large")}
              className={`px-3 py-1 rounded-md transition-all ${
                fontScale === "large"
                  ? "bg-slate-750 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Aa+ (Large)
            </button>
            <button
              onClick={() => onChangeFontScale("extra")}
              className={`px-3 py-1 rounded-md transition-all ${
                fontScale === "extra"
                  ? "bg-slate-750 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Aa++ (Huge)
            </button>
          </div>
        </div>

        {/* Visual Mode Themes */}
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Visual Layout:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onChangeTheme("standard")}
              className={`px-3 py-1 rounded-md transition-all ${
                theme === "standard"
                  ? "bg-slate-750 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => onChangeTheme("pastel")}
              className={`px-3 py-1 rounded-md transition-all ${
                theme === "pastel"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Soft Pastel
            </button>
            <button
              onClick={() => onChangeTheme("highcontrast")}
              className={`px-3 py-1 rounded-md transition-all ${
                theme === "highcontrast"
                  ? "bg-yellow-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              High Contrast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
