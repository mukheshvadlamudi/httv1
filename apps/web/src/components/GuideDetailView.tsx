import React, { useState } from "react";
import { ArrowLeft, Play, Pause, Square, Volume2, HelpCircle, ThumbsUp, ThumbsDown, BookOpen, Clock, ChevronRight } from "lucide-react";
import { Guide } from "../data/mock-guides";
import { useVoice } from "../hooks/useVoice";

interface GuideDetailViewProps {
  guide: Guide;
  onBack: () => void;
  allGuides: Guide[];
  onSelectRelated: (slug: string) => void;
  track: "everyday" | "developer";
}

export function GuideDetailView({ guide, onBack, allGuides, onSelectRelated, track }: GuideDetailViewProps) {
  const [feedbackState, setFeedbackState] = useState<"none" | "helpful" | "unhelpful">("none");
  const [activeStepSpeakIndex, setActiveStepSpeakIndex] = useState<number>(-1);
  
  // Connect our speech engine hook
  const { speak, pause, resume, stop, isPlaying, isPaused, currentSentenceIndex } = useVoice();

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

        <h2 className="font-sans font-bold text-2xl md:text-4xl text-slate-900 mt-4 leading-tight">
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
            const isCurrentlySpeakingThisStep = isPlaying && activeStepSpeakIndex === step.order;
            
            return (
              <div 
                key={step.order}
                className={`bg-white p-6 md:p-8 rounded-[2rem] border transition-all ${
                  isCurrentlySpeakingThisStep 
                    ? "border-emerald-300 shadow-md ring-2 ring-emerald-50/50" 
                    : "border-slate-100 shadow-sm"
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Big Step Number Circle */}
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {step.order}
                    </div>
                    <h4 className="font-sans font-bold text-base md:text-lg text-slate-900">
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

                {/* Step Body Explanation */}
                <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-1">
                  {step.body}
                </p>
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
