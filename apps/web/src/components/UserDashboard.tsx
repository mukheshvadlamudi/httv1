import React from "react";
import { User, BookOpen, Star, Compass, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Guide } from "../data/mock-guides";

interface UserDashboardProps {
  bookmarks: string[];
  allGuides: Guide[];
  completedLessons: Record<string, boolean>;
  onSelectGuide: (slug: string) => void;
  onNavigateToView: (view: "landing" | "library" | "paths" | "tools") => void;
}

export function UserDashboard({
  bookmarks,
  allGuides,
  completedLessons,
  onSelectGuide,
  onNavigateToView
}: UserDashboardProps) {
  
  // Mapped bookmarked guides
  const bookmarkedGuides = allGuides.filter((g) => bookmarks.includes(g.slug));

  // Checklist counts
  const completedCount = allGuides.filter((g) => completedLessons[g.slug]).length;
  const overallPercent = allGuides.length > 0 
    ? Math.round((completedCount / allGuides.length) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      
      {/* Upper Profile Banner */}
      <div className="soft-clay-card p-8 md:p-10 border bg-white flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-60" />
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center border border-slate-700 shadow-md">
          <User className="w-8 h-8" />
        </div>

        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-md">
            Learning Explorer
          </span>
          <h3 className="font-sans font-bold text-2xl text-slate-900 mt-1">
            Welcome back, Explorer!
          </h3>
          <p className="text-slate-500 text-xs">
            Review your saved guide sheets, bookmark catalogs, and learning pathways.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="soft-clay-card p-6 bg-white border border-slate-100/50 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Bookmarked Guides
            </span>
            <span className="font-sans font-bold text-lg text-slate-900 mt-0.5 block">
              {bookmarks.length} Guides Saved
            </span>
          </div>
        </div>

        <div className="soft-clay-card p-6 bg-white border border-slate-100/50 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Lessons Mastered
            </span>
            <span className="font-sans font-bold text-lg text-slate-900 mt-0.5 block">
              {completedCount} of {allGuides.length} Done
            </span>
          </div>
        </div>

        <div className="soft-clay-card p-6 bg-white border border-slate-100/50 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Overall Progress
            </span>
            <span className="font-sans font-bold text-lg text-slate-900 mt-0.5 block">
              {overallPercent}% Complete
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: BOOKMARKS LIST (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-sans font-bold text-sm text-slate-900 pl-1">
            Your Bookmarked Guides
          </h4>

          {bookmarkedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedGuides.map((guide) => (
                <div 
                  key={guide.slug}
                  onClick={() => onSelectGuide(guide.slug)}
                  className="group cursor-pointer soft-clay-card p-6 border border-slate-100 bg-white hover:border-slate-350 transition-all rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                        {guide.category}
                      </span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    </div>
                    
                    <h5 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-slate-800 transition-colors line-clamp-1">
                      {guide.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 group-hover:text-slate-900 font-bold transition-colors">
                    <span>Read Sheet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-[2rem] p-12 text-center shadow-sm">
              <Star className="w-8 h-8 text-slate-300 mx-auto" />
              <h5 className="font-sans font-bold text-sm text-slate-900 mt-4">No bookmarks saved yet</h5>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                As you read our guides, click the star bookmark button in the top right to save them here for quick access.
              </p>
              <button 
                onClick={() => onNavigateToView("library")}
                className="mt-6 px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
              >
                Browse Library
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTION LINKS (Span 1) */}
        <div className="space-y-4">
          <h4 className="font-sans font-bold text-sm text-slate-900 pl-1">
            Quick Navigations
          </h4>

          <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-sm space-y-3">
            <button
              onClick={() => onNavigateToView("paths")}
              className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="text-xs font-bold text-slate-900">Learning Pathways</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Explore structured timeline tracks</p>
              </div>
              <Compass className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>

            <button
              onClick={() => onNavigateToView("tools")}
              className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="text-xs font-bold text-slate-900">Tech Tool Finder</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Compare pricing, ease, and safety</p>
              </div>
              <Compass className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
