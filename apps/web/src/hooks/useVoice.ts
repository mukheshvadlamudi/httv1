import { useState, useEffect, useRef } from "react";

export interface UseVoiceResult {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useVoice(): UseVoiceResult {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const splitIntoSentences = (text: string): string[] => {
    // Basic sentence splitting by punctuation
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
  };

  const speak = (text: string) => {
    if (!isSupported || !synthRef.current) return;

    synthRef.current.cancel(); // Stop any ongoing speech

    const cleanedText = text.replace(/[*#_`[\]]/g, ""); // Strip markdown
    const sentences = splitIntoSentences(cleanedText);
    sentencesRef.current = sentences;
    setCurrentSentenceIndex(0);

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utteranceRef.current = utterance;

    // Track boundary events to highlight spoken sentences
    utterance.onboundary = (event) => {
      if (event.name === "sentence" || event.name === "word") {
        const charIndex = event.charIndex;
        const textBefore = cleanedText.slice(0, charIndex);
        const sentenceCount = splitIntoSentences(textBefore).length;
        setCurrentSentenceIndex(Math.max(0, sentenceCount - 1));
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
    };

    synthRef.current.speak(utterance);
  };

  const pause = () => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.resume();
    setIsPaused(false);
  };

  const stop = () => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
  };

  return {
    isSupported,
    isPlaying,
    isPaused,
    currentSentenceIndex,
    speak,
    pause,
    resume,
    stop,
  };
}
