"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
import { TrackSelector } from "../components/TrackSelector";
import { GuideCard } from "../components/GuideCard";
import { GuideDetailView } from "../components/GuideDetailView";
import { KnowledgeVault } from "../components/KnowledgeVault";
import { AskAIBox } from "../components/AskAIBox";
import { MOCK_GUIDES, Guide } from "../data/mock-guides";
import { Search, Mail, ShieldAlert, Award, PhoneCall, Sparkles, BookOpen, Compass, ChevronRight, X, Key, ShieldCheck, Heart } from "lucide-react";

export default function Page() {
  // Global Application State
  const [track, setTrack] = useState<"selector" | "everyday" | "developer">("selector");
  const [view, setView] = useState<"landing" | "library" | "detail">("landing");
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string | null>(null);
  
  // Search and Filter States for Everyday track
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // API Key modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");

  // Load API Key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("how_to_tech_openai_key") || "";
      setSavedApiKey(key);
      setApiKeyInput(key);
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

  // Reset track filters
  const handleTrackChange = (newTrack: "everyday" | "developer") => {
    setTrack(newTrack);
    setView("landing");
    setSelectedGuideSlug(null);
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
  };

  // Find active guide details
  const activeGuide = useMemo(() => {
    if (!selectedGuideSlug) return null;
    return MOCK_GUIDES.find((g) => g.slug === selectedGuideSlug) || null;
  }, [selectedGuideSlug]);

  // List of distinct categories
  const categoriesList = useMemo(() => {
    const list = new Set(MOCK_GUIDES.map((g) => g.category));
    return ["All", ...Array.from(list)];
  }, []);

  // Filtered guides matching query, category, and difficulty
  const filteredGuides = useMemo(() => {
    return MOCK_GUIDES.filter((g) => {
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
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Trigger search from Hero input
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setView("library");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      
      {/* Header section (only if track is selected) */}
      {track !== "selector" && (
        <Header 
          currentTrack={track} 
          onTrackChange={handleTrackChange}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={!!savedApiKey}
        />
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
                      placeholder="What are you trying to do? (e.g., reset Gmail password, join a Zoom meeting...)"
                      className="w-full pl-12 pr-28 py-3.5 border border-slate-200 focus:border-slate-400 rounded-full text-xs md:text-sm outline-none bg-white shadow-md transition-all"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Search
                    </button>
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
                      {MOCK_GUIDES.slice(0, 4).map((guide) => (
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
                        placeholder="Search guide sheets..."
                        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 focus:border-slate-400 rounded-full text-xs outline-none bg-white shadow-sm transition-all"
                      />
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
                allGuides={MOCK_GUIDES}
                onSelectRelated={(slug) => setSelectedGuideSlug(slug)}
                track="everyday"
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
                    Your key is saved directly inside your local browser's `localStorage` and only fires requests directly from your browser client to OpenAI. No servers are involved.
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
