import React, { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink, Globe, Video, BookOpen, ChevronRight, ArrowLeft, CheckCircle, Code, Cpu, Shield, Sparkles, Layers, Award, PlayCircle, HelpCircle } from "lucide-react";
import vaultData from "../data/vault-resources.json";
import { SYLLABUS_TRACKS, SyllabusTrack, SyllabusChapter, QuizQuestion } from "../data/syllabus-data";
import { getResources } from "../lib/api";

interface VaultWebsite {
  id: number;
  resource: string;
  url: string;
  category: string | null;
  why_useful: string | null;
}

interface VaultVideo {
  id: number;
  channel: string;
  url: string;
}

// Custom helper to parse and format plain-language textbooks, rendering code blocks beautifully
const renderFormattedText = (text: string) => {
  if (!text) return null;
  
  // Split by code blocks ```[lang]\n[code]\n```
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      // Extract language and code snippet
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const lang = match ? match[1] : "code";
      const code = match ? match[2] : part.slice(3, -3);

      return (
        <div key={index} className="my-6 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs shadow-md">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold select-none">
            <span>{lang || "code"} template</span>
            <button 
              onClick={() => navigator.clipboard.writeText(code.trim())}
              className="hover:text-slate-300 transition-colors text-[9px]"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto whitespace-pre"><code className="leading-relaxed">{code.trim()}</code></pre>
        </div>
      );
    }

    // Standard markdown paragraphs, lists, and headings
    return (
      <div key={index} className="text-slate-600 text-sm md:text-base leading-relaxed font-normal whitespace-pre-line">
        {part.split("\n\n").map((subPart, subIndex) => {
          if (subPart.startsWith("### ")) {
            return (
              <h4 key={subIndex} className="font-sans font-bold text-base md:text-lg text-slate-900 mt-6 mb-3 first:mt-2">
                {subPart.slice(4)}
              </h4>
            );
          }
          if (subPart.startsWith("1. ") || subPart.startsWith("- ")) {
            return (
              <div key={subIndex} className="pl-4 my-3 text-slate-600 space-y-1">
                {subPart.split("\n").map((line, lineIdx) => (
                  <p key={lineIdx} className="list-item list-inside">{line}</p>
                ))}
              </div>
            );
          }
          return (
            <p key={subIndex} className="mt-4 first:mt-0 leading-relaxed text-slate-500">
              {subPart}
            </p>
          );
        })}
      </div>
    );
  });
};

