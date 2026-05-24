import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, ShieldCheck, HelpCircle, BadgeInfo, CheckCircle } from "lucide-react";

interface TechTool {
  id: string;
  name: string;
  category: "Email" | "Security" | "AI" | "Meetings" | "Files" | "Mobile";
  price: "Free" | "Freemium" | "Paid";
  privacyLevel: "High" | "Medium" | "Low";
  setupEase: "Easy" | "Medium" | "Hard";
  recommendation: string;
  description: string;
}

const TOOLS_DATABASE: TechTool[] = [
  {
    id: "tool-gmail",
    name: "Gmail / Google Mail",
    category: "Email",
    price: "Free",
    privacyLevel: "Medium",
    setupEase: "Easy",
    recommendation: "Excellent default email service for seniors, though google tracks some data for ads.",
    description: "Standard internet mailbox for sending and receiving letters, invoices, and photos."
  },
  {
    id: "tool-bitwarden",
    name: "Bitwarden Password Vault",
    category: "Security",
    price: "Free",
    privacyLevel: "High",
    setupEase: "Medium",
    recommendation: "Highly recommended. Stores password keys in a secure encrypted online locker.",
    description: "Digital vault that remembers all your complex passwords for you automatically."
  },
  {
    id: "tool-chatgpt",
    name: "ChatGPT AI Coach",
    category: "AI",
    price: "Freemium",
    privacyLevel: "Low",
    setupEase: "Easy",
    recommendation: "Amazing helper, but do not type private passwords or credit cards in chats.",
    description: "Interactive artificial intelligence helper that answers questions like a patient tutor."
  },
  {
    id: "tool-zoom",
    name: "Zoom Video Meetings",
    category: "Meetings",
    price: "Freemium",
    privacyLevel: "Medium",
    setupEase: "Easy",
    recommendation: "Standard video calling app. Keep it updated for maximum security.",
    description: "Computer and phone program to connect with family, friends, or coworkers over camera calls."
  },
  {
    id: "tool-gdrive",
    name: "Google Drive Storage",
    category: "Files",
    price: "Freemium",
    privacyLevel: "Medium",
    setupEase: "Easy",
    recommendation: "Safe, spacious storage cabinet to share photo albums and documents.",
    description: "Online filing cabinet that keeps your files secure on the internet."
  },
  {
    id: "tool-whatsapp",
    name: "WhatsApp Messenger",
    category: "Meetings",
    price: "Free",
    privacyLevel: "High",
    setupEase: "Easy",
    recommendation: "Highly recommended for communications because it encrypts texts.",
    description: "Mobile texting and video calling app used globally on smartphones."
  },
  {
    id: "tool-playstore",
    name: "Google Play Store",
    category: "Mobile",
    price: "Free",
    privacyLevel: "Medium",
    setupEase: "Easy",
    recommendation: "Only download apps from this store on Android. Avoid other sites.",
    description: "The official app market pre-installed on Android mobile phones."
  }
];

export function ToolFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [easeFilter, setEaseFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "privacy">("name");

  // Filtered and sorted tools
  const processedTools = useMemo(() => {
    let list = [...TOOLS_DATABASE];

    // 1. Filter
    list = list.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      const matchesEase = easeFilter === "All" || t.setupEase === easeFilter;

      return matchesSearch && matchesCategory && matchesEase;
    });

    // 2. Sort
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price.localeCompare(b.price);
      if (sortBy === "privacy") {
        const priority = { High: 3, Medium: 2, Low: 1 };
        return priority[b.privacyLevel] - priority[a.privacyLevel];
      }
      return 0;
    });

    return list;
  }, [searchQuery, categoryFilter, easeFilter, sortBy]);

  // Color mappings
  const getPrivacyBadge = (level: string) => {
    if (level === "High") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (level === "Medium") return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-rose-50 text-rose-700 border-rose-100";
  };

  const getEaseBadge = (ease: string) => {
    if (ease === "Easy") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (ease === "Medium") return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-rose-50 text-rose-700 border-rose-100";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full">
          Product comparisons
        </span>
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-slate-900 mt-4 tracking-tight">
          Seniors' Tool Finder
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
          Wondering which digital tools are safe, free, or easy to set up? Review our plain-language comparison table to find out.
        </p>
      </div>

      {/* Query Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software names..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-slate-400 rounded-full text-xs outline-none bg-white shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Email">Email</option>
            <option value="Security">Security</option>
            <option value="AI">Artificial Intelligence</option>
            <option value="Meetings">Video Calls</option>
            <option value="Files">Cloud Storage</option>
            <option value="Mobile">Smartphones</option>
          </select>

          <select
            value={easeFilter}
            onChange={(e) => setEaseFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 outline-none"
          >
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy Setup</option>
            <option value="Medium">Medium Setup</option>
            <option value="Hard">Hard Setup</option>
          </select>

          <button
            onClick={() => {
              if (sortBy === "name") setSortBy("price");
              else if (sortBy === "price") setSortBy("privacy");
              else setSortBy("name");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort: {sortBy.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Comparison Grid Matrix */}
      {processedTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {processedTools.map((tool) => (
            <div 
              key={tool.id}
              className="soft-clay-card p-6 md:p-8 border bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-350 transition-all rounded-[2rem]"
            >
              
              {/* Left Side: Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                    {tool.category}
                  </span>
                  {tool.privacyLevel === "High" && (
                    <span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600">
                      <ShieldCheck className="w-3 h-3" />
                      Safe Choice
                    </span>
                  )}
                </div>
                <h4 className="font-sans font-bold text-base md:text-lg text-slate-900">
                  {tool.name}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
                  {tool.description}
                </p>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex gap-2 max-w-xl mt-3">
                  <BadgeInfo className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-semibold text-slate-600 leading-normal">
                    {tool.recommendation}
                  </p>
                </div>
              </div>

              {/* Right Side: Matrix status badges */}
              <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0 justify-between">
                
                {/* Status 1: Price */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Price Cost
                  </span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                    {tool.price}
                  </span>
                </div>

                {/* Status 2: Setup */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Setup Ease
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getEaseBadge(tool.setupEase)}`}>
                    {tool.setupEase}
                  </span>
                </div>

                {/* Status 3: Privacy */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Privacy Safety
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPrivacyBadge(tool.privacyLevel)}`}>
                    {tool.privacyLevel}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-sm max-w-md mx-auto">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-sans font-bold text-sm text-slate-900 mt-4">No tools match your criteria</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Try adjusting your search queries or resetting category and setup difficulty filters.
          </p>
        </div>
      )}
    </div>
  );
}
