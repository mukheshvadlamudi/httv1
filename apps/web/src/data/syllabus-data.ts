import syllabusJson from "./syllabus-data.json";

export interface SyllabusChapter {
  id: string;
  order: number;
  title: string;
  plainText: string;
  documentIds: number[];
  youtubeIds: number[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

export interface SyllabusTrack {
  id: string;
  title: string;
  description: string;
  domain: "webdev" | "ai" | "security" | "design" | "blockchain" | "creative3d";
  category: "Frontend" | "Backend" | "Full Stack" | "AI Engineering" | "Security" | "Design & UX" | "Web3" | "3D Graphics";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  chapters: SyllabusChapter[];
  quiz: QuizQuestion[];
}

// Strictly cast the imported JSON data to our typed tracks array
export const SYLLABUS_TRACKS = syllabusJson.tracks as SyllabusTrack[];
