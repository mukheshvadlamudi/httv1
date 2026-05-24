"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
import { TrackSelector } from "../components/TrackSelector";
import { GuideCard } from "../components/GuideCard";
import { GuideDetailView } from "../components/GuideDetailView";
import { KnowledgeVault } from "../components/KnowledgeVault";
import { AskAIBox } from "../components/AskAIBox";
import { MOCK_GUIDES, Guide } from "../data/mock-guides";
import { Search, Mail, ShieldAlert, PhoneCall, Compass, ChevronRight, X, Key, ShieldCheck, Heart } from "lucide-react";

// Visual Layout Expansion Imports
import { AccessibilityToolbar, FontScale, ContrastTheme } from "../components/AccessibilityToolbar";
import { LearningPaths } from "../components/LearningPaths";
import { ToolFinder } from "../components/ToolFinder";
import { UserDashboard } from "../components/UserDashboard";
import { BusinessTraining } from "../components/BusinessTraining";
import { AdminCMS } from "../components/AdminCMS";
interface SearchSuggestion {
  label: string;
  slug: string;
  category: string;
  keywords: string[];
}

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { label: "Reset Gmail password", slug: "gmail-password-reset", category: "Email", keywords: ["gmail", "google", "password", "reset", "email", "recovery", "g"] },
  { label: "Create a strong password", slug: "strong-password-creation", category: "Security", keywords: ["password", "security", "passphrase", "safe", "g"] },
  { label: "Set up Two-Factor Authentication (2FA)", slug: "two-factor-auth", category: "Security", keywords: ["2fa", "security", "two-step", "verification", "hacker", "safety"] },
  { label: "Spot email scams and phishing", slug: "spot-scam-email", category: "Security", keywords: ["scam", "phishing", "fake", "email", "security", "safety"] },
  { label: "Join a Zoom video meeting", slug: "zoom-meeting-join", category: "Communication", keywords: ["zoom", "meeting", "video", "call", "audio"] },
  { label: "Share a Google Drive file", slug: "google-drive-share", category: "Files", keywords: ["google", "drive", "share", "send", "file", "g"] },
  { label: "Install app on Android phone", slug: "install-app-android", category: "Mobile", keywords: ["android", "play store", "download", "app", "mobile"] },
  { label: "Update iPhone software", slug: "update-iphone", category: "Mobile", keywords: ["iphone", "ios", "update", "mobile", "apple"] },
  { label: "Save document as PDF", slug: "create-pdf", category: "Productivity", keywords: ["pdf", "save", "print", "document"] },
  { label: "Use ChatGPT AI safely", slug: "chatgpt-safety", category: "AI & Tools", keywords: ["chatgpt", "ai", "privacy", "safety", "openai"] }
];

const getFilteredSuggestions = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return SEARCH_SUGGESTIONS.slice(0, 5);
  }
  const matches = SEARCH_SUGGESTIONS.filter(item => 
    item.label.toLowerCase().includes(q) || 
    item.keywords.some(kw => kw.toLowerCase().startsWith(q))
  );
  return matches.slice(0, 5);
};

const getCategoryIcon = (category: string, className = "w-3.5 h-3.5") => {
  if (category === "Email") return <Mail className={className} />;
  if (category === "Security") return <ShieldCheck className={`${className} text-rose-500`} />;
  if (category === "Communication") return <PhoneCall className={`${className} text-emerald-500`} />;
  return <Compass className={`${className} text-blue-500`} />;
};