export function KnowledgeVault() {
  // Navigation View State
  const [viewState, setViewState] = useState<"domains" | "subtracks" | "course">("domains");
  const [activeDomain, setActiveDomain] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<SyllabusTrack | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);

  // Lesson Completion State
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [vaultWebsites, setVaultWebsites] = useState<VaultWebsite[]>(vaultData.websites || []);
  const [vaultVideos, setVaultVideos] = useState<VaultVideo[]>(vaultData.youtube || []);

  // Quiz Attempt State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Load progress on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("how_to_tech_progress");
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getResources("website", 100), getResources("youtube", 100)])
      .then(([websites, youtube]) => {
        if (!isMounted) return;
        setVaultWebsites(
          websites.map((item) => ({
            id: item.id,
            resource: item.name,
            url: item.url,
            category: item.category,
            why_useful: item.whyUseful,
          }))
        );
        setVaultVideos(
          youtube.map((item, index) => ({
            id: index + 1,
            channel: item.name,
            url: item.url,
          }))
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setVaultWebsites(vaultData.websites || []);
        setVaultVideos(vaultData.youtube || []);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save progress
  const toggleLessonCompleted = (chapterId: string) => {
    const updated = {
      ...completedLessons,
      [chapterId]: !completedLessons[chapterId]
    };
    setCompletedLessons(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("how_to_tech_progress", JSON.stringify(updated));
    }
  };

  // Get active track chapters (handling Full Stack dynamic merging)
  const activeChapters = useMemo(() => {
    if (!selectedTrack) return [];
    
    // Dynamic Full Stack merging
    if (selectedTrack.id === "fullstack-dev") {
      const frontend = SYLLABUS_TRACKS.find(t => t.id === "frontend-dev")?.chapters || [];
      const backend = SYLLABUS_TRACKS.find(t => t.id === "backend-dev")?.chapters || [];
      
      const merged = [
        ...frontend.map((c, i) => ({ ...c, id: `fs-fe-${c.id}`, order: i + 1 })),
        ...backend.map((c, i) => ({ ...c, id: `fs-be-${c.id}`, order: frontend.length + i + 1 }))
      ];
      return merged;
    }
    
    return selectedTrack.chapters;
  }, [selectedTrack]);

  // Track progress calculation
  const trackProgress = useMemo(() => {
    if (activeChapters.length === 0) return 0;
    const completedCount = activeChapters.filter((c) => completedLessons[c.id]).length;
    return Math.round((completedCount / activeChapters.length) * 100);
  }, [activeChapters, completedLessons]);

  // Dynamic Full Stack track generation on select
  const handleSelectTrack = (trackId: string) => {
    if (trackId === "fullstack-dev") {
      const feQuiz = SYLLABUS_TRACKS.find(t => t.id === "frontend-dev")?.quiz || [];
      const beQuiz = SYLLABUS_TRACKS.find(t => t.id === "backend-dev")?.quiz || [];
      
      const fullStackTrack: SyllabusTrack = {
        id: "fullstack-dev",
        title: "Full-Stack Web Development",
        description: "The complete pathway merging Frontend interface design and Backend database API engineering.",
        domain: "webdev",
        category: "Full Stack",
        difficulty: "Advanced",
        chapters: [], // Dynamically loaded by activeChapters memo
        quiz: [...feQuiz, ...beQuiz]
      };
      
      setSelectedTrack(fullStackTrack);
    } else {
      const track = SYLLABUS_TRACKS.find((t) => t.id === trackId) || null;
      setSelectedTrack(track);
    }
    
    setViewState("course");
    setActiveChapterIndex(0);
    setIsQuizMode(false);
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  // Get Excel vault documentation resources for active chapter
  const currentDocs = useMemo(() => {
    if (activeChapters.length === 0 || activeChapterIndex >= activeChapters.length) return [];
    const chapter = activeChapters[activeChapterIndex];
    const websites = vaultWebsites || [];
    return websites.filter((w) => chapter.documentIds.includes(w.id));
  }, [activeChapters, activeChapterIndex, vaultWebsites]);

  // Get Excel vault YouTube channels for active chapter
  const currentVideos = useMemo(() => {
    if (activeChapters.length === 0 || activeChapterIndex >= activeChapters.length) return [];
    const chapter = activeChapters[activeChapterIndex];
    const youtubeList = vaultVideos || [];
    return youtubeList.filter((y) => chapter.youtubeIds.includes(y.id));
  }, [activeChapters, activeChapterIndex, vaultVideos]);

  // Handle quiz question answer
  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Calculate Quiz Score
  const quizScore = useMemo(() => {
    if (!selectedTrack) return { score: 0, total: 0 };
    const quizSet = selectedTrack.quiz;
    let correctCount = 0;
    quizSet.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIdx) {
        correctCount++;
      }
    });
    return { score: correctCount, total: quizSet.length };
  }, [selectedTrack, quizAnswers]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      
      {/* ==================== VIEW 1: DOMAIN SELECTION GRID ==================== */}
      {viewState === "domains" && (
        <div className="space-y-12">
          {/* Welcome Banner */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-lg">
            {/* Ambient visual gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />
            
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Developer Academy
            </span>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mt-4">
              Learn Engineering <br className="hidden sm:inline" />
              in <span className="text-blue-400">plain English</span>.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl leading-relaxed">
              No jargon roadblocks. Read comprehensive course textbooks directly on-site and explore reference documentations from the Futurelab Vault.
            </p>
          </div>

          {/* Grid Selection */}
          <div className="space-y-6">
            <h3 className="font-sans font-bold text-base text-slate-900 pl-1">
              Select Your Learning Domain
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Web Development */}
              <div 
                onClick={() => {
                  setActiveDomain("webdev");
                  setViewState("subtracks");
                }}
                className="group cursor-pointer soft-clay-card p-6 md:p-8 flex flex-col justify-between hover:border-blue-200 transition-all bg-white relative overflow-hidden h-64"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-60 -mr-6 -mt-6" />
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                    <Code className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-900 mt-2">
                    Web Development
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Master Frontend UI libraries, client server requests, and backend database integrations.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                  <span>3 Tracks Available</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 2: AI & Machine Learning */}
              <div 
                onClick={() => handleSelectTrack("ai-engineering")}
                className="group cursor-pointer soft-clay-card p-6 md:p-8 flex flex-col justify-between hover:border-emerald-200 transition-all bg-white relative overflow-hidden h-64"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-60 -mr-6 -mt-6" />
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-900 mt-2">
                    AI & Machine Learning
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Build products with LLM APIs, construct structured prompts, and implement open-source Hugging Face models.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                  <span>Syllabus Active</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 3: Security Engineering */}
              <div 
                onClick={() => handleSelectTrack("security-eng")}
                className="group cursor-pointer soft-clay-card p-6 md:p-8 flex flex-col justify-between hover:border-rose-200 transition-all bg-white relative overflow-hidden h-64"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl opacity-60 -mr-6 -mt-6" />
                <div>
                  <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-900 mt-2">
                    Security Engineering
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Study OWASP web vulnerabilities, sanitize database queries, and secure session authentications.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                  <span>Syllabus Active</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 4: UX & Digital Accessibility */}
              <div 
                onClick={() => handleSelectTrack("ux-design")}
                className="group cursor-pointer soft-clay-card p-6 md:p-8 flex flex-col justify-between hover:border-amber-200 transition-all bg-white relative overflow-hidden h-64"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-60 -mr-6 -mt-6" />
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-900 mt-2">
                    Design & Accessibility
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Learn core laws of UX and WCAG standards to build semantic, keyboard-navigable applications.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                  <span>Syllabus Active</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 5: Web Blockchain (Placeholder) */}
              <div className="group soft-clay-card p-6 md:p-8 flex flex-col justify-between bg-slate-50 border-dashed border-slate-200 opacity-75 h-64 relative overflow-hidden cursor-not-allowed">
                <div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-400 mt-2">
                    Web Blockchain
                  </h4>
                  <p className="text-slate-400/80 text-xs mt-2 leading-relaxed">
                    Understanding distributed web ledgers, smart contracts, and Web3 frameworks.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Syllabus Coming Soon</span>
                </div>
              </div>

              {/* Card 6: 3D Graphics (Placeholder) */}
              <div className="group soft-clay-card p-6 md:p-8 flex flex-col justify-between bg-slate-50 border-dashed border-slate-200 opacity-75 h-64 relative overflow-hidden cursor-not-allowed">
                <div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-slate-400 mt-2">
                    3D & Creative Tech
                  </h4>
                  <p className="text-slate-400/80 text-xs mt-2 leading-relaxed">
                    Study immersive three-dimensional visual libraries (Three.js) and custom render pipelines.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Syllabus Coming Soon</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: SUB-TRACK SELECTOR (WEB DEV SUB-CHANNELS) ==================== */}
      {viewState === "subtracks" && (
        <div className="space-y-8 max-w-3xl mx-auto py-6">
          <button 
            onClick={() => setViewState("domains")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Domains
          </button>

          <div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Web Development Paths
            </span>
            <h2 className="font-sans font-bold text-2xl md:text-4xl text-slate-900 mt-4 leading-snug">
              Choose your Web Development track
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2 leading-relaxed">
              We arrange resources from beginner to advanced. Choose Front-end, Back-end, or master the full pipeline sequentially.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {/* Frontend Option */}
            <div 
              onClick={() => handleSelectTrack("frontend-dev")}
              className="group cursor-pointer soft-clay-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all bg-white relative overflow-hidden"
            >
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Category: UI & Interaction
                </span>
                <h4 className="font-sans font-bold text-base text-slate-900">
                  Front-end Path
                </h4>
                <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                  Learn HTML/CSS styles, raw interactive JS/TS, React component states, Next.js page models, and unit testing.
                </p>
              </div>
              <button className="flex items-center gap-1 mt-6 text-[10px] font-bold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                Select Path
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Backend Option */}
            <div 
              onClick={() => handleSelectTrack("backend-dev")}
              className="group cursor-pointer soft-clay-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all bg-white relative overflow-hidden"
            >
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Category: APIs & Storage
                </span>
                <h4 className="font-sans font-bold text-base text-slate-900">
                  Back-end Path
                </h4>
                <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                  Learn Python API creation with FastAPI, PostgreSQL relational modeling, database indexes, and memory caching with Redis.
                </p>
              </div>
              <button className="flex items-center gap-1 mt-6 text-[10px] font-bold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                Select Path
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Full Stack Option */}
            <div 
              onClick={() => handleSelectTrack("fullstack-dev")}
              className="group cursor-pointer soft-clay-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all bg-white relative overflow-hidden border-2 border-slate-950/5 ring-4 ring-slate-100"
            >
              <div>
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block mb-2">
                  Unified Program
                </span>
                <h4 className="font-sans font-bold text-base text-slate-900">
                  Full Stack Path
                </h4>
                <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                  A seamless combined syllabus flowing from Frontend layout structure directly into Backend API engineering sequentially.
                </p>
              </div>
              <button className="flex items-center gap-1 mt-6 text-[10px] font-bold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                Select Program
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== VIEW 3: MASTER TEXTBOOK COURSE DASHBOARD ==================== */}
      {viewState === "course" && selectedTrack && (
        <div className="space-y-8">
          
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <button 
              onClick={() => {
                if (selectedTrack.domain === "webdev") {
                  setViewState("subtracks");
                } else {
                  setViewState("domains");
                }
              }}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Syllabus
            </button>

            {/* Overall Course Progress Badge card */}
            <div className="flex items-center gap-4 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm w-full md:w-auto">
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Course Completion Progress
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-sans font-bold text-sm text-slate-900">
                    {trackProgress}% Completed
                  </span>
                  <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${trackProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT COLUMN: CHAPTER INDEX MENU */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-2 mb-3">
                  Syllabus Outline
                </h4>
                
                <div className="flex flex-col gap-1">
                  {activeChapters.map((ch, idx) => {
                    const isCompleted = completedLessons[ch.id];
                    const isActive = activeChapterIndex === idx && !isQuizMode;

                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setActiveChapterIndex(idx);
                          setIsQuizMode(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                          isActive 
                            ? "bg-slate-900 text-white shadow-sm" 
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="line-clamp-1 leading-normal">
                          {ch.title}
                        </span>
                        
                        {isCompleted && (
                          <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-400" : "text-emerald-500"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Section Quiz Trigger Button */}
              {selectedTrack.quiz && selectedTrack.quiz.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsQuizMode(true)}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-sm ${
                      isQuizMode
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    Test Your Knowledge (Quiz)
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
                    Purely optional, enjoy testing your understanding when ready!
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ACTIVE COURSE TEXTBOOK CONTENT / QUIZ VIEW (Span 3) */}
            <div className="lg:col-span-3">
              
              {/* STATE A: THE OPTIONAL QUIZ VIEW */}
              {isQuizMode ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-8">
                  {/* Quiz Header */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-sans font-bold text-lg text-slate-900">
                        {selectedTrack.title} Section Quiz
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsQuizMode(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-100 px-3 py-1 rounded-full"
                    >
                      Return to Chapters
                    </button>
                  </div>

                  {/* Quiz Questions List */}
                  <div className="space-y-8">
                    {selectedTrack.quiz.map((q, qIdx) => {
                      const selectedOption = quizAnswers[q.id];
                      const isGraded = showQuizResults;
                      const isCorrect = selectedOption === q.correctAnswerIdx;

                      return (
                        <div key={q.id} className="space-y-4 border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                          <h4 className="font-sans font-bold text-sm text-slate-900">
                            Question {qIdx + 1}: {q.question}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, optIdx) => {
                              const isThisSelected = selectedOption === optIdx;
                              
                              let buttonStyles = "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white";
                              if (isThisSelected) {
                                buttonStyles = "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold";
                              }
                              
                              if (isGraded) {
                                if (optIdx === q.correctAnswerIdx) {
                                  buttonStyles = "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold";
                                } else if (isThisSelected && !isCorrect) {
                                  buttonStyles = "border-rose-400 bg-rose-50 text-rose-950";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isGraded}
                                  onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                                  className={`w-full text-left p-3.5 border rounded-2xl text-xs transition-all ${buttonStyles}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanations shown after grading */}
                          {isGraded && (
                            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                              isCorrect ? "bg-emerald-50/60 border border-emerald-100 text-emerald-800" : "bg-slate-50 border border-slate-100 text-slate-600"
                            }`}>
                              <span className="font-bold block mb-1">
                                {isCorrect ? "✓ Correct Answer!" : "✗ Incorrect."}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grading Actions Footer */}
                  <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      {showQuizResults && (
                        <p className="font-sans font-bold text-sm text-slate-900">
                          Your Score: <span className="text-indigo-600">{quizScore.score}</span> / {quizScore.total} Correct
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {showQuizResults ? (
                        <button
                          onClick={() => {
                            setShowQuizResults(false);
                            setQuizAnswers({});
                          }}
                          className="px-5 py-2.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Retry Quiz
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowQuizResults(true)}
                          disabled={Object.keys(quizAnswers).length < selectedTrack.quiz.length}
                          className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all shadow-md"
                        >
                          Submit Answers
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* STATE B: THE ACTIVE TEXTBOOK CHAPTER READER */
                activeChapters.length > 0 && activeChapterIndex < activeChapters.length && (
                  <div className="space-y-6">
                    
                    {/* Plain Language Chapter Card */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
                      {/* Ambient background accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-60" />

                      {/* Header bar with mark as completed */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-6">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {selectedTrack.title}
                          </span>
                          <h3 className="font-sans font-bold text-xl text-slate-900 mt-1 leading-snug">
                            {activeChapters[activeChapterIndex].title}
                          </h3>
                        </div>

                        {/* Interactive checkbox tracker */}
                        <button
                          onClick={() => toggleLessonCompleted(activeChapters[activeChapterIndex].id)}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold transition-all shadow-sm ${
                            completedLessons[activeChapters[activeChapterIndex].id]
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                          }`}
                        >
                          <CheckCircle className={`w-4 h-4 ${completedLessons[activeChapters[activeChapterIndex].id] ? "text-emerald-600 fill-emerald-100" : "text-slate-300"}`} />
                          {completedLessons[activeChapters[activeChapterIndex].id] ? "Lesson Completed" : "Mark as Completed"}
                        </button>
                      </div>

                      {/* THE TEXTBOOK CONTENT */}
                      <div className="pl-1 space-y-4">
                        {renderFormattedText(activeChapters[activeChapterIndex].plainText)}
                      </div>

                    </div>

                    {/* DYNAMIC REFERENCE CARD FOOTER: Websites & Youtube links from vault */}
                    {(currentDocs.length > 0 || currentVideos.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Section 1: Supplementary Website documentations */}
                        {currentDocs.length > 0 && (
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                            <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-500" />
                              Official Vault Reference Docs
                            </h4>

                            <div className="space-y-3">
                              {currentDocs.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-start gap-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100/50 p-3.5 rounded-2xl transition-all"
                                >
                                  <div className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                      {doc.resource}
                                    </h5>
                                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                                      {doc.why_useful}
                                    </p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 2: Supplementary YouTube tutorial channels */}
                        {currentVideos.length > 0 && (
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                            <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                              <Video className="w-4 h-4 text-rose-500" />
                              Founder Video Libraries
                            </h4>

                            <div className="space-y-3">
                              {currentVideos.map((vid) => (
                                <a
                                  key={vid.id}
                                  href={vid.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100/50 p-3.5 rounded-2xl transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 text-rose-500">
                                      <PlayCircle className="w-4 h-4 fill-rose-50/50" />
                                    </div>
                                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                      {vid.channel}
                                    </h5>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-650 transition-colors" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* Navigation bar between chapters */}
                    <div className="flex justify-between items-center bg-slate-100/80 border border-slate-100/40 p-3.5 rounded-[2rem] shadow-inner mt-6">
                      <button
                        disabled={activeChapterIndex === 0}
                        onClick={() => setActiveChapterIndex(activeChapterIndex - 1)}
                        className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-bold transition-all text-slate-700"
                      >
                        Previous Chapter
                      </button>
                      <button
                        disabled={activeChapterIndex === activeChapters.length - 1}
                        onClick={() => setActiveChapterIndex(activeChapterIndex + 1)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-bold transition-all text-white"
                      >
                        Next Chapter
                      </button>
                    </div>

                  </div>
                )
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
