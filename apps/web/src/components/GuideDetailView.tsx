import React, { useState } from "react";
import { ArrowLeft, Play, Pause, Square, Volume2, HelpCircle, ThumbsUp, ThumbsDown, BookOpen, Clock, ChevronRight, Star, ClipboardCheck, Check } from "lucide-react";
import { Guide, GlossaryTerm } from "../data/mock-guides";
import { useVoice } from "../hooks/useVoice";

interface GuideDetailViewProps {
  guide: Guide;
  onBack: () => void;
  allGuides: Guide[];
  onSelectRelated: (slug: string) => void;
  track: "everyday" | "developer";
  isBookmarked: boolean;
  onToggleBookmark: (slug: string) => void;
  completedSteps: Record<string, boolean>; // Unique keys e.g. "gmail-password-reset-step-1"
  onToggleStep: (stepKey: string) => void;
}

export function GuideDetailView({
  guide,
  onBack,
  allGuides,
  onSelectRelated,
  track,
  isBookmarked,
  onToggleBookmark,
  completedSteps,
  onToggleStep
}: GuideDetailViewProps) {
  const [feedbackState, setFeedbackState] = useState<"none" | "helpful" | "unhelpful">("none");
  const [activeStepSpeakIndex, setActiveStepSpeakIndex] = useState<number>(-1);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  // Connect our speech engine hook
  const { speak, pause, resume, stop, isPlaying, isPaused } = useVoice();

  // Find related guides (same category or sharing tags, excluding current)
  const relatedGuides = allGuides
    .filter((g) => g.slug !== guide.slug && (g.category === guide.category || g.tags.some((t) => guide.tags.includes(t))))
    .slice(0, 2);

  // Play entire guide speech
  const handleSpeakEntireGuide = () => {
    setActiveStepSpeakIndex(100); // 100 means full guide
    const fullText = `Guide: ${guide.title}. Description: ${guide.description}. ` + 
      guide.steps.map((s, idx) => `Step ${idx + 1}: ${s.title}. ${s.body}.`).join(" ");
    speak(fullText);
  };

  // Play individual step speech
  const handleSpeakStep = (stepOrder: number, title: string, body: string) => {
    setActiveStepSpeakIndex(stepOrder);
    const stepText = `Step ${stepOrder}: ${title}. ${body}`;
    speak(stepText);
  };

  const handleStopSpeech = () => {
    stop();
    setActiveStepSpeakIndex(-1);
  };

  const handleFeedback = (type: "helpful" | "unhelpful") => {
    setFeedbackState(type);
  };

  const handleCopyPrompt = (promptText: string, promptId: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedStates((prev) => ({ ...prev, [promptId]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [promptId]: false }));
    }, 2000);
  };

  // Clickable Glossary Popover tooltips embedded in step body
  const renderStepBodyWithGlossary = (body: string, glossary: GlossaryTerm[]) => {
    if (!glossary || glossary.length === 0) return body;

    // Standardize terms for regex boundary matching
    const terms = glossary.map((g) => g.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    const regex = new RegExp(`\\b(${terms.join("|")})\\b`, "gi");

    const parts = body.split(regex);
    return parts.map((part, index) => {
      const match = glossary.find((g) => g.term.toLowerCase() === part.toLowerCase());
      
      if (match) {
        return (
          <span key={index} className="relative inline-block group/glossary-popover mx-0.5">
            <span 
              className="border-b-2 border-dashed border-indigo-400 hover:border-indigo-600 text-indigo-700 font-semibold cursor-help transition-colors select-none"
            >
              {part}
            </span>
            {/* Absolute hovering popover box */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl bg-slate-900 text-slate-100 text-[10px] leading-relaxed shadow-lg opacity-0 invisible group-hover/glossary-popover:opacity-100 group-hover/glossary-popover:visible transition-all duration-200 z-[90]">
              <span className="font-bold block text-indigo-400 mb-0.5">{match.term}</span>
              {match.definition}
              {/* Tooltip arrow pointing down */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </span>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Back Button */}
      <button 
        onClick={() => {
          handleStopSpeech();
          onBack();
        }}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-6 md:mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      {/* Guide Header Banner */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
        {/* Decorative corner bubble */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-xl opacity-60" />
        
        {/* Bookmark Icon placing top right */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => onToggleBookmark(guide.slug)}
            className={`p-2.5 rounded-full border transition-all ${
              isBookmarked 
                ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm" 
                : "bg-white border-slate-100 text-slate-400 hover:text-slate-650"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
            {guide.category}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {guide.difficulty} Difficulty
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            {guide.estimatedMinutes} Mins Read
          </span>
        </div>

        <h2 className="font-sans font-bold text-2xl md:text-4xl text-slate-900 mt-4 leading-tight pr-12">
          {guide.title}
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
          {guide.description}
        </p>

        {/* VOICE READ BANNER (Everyday Track Only) */}
        {track === "everyday" && (
          <div className="mt-6 flex flex-wrap items-center gap-4 bg-emerald-50/60 border border-emerald-100/50 p-4 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
              <Volume2 className={`w-5 h-5 ${isPlaying && activeStepSpeakIndex === 100 ? "voice-wave-active" : ""}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900">Need help reading this guide?</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Click listen to have our coach read the step instructions aloud.</p>
            </div>
            <div className="flex items-center gap-2">
              {isPlaying && activeStepSpeakIndex === 100 ? (
                <>
                  {isPaused ? (
                    <button 
                      onClick={resume}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      Resume
                    </button>
                  ) : (
                    <button 
                      onClick={pause}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
                    >
                      Pause
                    </button>
                  )}
                  <button 
                    onClick={handleStopSpeech}
                    className="p-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-full"
                    title="Stop Listening"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSpeakEntireGuide}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Listen to Guide
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Core Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 md:mt-10">
        
        {/* LEFT COLUMN: The Steps (Span 2) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <h3 className="font-sans font-bold text-lg text-slate-900 flex items-center gap-2 pl-1">
            <span>Step-by-Step Instructions</span>
            <span className="w-5 h-5 text-[10px] flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-semibold">
              {guide.steps.length}
            </span>
          </h3>

          {guide.steps.map((step) => {
            const stepKey = `${guide.slug}-step-${step.order}`;
            const isStepChecked = !!completedSteps[stepKey];
            const isCurrentlySpeakingThisStep = isPlaying && activeStepSpeakIndex === step.order;
            
            return (
              <div 
                key={step.order}
                className={`bg-white p-6 md:p-8 rounded-[2rem] border transition-all ${
                  isCurrentlySpeakingThisStep 
                    ? "border-emerald-300 shadow-md ring-2 ring-emerald-50/50" 
                    : isStepChecked
                      ? "border-slate-200/60 bg-slate-50/50 opacity-90 shadow-sm"
                      : "border-slate-100 shadow-sm"
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Interactive Checkbox Tracker */}
                    <button
                      onClick={() => onToggleStep(stepKey)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                        isStepChecked
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                          : "bg-white border-slate-350 hover:border-slate-650"
                      }`}
                      title={isStepChecked ? "Mark step as incomplete" : "Mark step as completed"}
                    >
                      {isStepChecked && <Check className="w-4 h-4 font-bold" />}
                    </button>

                    <h4 className={`font-sans font-bold text-base md:text-lg text-slate-900 transition-all ${
                      isStepChecked ? "line-through text-slate-400" : ""
                    }`}>
                      {step.title}
                    </h4>
                  </div>

                  {/* Individual Speaker Action (Everyday track only) */}
                  {track === "everyday" && (
                    <div>
                      {isCurrentlySpeakingThisStep ? (
                        <button 
                          onClick={handleStopSpeech}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                        >
                          <Square className="w-2.5 h-2.5 fill-current" />
                          Stop
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSpeakStep(step.order, step.title, step.body)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-100 hover:bg-slate-50"
                        >
                          <Volume2 className="w-3 h-3" />
                          Listen
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Step Body Explanation (embedded Popover anchor checks) */}
                <p className={`text-slate-600 text-sm md:text-base leading-relaxed pl-1 transition-all ${
                  isStepChecked ? "text-slate-400" : ""
                }`}>
                  {renderStepBodyWithGlossary(step.body, guide.glossary)}
                </p>

                {/* MOCK VISUAL SCREENSHOTS FOR WALKTHROUGHS */}
                {guide.slug === "gmail-password-reset" && step.order === 2 && (
                  <div className="mt-4 border border-slate-200 bg-slate-100 p-2.5 rounded-2xl max-w-sm ml-1 shadow-sm">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-4 shadow-sm select-none">
                      <div className="flex items-center gap-1 border-b border-slate-150 pb-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[7px] text-slate-400 font-mono">accounts.google.com</span>
                      </div>
                      <div className="space-y-2 text-center py-4">
                        <div className="w-16 h-3 bg-slate-150 rounded mx-auto" />
                        <div className="w-40 h-8 border border-slate-200 rounded-xl mx-auto flex items-center px-3 text-[10px] text-slate-300">••••••••</div>
                        <div className="flex items-center justify-between w-40 mx-auto text-[8px]">
                          <span className="text-blue-600 font-bold border-b border-blue-600 border-dashed animate-pulse ring-4 ring-blue-100/50 rounded-sm px-1 py-0.5">Forgot password?</span>
                          <span className="text-slate-400">Next</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 text-center block mt-1 font-semibold">
                      Mock Browser Screen (Tap the glowing &apos;Forgot password?&apos; link)
                    </span>
                  </div>
                )}

                {/* COPYABLE AI PROMPTS WIDGET */}
                {guide.slug === "chatgpt-safety" && step.order === 2 && (
                  <div className="mt-4 p-4 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-2.5 ml-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Try this Copyable Prompt Template
                      </span>
                      <button
                        onClick={() => handleCopyPrompt(
                          "Act as a plain-language tech tutor. Explain what computer cookies are in a single sentence using no technical jargon.",
                          "chatgpt-prompt"
                        )}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-bold shadow-sm hover:bg-slate-800 transition-all"
                      >
                        {copiedStates["chatgpt-prompt"] ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="w-3 h-3" />
                            Copy Prompt
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs font-mono bg-white p-3 border border-slate-100 rounded-xl text-slate-700 leading-relaxed select-all">
                      &quot;Act as a plain-language tech tutor. Explain what computer cookies are in a single sentence using no technical jargon.&quot;
                    </p>
                  </div>
                )}

              </div>
            );
          })}

          {/* Was this guide helpful Feedback Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-950">Was this guide helpful for you?</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Your input helps our plain-language writing team improve.</p>
            </div>
            
            {feedbackState === "none" ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleFeedback("helpful")}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Yes, very!
                </button>
                <button 
                  onClick={() => handleFeedback("unhelpful")}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Not really
                </button>
              </div>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
                ✨ Thank you! We appreciate your feedback.
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Glossary terms & Related content (Span 1) */}
        <div className="space-y-6">
          
          {/* Section 1: Glossary Panel */}
          {guide.glossary && guide.glossary.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
                <BookOpen className="w-4 h-4 text-slate-400" />
                Plain-Language Dictionary
              </h3>
              
              <div className="space-y-4">
                {guide.glossary.map((g, idx) => (
                  <div key={idx} className="group/glossary border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover/glossary:text-slate-800 transition-colors">
                      {g.term}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-1 bg-slate-50 p-2 rounded-xl">
                      {g.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Related Guides */}
          {relatedGuides.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
                <ChevronRight className="w-4 h-4 text-slate-400" />
                Related Guides
              </h3>
              
              <div className="space-y-3">
                {relatedGuides.map((rg) => (
                  <div 
                    key={rg.slug}
                    onClick={() => {
                      handleStopSpeech();
                      onSelectRelated(rg.slug);
                    }}
                    className="group cursor-pointer bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl p-4 transition-all"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {rg.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950 mt-1">
                      {rg.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {rg.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
