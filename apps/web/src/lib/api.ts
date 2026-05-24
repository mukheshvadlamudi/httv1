import { Guide } from "../data/mock-guides";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> || {}),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("how_to_tech_auth_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const data = await response.json();
      errorDetail = data.detail || "";
    } catch (_) {}
    throw new Error(errorDetail || `API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getGuides(): Promise<Guide[]> {
  const guides = await request<Array<Omit<Guide, "steps" | "glossary">>>("/guides");
  return guides.map((guide) => ({ ...guide, steps: [], glossary: [] }));
}

export async function getGuide(slug: string): Promise<Guide> {
  return request<Guide>(`/guides/${slug}`);
}

export interface Resource {
  id: number;
  sourceType: "website" | "youtube";
  name: string;
  url: string;
  category: string | null;
  whyUseful: string | null;
}

export async function getResources(sourceType: "website" | "youtube", limit = 100): Promise<Resource[]> {
  return request<Resource[]>(`/resources?source_type=${sourceType}&limit=${limit}`);
}

export interface AiAnswer {
  id: string;
  answer: string;
  relatedGuideSlugs: string[];
  sources: string[];
}

export async function askAi(question: string): Promise<AiAnswer> {
  return request<AiAnswer>("/ai/question", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export interface FeedbackCreate {
  rating: "helpful" | "not_helpful" | "easy" | "confusing";
  comment?: string;
}

export interface FeedbackRead {
  ok: boolean;
  id: number;
}

export async function submitGuideFeedback(slug: string, feedback: FeedbackCreate): Promise<FeedbackRead> {
  return request<FeedbackRead>(`/guides/${slug}/feedback`, {
    method: "POST",
    body: JSON.stringify(feedback),
  });
}

export async function submitAiFeedback(answerId: string, feedback: FeedbackCreate): Promise<FeedbackRead> {
  return request<FeedbackRead>(`/ai/answers/${answerId}/feedback`, {
    method: "POST",
    body: JSON.stringify(feedback),
  });
}

// User Authentication Endpoints
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface TokenPayload {
  access_token: string;
  token_type: string;
}

export async function registerUser(name: string, email: string, password: string): Promise<UserProfile> {
  return request<UserProfile>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string): Promise<TokenPayload> {
  return request<TokenPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<UserProfile> {
  return request<UserProfile>("/auth/me");
}


