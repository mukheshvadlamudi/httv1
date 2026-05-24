import React, { useState, useRef } from "react";
import { Sparkles, Square, Send, Key, Volume2, ArrowRight } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import { askAi } from "../lib/api";

interface AskAIBoxProps {
  track: "everyday" | "developer";
  onSelectGuide: (slug: string) => void;
  apiKey: string;
  onOpenSettings: () => void;
}

interface SimulatedAnswer {
  keywords: string[];
  answer: string;
  simpleAnswer: string;
  relatedSlug: string;
}

const SIMULATED_ANSWERS: SimulatedAnswer[] = [
  {
    keywords: ["gmail", "password", "reset", "recover"],
    answer: "To reset your Gmail password, you need to go to the Google sign-in page and click 'Forgot password?'. Google will send a 6-digit verification code to your recovery email or mobile phone. Enter this code on the screen, then choose a secure new password.",
    simpleAnswer: "1. Go to the Gmail sign-in page.\n2. Tap the blue 'Forgot password?' text.\n3. Check your mobile phone for a text message code.\n4. Type that code into the box on the screen.\n5. Create a brand new password.",
    relatedSlug: "gmail-password-reset"
  },
  {
    keywords: ["scam", "phishing", "fake", "email"],
    answer: "A scam email often tries to scare you with urgent language (like 'Your account will be suspended immediately!') and has weird sender addresses. Always look closely at the sender's full email address and never click links or download attachments from people you don't know.",
    simpleAnswer: "1. Look at the sender's full email address. If it looks strange, it is fake.\n2. Watch out for scary messages that ask you to click immediately.\n3. Do NOT click any links.\n4. Do NOT open files inside the email.",
    relatedSlug: "spot-scam-email"
  },
  {
    keywords: ["chatgpt", "ai", "safe", "privacy"],
    answer: "Using ChatGPT is safe as long as you do not share private information. Never type in your home address, bank card numbers, or passwords. AI systems save questions to train their models, so treat it like a public conversation.",
    simpleAnswer: "1. Open chatgpt.com on your screen.\n2. Write questions like you are talking to a friendly helper.\n3. Never type in your passwords, address, or bank cards.\n4. If you aren't sure a detail is safe to share, do not type it.",
    relatedSlug: "chatgpt-safety"
  },
  {
    keywords: ["zoom", "meeting", "call", "join"],
    answer: "To join a Zoom meeting, find your invitation email and click the blue web link. It will prompt you to download the free Zoom application if you don't have it. Tap 'Join with Video' and 'Join with Computer Audio' so others can see and hear you.",
    simpleAnswer: "1. Find your blue Zoom invitation link.\n2. Tap or click on the blue link.\n3. Tap 'Join with Video' when prompted.\n4. Tap 'Join with Computer Audio' so others can hear you speak.",
    relatedSlug: "zoom-meeting-join"
  },
  {
    keywords: ["iphone", "update", "apple"],
    answer: "To update your iPhone, connect it to your home Wi-Fi and plug in its charger. Open the 'Settings' app (grey gear icon), tap 'General', and select 'Software Update'. If an update is ready, tap 'Download and Install'.",
    simpleAnswer: "1. Plug your iPhone into its battery charger.\n2. Connect to your home Wi-Fi.\n3. Tap the Settings icon (looks like a grey gear).\n4. Tap 'General', then tap 'Software Update'.\n5. Tap 'Download and Install'.",
    relatedSlug: "update-iphone"
  }
];

