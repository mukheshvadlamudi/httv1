import React from "react";
import { ArrowRight, Clock, Award } from "lucide-react";
import { Guide } from "../data/mock-guides";

interface GuideCardProps {
  guide: Guide;
  onSelect: (slug: string) => void;
}

export function GuideCard({ guide, onSelect }: GuideCardProps) {
  // Pastel difficulty styling
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "Hard":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-100";
    }
  };

  return (
    <div 
      onClick={() => onSelect(guide.slug)}
      className="group cursor-pointer soft-clay-card p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 transition-all bg-white relative overflow-hidden h-full"
    >
      <div>
        {/* Categories & Difficulty */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
            {guide.category}
          </span>
          
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getDifficultyStyles(guide.difficulty)}`}>
              {guide.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-sans font-bold text-lg md:text-xl text-slate-900 mt-4 leading-snug group-hover:text-slate-800 transition-colors">
          {guide.title}
        </h3>
        
        <p className="text-slate-500 text-xs md:text-sm mt-2.5 leading-relaxed">
          {guide.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {guide.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-slate-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer block */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{guide.estimatedMinutes} mins</span>
        </div>
        
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white shadow-sm group-hover:bg-slate-800 transition-colors">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