export default function Page() {
  // Global Application State
  const [track, setTrack] = useState<"selector" | "everyday" | "developer">("selector");
  const [view, setView] = useState<"landing" | "library" | "detail" | "paths" | "tools" | "dashboard" | "b2b" | "admin">("landing");
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string | null>(null);
  
  // Autocomplete focus states
  const [isHeroFocused, setIsHeroFocused] = useState(false);
  const [isLibraryFocused, setIsLibraryFocused] = useState(false);

  // Global Accessibilities and Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [customGuides, setCustomGuides] = useState<Guide[]>([]);
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [theme, setTheme] = useState<ContrastTheme>("standard");
  
  // Search and Filter States for Everyday track
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // API Key modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");

  // Load Global settings & states from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("how_to_tech_openai_key") || "";
      setTimeout(() => {
        setSavedApiKey(key);
        setApiKeyInput(key);

        const savedBookmarks = localStorage.getItem("how_to_tech_bookmarks");
        if (savedBookmarks) {
          try {
            setBookmarks(JSON.parse(savedBookmarks));
          } catch (e) {
            console.error(e);
          }
        }

        const savedCompleted = localStorage.getItem("how_to_tech_completed_steps");
        if (savedCompleted) {
          try {
            setCompletedSteps(JSON.parse(savedCompleted));
          } catch (e) {
            console.error(e);
          }
        }

        const savedCustom = localStorage.getItem("how_to_tech_custom_guides");
        if (savedCustom) {
          try {
            setCustomGuides(JSON.parse(savedCustom));
          } catch (e) {
            console.error(e);
          }
        }

        const savedFontScale = localStorage.getItem("how_to_tech_font_scale") as FontScale;
        if (savedFontScale) setFontScale(savedFontScale);

        const savedTheme = localStorage.getItem("how_to_tech_theme") as ContrastTheme;
        if (savedTheme) setTheme(savedTheme);
      }, 0);
    }
  }, []);

  // Save API Key
  const handleSaveApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("how_to_tech_openai_key", apiKeyInput);
      setSavedApiKey(apiKeyInput);
      setIsSettingsOpen(false);
    }
  };

  // Clear API Key
  const handleClearApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("how_to_tech_openai_key");
      setSavedApiKey("");
      setApiKeyInput("");
      setIsSettingsOpen(false);
    }
  };

  // Sync state togglers to localStorage
  const handleToggleBookmark = (slug: string) => {
    const next = bookmarks.includes(slug)
      ? bookmarks.filter((b) => b !== slug)
      : [...bookmarks, slug];
    setBookmarks(next);
    localStorage.setItem("how_to_tech_bookmarks", JSON.stringify(next));
  };

  const handleToggleStep = (stepKey: string) => {
    const next = { ...completedSteps, [stepKey]: !completedSteps[stepKey] };
    setCompletedSteps(next);
    localStorage.setItem("how_to_tech_completed_steps", JSON.stringify(next));
  };

  const handlePublishGuide = (newGuide: Guide) => {
    const next = [newGuide, ...customGuides];
    setCustomGuides(next);
    localStorage.setItem("how_to_tech_custom_guides", JSON.stringify(next));
  };

  const handleChangeFontScale = (scale: FontScale) => {
    setFontScale(scale);
    localStorage.setItem("how_to_tech_font_scale", scale);
  };

  const handleChangeTheme = (newTheme: ContrastTheme) => {
    setTheme(newTheme);
    localStorage.setItem("how_to_tech_theme", newTheme);
  };

  // Reset track filters
  const handleTrackChange = (newTrack: "everyday" | "developer") => {
    setTrack(newTrack);
    setView("landing");
    setSelectedGuideSlug(null);
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
  };

  // Merge custom published guides with MOCK_GUIDES
  const allGuides = useMemo(() => {
    return [...MOCK_GUIDES, ...customGuides];
  }, [customGuides]);

  // Compute lesson completion state based on completed steps checkmarks
  const completedLessons = useMemo(() => {
    const map: Record<string, boolean> = {};
    allGuides.forEach((guide) => {
      if (!guide.steps || guide.steps.length === 0) return;
      const allDone = guide.steps.every((step) => completedSteps[`${guide.slug}-step-${step.order}`]);
      if (allDone) {
        map[guide.slug] = true;
      }
    });
    return map;
  }, [completedSteps, allGuides]);

  // Find active guide details
  const activeGuide = useMemo(() => {
    if (!selectedGuideSlug) return null;
    return allGuides.find((g) => g.slug === selectedGuideSlug) || null;
  }, [selectedGuideSlug, allGuides]);

  // List of distinct categories
  const categoriesList = useMemo(() => {
    const list = new Set(allGuides.map((g) => g.category));
    return ["All", ...Array.from(list)];
  }, [allGuides]);

  // Filtered guides matching query, category, and difficulty
  const filteredGuides = useMemo(() => {
    return allGuides.filter((g) => {
      const matchesSearch = 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === "All" || g.category === selectedCategory;

      const matchesDifficulty = 
        selectedDifficulty === "All" || g.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, allGuides]);

  // Trigger search from Hero input
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setView("library");
  };

  const fontClass = fontScale === "large" ? "font-scale-large" : fontScale === "extra" ? "font-scale-extra" : "";
  const themeClass = theme === "pastel" ? "theme-pastel" : theme === "highcontrast" ? "theme-highcontrast" : "";

  return (
    <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${fontClass} ${themeClass}`}>
      
      {/* Accessibility Toolbar */}
      {track === "everyday" && (
        <AccessibilityToolbar
          fontScale={fontScale}
          onChangeFontScale={handleChangeFontScale}
          theme={theme}
          onChangeTheme={handleChangeTheme}
        />
      )}
      
      {/* Header section (only if track is selected) */}
      {track !== "selector" && (
        <Header 
          currentTrack={track} 
          onTrackChange={handleTrackChange}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={!!savedApiKey}
        />
      )}

      {/* Sub-navigation bar for Everyday track */}
      {track === "everyday" && (
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex flex-wrap items-center justify-between gap-4 relative z-40">
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => {
                setView("landing");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === "landing" || view === "library" || view === "detail"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Guide Sheets
            </button>
            <button
              onClick={() => {
                setView("paths");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === "paths"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Learning Paths
            </button>
            <button
              onClick={() => {
                setView("tools");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === "tools"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tool Finder
            </button>
            <button
              onClick={() => {
                setView("dashboard");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                view === "dashboard"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              My Dashboard
              {bookmarks.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] rounded-full">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setView("b2b");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === "b2b"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Business Training
            </button>
            <button
              onClick={() => {
                setView("admin");
                setSelectedGuideSlug(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                view === "admin"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Admin CMS
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full relative">
        
        {/* TRACK 1: Selector View */}
        {track === "selector" && (
          <TrackSelector onSelectTrack={(selected) => setTrack(selected)} />
        )}

        {/* TRACK 2: Everyday Technology (Basic/Beginner) */}
        {track === "everyday" && (
          <>
            {/* View A: Landing State */}
            {view === "landing" && (
              <div className="space-y-12 md:space-y-20 pb-20">
                {/* Hero Section */}
                <section className="text-center pt-12 md:pt-20 px-6 max-w-4xl mx-auto">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full">
                    Grounded technology coaching
                  </span>
                  
                  <h2 className="font-sans font-bold text-3xl md:text-6xl text-slate-900 mt-4 leading-tight tracking-tight">
                    Learn technology in <br className="hidden sm:inline" />
                    <span className="text-slate-500">plain language</span>.
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
                    Simple, visual step-by-step guides with speech synthesis audio. Zero confusing terminology. Built for beginners.
                  </p>

                  {/* Centered Large Search Bar */}
                  <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mt-8 md:mt-10 relative">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsHeroFocused(true)}
                      onBlur={() => setTimeout(() => setIsHeroFocused(false), 200)}
                      placeholder="What are you trying to do? (e.g., reset Gmail password, join a Zoom meeting...)"
                      className="w-full pl-12 pr-28 py-3.5 border border-slate-200 focus:border-slate-400 rounded-full text-xs md:text-sm outline-none bg-white shadow-md transition-all"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Search
                    </button>

                    {/* Autocomplete Suggestions Dropdown */}
                    {isHeroFocused && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-xl z-50 overflow-hidden text-left p-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5 flex justify-between">
                          <span>Suggested options</span>
                          <span className="text-[8px] normal-case font-medium">Quick Access</span>
                        </div>
                        {getFilteredSuggestions(searchQuery).map((item) => (
                          <div
                            key={item.slug}
                            onClick={() => {
                              setSelectedGuideSlug(item.slug);
                              setView("detail");
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-650 shrink-0">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950 block">{item.label}</span>
                              <span className="text-[9px] text-slate-400 font-bold block">{item.category}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </form>
                </section>

                {/* Grid of Featured Category Cards */}
                <section className="px-6 max-w-6xl mx-auto">
                  <h3 className="font-sans font-bold text-base text-slate-900 pl-1 mb-6">
                    Featured Topics
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { icon: Mail, name: "Email", slug: "Email", color: "bg-blue-50 text-blue-600 border-blue-100" },
                      { icon: ShieldAlert, name: "Security", slug: "Security", color: "bg-rose-50 text-rose-600 border-rose-100" },
                      { icon: PhoneCall, name: "Zoom Calls", slug: "Communication", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                      { icon: Compass, name: "All Guides", slug: "All", color: "bg-slate-100 text-slate-700 border-slate-200/50" }
                    ].map((item) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (item.slug === "All") {
                            setSelectedCategory("All");
                          } else {
                            setSelectedCategory(item.slug);
                          }
                          setView("library");
                        }}
                        className="group cursor-pointer soft-clay-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all bg-white"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} border`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="font-sans font-bold text-xs md:text-sm text-slate-900">
                            {item.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Popular Guides & AI Box Row */}
                <section className="px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Guides grid list (Span 2) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between pl-1">
                      <h3 className="font-sans font-bold text-base text-slate-900">
                        Popular Guides
                      </h3>
                      <button 
                        onClick={() => {
                          setSelectedCategory("All");
                          setView("library");
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                      >
                        Browse All Guides
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allGuides.slice(0, 4).map((guide) => (
                        <GuideCard 
                          key={guide.id} 
                          guide={guide} 
                          onSelect={(slug) => {
                            setSelectedGuideSlug(slug);
                            setView("detail");
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Ask AI Box side placement (Span 1) */}
                  <div className="lg:col-span-1">
                    <AskAIBox 
                      track="everyday"
                      onSelectGuide={(slug) => {
                        setSelectedGuideSlug(slug);
                        setView("detail");
                      }}
                      apiKey={savedApiKey}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                  </div>
                </section>
              </div>
            )}

            {/* View B: Library State */}
            {view === "library" && (
              <div className="max-w-6xl mx-auto px-6 py-12 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Categories list */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-1 mb-3">
                      Topic Areas
                    </h4>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-auto lg:w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === cat 
                              ? "bg-slate-900 text-white shadow-sm" 
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulties list */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest pl-1 mb-3">
                      Difficulty Level
                    </h4>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {["All", "Easy", "Medium", "Hard"].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`w-auto lg:w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedDifficulty === diff 
                              ? "bg-slate-900 text-white shadow-sm" 
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Guides results panel */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => setView("landing")}
                        className="text-xs font-bold text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-wider"
                      >
                        Home
                      </button>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Guide Library
                      </span>
                    </div>

                    {/* Simple Search Input inside library */}
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsLibraryFocused(true)}
                        onBlur={() => setTimeout(() => setIsLibraryFocused(false), 200)}
                        placeholder="Search guide sheets..."
                        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 focus:border-slate-400 rounded-full text-xs outline-none bg-white shadow-sm transition-all"
                      />

                      {/* Suggestions Dropdown */}
                      {isLibraryFocused && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden text-left p-3 space-y-1 animate-in slide-in-from-top-1 duration-200 w-80 sm:w-72 right-0 sm:left-auto">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
                            Suggestions
                          </div>
                          {getFilteredSuggestions(searchQuery).map((item) => (
                            <div
                              key={item.slug}
                              onClick={() => {
                                setSelectedGuideSlug(item.slug);
                                setView("detail");
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-655 shrink-0">
                                {getCategoryIcon(item.category, "w-3 h-3")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 block truncate">{item.label}</span>
                                <span className="text-[8px] text-slate-400 font-bold block">{item.category}</span>
                              </div>
                              <ChevronRight className="w-3 h-3 text-slate-350 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 block">
                    Showing {filteredGuides.length} matching guides
                  </span>

                  {filteredGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredGuides.map((guide) => (
                        <GuideCard 
                          key={guide.id} 
                          guide={guide} 
                          onSelect={(slug) => {
                            setSelectedGuideSlug(slug);
                            setView("detail");
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-sm max-w-xl mx-auto mt-6">
                      <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-sans font-bold text-sm text-slate-900 mt-4">No matching guide sheets found</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                        Try searching for a different keyword, clearing filters, or ask our simulated AI coach below instead!
                      </p>

                      <div className="mt-8 max-w-md mx-auto text-left">
                        <AskAIBox 
                          track="everyday"
                          onSelectGuide={(slug) => {
                            setSelectedGuideSlug(slug);
                            setView("detail");
                          }}
                          apiKey={savedApiKey}
                          onOpenSettings={() => setIsSettingsOpen(true)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View C: Detail State */}
            {view === "detail" && activeGuide && (
              <GuideDetailView 
                guide={activeGuide} 
                onBack={() => setView("library")}
                allGuides={allGuides}
                onSelectRelated={(slug) => setSelectedGuideSlug(slug)}
                track="everyday"
                isBookmarked={bookmarks.includes(activeGuide.slug)}
                onToggleBookmark={handleToggleBookmark}
                completedSteps={completedSteps}
                onToggleStep={handleToggleStep}
              />
            )}

            {/* View D: Learning Paths State */}
            {view === "paths" && (
              <LearningPaths
                onSelectGuide={(slug) => {
                  setSelectedGuideSlug(slug);
                  setView("detail");
                }}
                allGuides={allGuides}
                completedLessons={completedLessons}
              />
            )}

            {/* View E: Tool Finder State */}
            {view === "tools" && (
              <ToolFinder />
            )}

            {/* View F: Dashboard State */}
            {view === "dashboard" && (
              <UserDashboard
                bookmarks={bookmarks}
                allGuides={allGuides}
                completedLessons={completedLessons}
                onSelectGuide={(slug) => {
                  setSelectedGuideSlug(slug);
                  setView("detail");
                }}
                onNavigateToView={(targetView) => {
                  setView(targetView);
                }}
              />
            )}

            {/* View G: Business Training State */}
            {view === "b2b" && (
              <BusinessTraining />
            )}

            {/* View H: Admin CMS Publishing State */}
            {view === "admin" && (
              <AdminCMS
                onPublish={(newGuide) => {
                  handlePublishGuide(newGuide);
                }}
              />
            )}
          </>
        )}

        {/* TRACK 3: Developer & Tech Hub (Advanced) */}
        {track === "developer" && (
          <div className="pb-24">
            <KnowledgeVault />
          </div>
        )}

      </main>

      {/* Floating Settings Drawer / Modal for OpenAI API key configuration */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/20 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-slate-700" />
                  <h3 className="font-sans font-bold text-base text-slate-900">Developer API Key</h3>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body explanation */}
              <p className="text-slate-500 text-xs mt-4 leading-relaxed">
                As the developer, you can securely plug in your **OpenAI API Key** locally to connect the AI answer box to real-time LLM engines. 
              </p>
              
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex gap-3 mt-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-emerald-800">100% Secure & Client-Side</h4>
                  <p className="text-[10px] text-emerald-600/90 leading-relaxed mt-0.5">
                    Your key is saved directly inside your local browser&apos;s `localStorage` and only fires requests directly from your browser client to OpenAI. No servers are involved.
                  </p>
                </div>
              </div>

              {/* Input section */}
              <div className="mt-8 space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  OpenAI API Key (sk-...)
                </label>
                <input 
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your key sk-..."
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner transition-all"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-slate-100 pt-6 flex items-center gap-3">
              {savedApiKey && (
                <button
                  onClick={handleClearApiKey}
                  className="flex-1 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Save Key
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Styled Footer aligned with Futurelab */}
      <footer className="w-full border-t border-slate-100 bg-white py-8 px-6 text-center text-slate-400 text-[11px] font-medium flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Small Dotted 2x2 grid */}
          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-400 rounded-xs w-1 h-1" />
            ))}
          </div>
          <span>&copy; {new Date().getFullYear()} How to Tech. Powered by Futurelab Studios.</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-300">
          <span>Made with</span>
          <Heart className="w-3 h-3 fill-current text-rose-400/80" />
          <span>for absolute accessibility</span>
        </div>
      </footer>
      
    </div>
  );
}
