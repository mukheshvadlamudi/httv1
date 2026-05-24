import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Compass, Star, CheckCircle } from "lucide-react";
import { Guide } from "../data/mock-guides";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  guideSlugs: string[];
  color: string;
  accentColor: string;
}

const PATHS: LearningPath[] = [
  {
    id: "path-safety",
    title: "Safe Device & Account Security",
    description: "Learn how to safeguard your accounts, create strong passwords, avoid scams, and set up backup locking codes.",
    difficulty: "Beginner",
    duration: "20 Mins",
    category: "Security",
    guideSlugs: ["strong-password", "gmail-password-reset", "two-factor-authentication", "spot-scam-email"],
    color: "bg-rose-50/50 border-rose-100 hover:border-rose-300",
    accentColor: "bg-rose-100 text-rose-700 border-rose-200"
  },
  {
    id: "path-ai",
    title: "AI Basics & Business Productivity",
    description: "Get started with AI tools safely and master converting standard drafts into official PDF formats.",
    difficulty: "Beginner",
    duration: "10 Mins",
    category: "Productivity & AI",
    guideSlugs: ["chatgpt-safety", "create-pdf-document"],
    color: "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300",
    accentColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    id: "path-everyday",
    title: "Daily Communications & Mobile Hacks",
    description: "Master downloading apps onto smartphones, joining Zoom video calls, and sharing files over Google Drive.",
    difficulty: "Beginner",
    duration: "15 Mins",
    category: "Communication",
    guideSlugs: ["install-android-app", "zoom-meeting-join", "share-google-drive", "update-iphone"],
    color: "bg-blue-50/50 border-blue-100 hover:border-blue-300",
    accentColor: "bg-blue-100 text-blue-700 border-blue-200"
  }
];

interface LearningPathsProps {
  onSelectGuide: (slug: string) => void;
  allGuides: Guide[];
  completedLessons: Record<string, boolean>;
}

export function LearningPaths({ onSelectGuide, allGuides, completedLessons }: LearningPathsProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Intro Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full">
          Structured roadmaps
        </span>
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-slate-900 mt-4 leading-tight tracking-tight">
          Beginner Learning Paths
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
          Don't know where to start? Follow our step-by-step pathways curated to guide seniors and beginners safely through everyday technology.
        </p>
      </div>

      {/* Pathways Grid */}
      <div className="space-y-8">
        {PATHS.map((path) => {
          // Calculate path progress
          const pathGuides = allGuides.filter((g) => path.guideSlugs.includes(g.slug));
          const completedCount = pathGuides.filter((g) => completedLessons[g.slug]).length;
          const progressPercent = pathGuides.length > 0 
            ? Math.round((completedCount / pathGuides.length) * 100) 
            : 0;

          return (
            <div 
              key={path.id}
              className={`soft-clay-card p-8 md:p-10 border bg-white flex flex-col lg:flex-row justify-between gap-8 transition-all ${path.color}`}
            >
              
              {/* Left Column: Path Info */}
              <div className="lg:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${path.accentColor}`}>
                    {path.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {path.duration} Total
                  </span>
                </div>

                <h3 className="font-sans font-bold text-xl md:text-2xl text-slate-900 leading-tight">
                  {path.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  {path.description}
                </p>

                {/* Progress bar card */}
                <div className="pt-4 max-w-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Path Progress: {progressPercent}% Completed
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {progressPercent === 100 && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline Guides list */}
              <div className="lg:w-1/2 bg-white/70 backdrop-blur-sm border border-slate-150 rounded-3xl p-6 relative">
                <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">
                  Syllabus Timeline ({pathGuides.length} Guides)
                </h4>

                {/* Vertical connected timeline */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2.5 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {pathGuides.map((guide, idx) => {
                    const isLessonDone = completedLessons[guide.slug];
                    
                    return (
                      <div 
                        key={guide.slug}
                        onClick={() => onSelectGuide(guide.slug)}
                        className="group cursor-pointer flex items-start gap-4 relative"
                      >
                        {/* Timeline Bullet Pin */}
                        <div className={`absolute -left-6.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                          isLessonDone 
                            ? "bg-emerald-500 border-emerald-500" 
                            : "bg-white border-slate-300 group-hover:border-slate-800"
                        }`} />

                        <div className="flex-1 bg-slate-50/50 border border-slate-100 hover:border-slate-350 p-3.5 rounded-2xl transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Step {idx + 1}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                              {guide.estimatedMinutes} mins
                            </span>
                          </div>
                          
                          <h5 className="text-xs font-bold text-slate-950 mt-1 flex items-center gap-1.5">
                            {guide.title}
                            {isLessonDone && (
                              <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-50 shrink-0" />
                            )}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {guide.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