export function AskAIBox({ track, onSelectGuide, apiKey, onOpenSettings }: AskAIBoxProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [fullResponse, setFullResponse] = useState<SimulatedAnswer | null>(null);
  const [isSimplerMode, setIsSimplerMode] = useState(false);
  const [liveAnswer, setLiveAnswer] = useState("");
  const [liveSimpleAnswer, setLiveSimpleAnswer] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  const { speak, stop, isPlaying } = useVoice();
  const typingIntervalRef = useRef<any>(null);

  // Simulated multi-step loading message
  const loadingMessages = [
    "Reading relevant guide library files...",
    "Analyzing context and clearing tech jargon...",
    "Formulating gentle, step-by-step instructions..."
  ];

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Reset voice & states
    stop();
    setDisplayedAnswer("");
    setFullResponse(null);
    setIsSimplerMode(false);
    setLiveAnswer("");
    setLiveSimpleAnswer("");
    setFeedbackGiven(null);
    setLoading(true);
    setLoadingStep(0);

    // Multi-step simulated loading progression
    for (let i = 0; i < 3; i++) {
      setLoadingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // 1. Try calling the FastAPI backend via askAi
    try {
      const response = await askAi(question);
      const relatedSlug = response.relatedGuideSlugs[0] || "gmail-password-reset";
      const result = {
        keywords: [],
        answer: response.answer,
        simpleAnswer: response.answer,
        relatedSlug,
      };
      setFullResponse(result);
      setLiveAnswer(response.answer);
      setLiveSimpleAnswer(response.answer);
      setLoading(false);
      streamText(response.answer);
      return;
    } catch (err) {
      console.warn("FastAPI backend askAi failed/offline, trying local Next.js API route...", err);
    }

    // 2. Try calling our local Next.js API route
    try {
      const response = await fetch("/api/ai/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      if (response.ok) {
        const data = await response.json();
        setLiveAnswer(data.answer);
        setLiveSimpleAnswer(data.simpleAnswer);
        setFullResponse({
          keywords: [],
          answer: data.answer,
          simpleAnswer: data.simpleAnswer,
          relatedSlug: data.relatedSlug
        });
        setLoading(false);
        streamText(data.answer);
        return;
      }
    } catch (err) {
      console.error("Local Next.js API route failed, falling back to simulated answers...", err);
    }

    // 3. Fallback: Simulated offline local keyword match
    const match = SIMULATED_ANSWERS.find((item) =>
      item.keywords.some((kw) => question.toLowerCase().includes(kw))
    );

    const result = match || {
      keywords: [],
      answer: "I'd love to help you! To give you a clear answer grounded in our guides, could you ask about Gmail passwords, making strong passwords, spot scam emails, Zoom meetings, iPhone updates, or ChatGPT safety? I will explain everything in simple, plain language!",
      simpleAnswer: "1. Ask about passwords, Gmail, or Zoom.\n2. I will give you a very simple step list.",
      relatedSlug: "gmail-password-reset"
    };

    setFullResponse(result);
    setLoading(false);
    streamText(result.answer);
  };

  // Typing streaming effect
  const streamText = (text: string) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    let index = 0;
    setDisplayedAnswer("");
    
    const interval = setInterval(() => {
      index++;
      setDisplayedAnswer(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        typingIntervalRef.current = null;
      }
    }, 12);

    typingIntervalRef.current = interval;
  };

  // Toggle "Explain Simpler" Mode
  const handleToggleSimpler = () => {
    stop();
    const targetMode = !isSimplerMode;
    setIsSimplerMode(targetMode);

    const sourceText = liveAnswer 
      ? (targetMode ? liveSimpleAnswer : liveAnswer)
      : (targetMode ? fullResponse?.simpleAnswer : fullResponse?.answer);

    if (sourceText) {
      streamText(sourceText);
    }
  };

  const handleSpeak = () => {
    const textToSpeak = displayedAnswer || "Nothing to speak.";
    speak(textToSpeak);
  };

  const handleStopSpeech = () => {
    stop();
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative RAG glow badge */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />

      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900">Ask How to Tech AI</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Understands normal language questions</p>
          </div>
        </div>

        {/* Small key icon linking to settings */}
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-900 border border-slate-200/60 px-2.5 py-1 rounded-full transition-colors"
        >
          <Key className="w-3 h-3" />
          {apiKey ? "Live Connected" : "Local Prototype"}
        </button>
      </div>

      {/* AI Ask form input */}
      <form onSubmit={handleAsk} className="space-y-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              track === "everyday"
                ? "Ask me anything in normal words. Example: 'how do I reset my gmail password?'"
                : "Ask about frameworks, web dev, security, etc. Example: 'explain FastAPI'"
            }
            rows={3}
            className="w-full border border-slate-200 focus:border-slate-400 rounded-3xl p-4 text-xs md:text-sm outline-none resize-none shadow-inner bg-slate-50/50"
          />
          <button 
            type="submit"
            className="absolute right-3.5 bottom-4 p-2 bg-slate-900 text-white rounded-full shadow-md hover:bg-slate-800 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* LOADING STATES */}
      {loading && (
        <div className="mt-8 bg-slate-50 border border-slate-100/50 p-6 rounded-2xl text-center space-y-3">
          <div className="flex justify-center gap-1.5 items-center">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-100" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-200" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">
            {loadingMessages[loadingStep]}
          </h4>
          <div className="w-full bg-slate-100 rounded-full h-1 max-w-xs mx-auto overflow-hidden">
            <div 
              className="bg-emerald-500 h-1 rounded-full transition-all duration-500" 
              style={{ width: `${(loadingStep + 1) * 33.3}%` }}
            />
          </div>
        </div>
      )}

      {/* ANSWER OUTPUT BLOCK */}
      {!loading && displayedAnswer && (
        <div className="mt-8 border border-slate-100/80 p-6 rounded-[2rem] bg-white relative shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-current" />
              AI Answer Sheet
            </span>

            {/* Actions: Speak & Simplify (Everyday Track Only) */}
            {track === "everyday" && (
              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <button 
                    onClick={handleStopSpeech}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button 
                    onClick={handleSpeak}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-100 hover:bg-slate-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Listen
                  </button>
                )}

                <button 
                  onClick={handleToggleSimpler}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    isSimplerMode 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "text-slate-500 hover:text-slate-900 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {isSimplerMode ? "Standard Version" : "Explain Simpler"}
                </button>
              </div>
            )}
          </div>

          {/* Spoken output styled wrapper */}
          <div className="pl-1">
            <p className={`text-slate-700 leading-relaxed font-medium transition-all ${
              isSimplerMode ? "text-base md:text-lg text-slate-950 font-bold" : "text-xs md:text-sm"
            }`}>
              {displayedAnswer.split("\n").map((line, i) => (
                <span key={i} className="block mt-2 first:mt-0">
                  {line}
                </span>
              ))}
            </p>
          </div>

          {/* Granular AI Answer Feedback Rating Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100/60">
            {feedbackGiven ? (
              <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 text-center text-xs font-semibold text-emerald-800 animate-in fade-in duration-300">
                🎉 Thank you for enhancing our AI training database! ({feedbackGiven})
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Was this answer helpful?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven("Helpful")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 transition-colors"
                  >
                    Helpful 👍
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven("Confusing")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100/50 transition-colors"
                  >
                    Confusing 😕
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven("Outdated")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-150 transition-colors"
                  >
                    Outdated ⏳
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RAG Matching related guides link */}
          {fullResponse?.relatedSlug && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Grounded in guide content:
              </span>
              <button 
                onClick={() => onSelectGuide(fullResponse.relatedSlug)}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl transition-all"
              >
                Read Related Guide
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
