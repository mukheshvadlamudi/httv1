import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Guide {
  title: string;
  description: string;
  tags: string[];
  steps: { order: number; title: string; body: string }[];
  glossary?: { term: string; definition: string }[];
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Load keys from ai/.env
    let geminiKey = process.env.GEMINI_API_KEY;
    let openaiKey = process.env.OPENAI_API_KEY;

    try {
      const envPath = path.resolve(process.cwd(), '../../ai/.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        for (const line of envContent.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const parts = trimmed.split('=');
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
            if (key === 'GEMINI_API_KEY') geminiKey = val;
            if (key === 'OPENAI_API_KEY') openaiKey = val;
          }
        }
      }
    } catch (e) {
      console.error("Could not read ai/.env:", e);
    }

    // If no keys found, we will return a simulated match
    const hasKeys = !!(geminiKey || openaiKey);

    // 2. Load local guides
    const guides: Guide[] = [];
    try {
      const guidesDir = path.resolve(process.cwd(), '../../content/guides');
      if (fs.existsSync(guidesDir)) {
        const files = fs.readdirSync(guidesDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = fs.readFileSync(path.join(guidesDir, file), 'utf8');
            guides.push(JSON.parse(content));
          }
        }
      }
    } catch (e) {
      console.error("Could not load guides:", e);
    }

    // 3. Search matching guide
    let bestMatch: Guide | null = null;
    let bestScore = 0;

    const queryWords = question.toLowerCase().replace(/[?,.!-()]/g, '').split(/\s+/).filter((w: string) => w.length > 2);
    for (const guide of guides) {
      let score = 0;
      const titleLower = guide.title.toLowerCase();
      const descLower = guide.description.toLowerCase();
      const tagsLower = guide.tags.map((t: string) => t.toLowerCase());
      const stepsText = guide.steps.map((s: any) => `${s.title} ${s.body}`.toLowerCase());
      const glossaryTerms = (guide.glossary || []).map((g: any) => g.term.toLowerCase());
      const glossaryDefs = (guide.glossary || []).map((g: any) => g.definition.toLowerCase());

      for (const term of glossaryTerms) {
        if (question.toLowerCase().includes(term)) {
          score += 15;
        }
      }

      for (const word of queryWords) {
        if (titleLower.includes(word)) score += 5;
        if (tagsLower.some((t: string) => t.includes(word))) score += 3;
        if (descLower.includes(word)) score += 2;
        if (glossaryTerms.some((t: string) => t.includes(word))) score += 6;
        if (glossaryDefs.some((d: string) => d.includes(word))) score += 1;
        if (stepsText.some((s: string) => s.includes(word))) score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = guide;
      }
    }

    // If we don't have keys, run simulated/local fallback
    if (!hasKeys) {
      const matchedSim = getSimulatedAnswer(question, bestMatch);
      return NextResponse.json({
        id: "sim-" + Math.random().toString(36).substr(2, 9),
        live: false,
        answer: matchedSim.answer,
        simpleAnswer: matchedSim.simpleAnswer,
        relatedSlug: matchedSim.relatedSlug
      });
    }

    // We have keys! Run live RAG compilation
    let systemPrompt = `You are a gentle, patient, and friendly technology coach for beginners and senior citizens.
Your job is to answer the user's technology questions in plain language, breaking down instructions into extremely clear, numbered step-by-step lists (1, 2, 3).
Avoid technical jargon or acronyms without explaining them simply first.
Keep all instructions practical, reassuring, and direct.`;

    let userContent = "";
    if (bestMatch && bestScore > 8) {
      const stepsText = bestMatch.steps.map(s => `Step ${s.order}: ${s.title}\n  ${s.body}`).join('\n');
      const glossaryText = (bestMatch.glossary || []).map(g => `- ${g.term}: ${g.definition}`).join('\n');
      userContent = `CONTEXT INFORMATION (Grounded Guide):
Guide Title: ${bestMatch.title}
Steps:
${stepsText}

Glossary:
${glossaryText}

User Question: ${question}
INSTRUCTION: Answer the user's question by explaining these steps in your own friendly words.`;
    } else {
      // Out of context / generic query
      userContent = `CONTEXT INFORMATION:
There is no official guide in our local database for this topic. 

INSTRUCTION: 
1. Determine if the user's question "${question}" is about technology (devices, apps, social media, settings, software, etc.).
2. If it is NOT about technology (e.g. general history, recipes, math, coding code blocks, trivia), politely refuse to answer. Explain that you are a technology coach and can only help with tech tasks.
3. If it IS about technology (like deleting Instagram, setting up Wi-Fi, using Facebook), use your general knowledge to answer it.
4. IMPORTANT: You must write a simple, custom step-by-step guide (1, 2, 3). Keep it extremely friendly, jargon-free, and simple for a beginner.`;
    }

    // Call live LLM (prefer Gemini)
    let answerText = "";
    if (geminiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        answerText = data.candidates[0].content.parts[0].text;
      } else {
        const errText = await res.text();
        throw new Error(`Gemini API error: ${errText}`);
      }
    } else if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.2
        })
      });
      if (res.ok) {
        const data = await res.json();
        answerText = data.choices[0].message.content;
      } else {
        const errText = await res.text();
        throw new Error(`OpenAI API error: ${errText}`);
      }
    }

    // Generate simpler version
    let simpleAnswerText = "";
    if (geminiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Translate this instruction list into ultra-basic, short commands for a senior citizen. Maximum 5 short lines, starting with big numbers (1, 2, 3). Use zero technical words.\n\nInput List:\n${answerText}` }]
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        simpleAnswerText = data.candidates[0].content.parts[0].text;
      }
    } else if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Translate this instruction list into ultra-basic, short commands for a senior citizen. Maximum 5 short lines, starting with big numbers. Use zero technical words.' },
            { role: 'user', content: answerText }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        simpleAnswerText = data.choices[0].message.content;
      }
    }

    return NextResponse.json({
      id: "ai-" + Math.random().toString(36).substr(2, 9),
      live: true,
      answer: answerText,
      simpleAnswer: simpleAnswerText || "1. Follow instructions on screen.\n2. Tap confirm to save.",
      relatedSlug: bestMatch ? bestMatch.title.toLowerCase().replace(/\s+/g, '-') : 'general'
    });

  } catch (e: any) {
    console.error("API Route error:", e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Simulated local fallback database
function getSimulatedAnswer(question: string, matchedGuide: Guide | null) {
  if (matchedGuide) {
    const stepsList = matchedGuide.steps.map(s => `${s.order}. ${s.title}`).join('\n');
    return {
      answer: `Here are the steps to ${matchedGuide.title.toLowerCase()}:\n\n` + 
              matchedGuide.steps.map(s => `${s.order}. ${s.title}: ${s.body}`).join('\n\n') + 
              `\n\nI hope this makes it clear!`,
      simpleAnswer: stepsList,
      relatedSlug: matchedGuide.title.toLowerCase().replace(/\s+/g, '-')
    };
  }

  return {
    answer: "I'd love to help you! To give you a clear answer grounded in our guides, could you ask about Gmail passwords, making strong passwords, spot scam emails, Zoom meetings, iPhone updates, or ChatGPT safety? I will explain everything in simple, plain language!",
    simpleAnswer: "1. Ask about passwords, Gmail, or Zoom.\n2. I will give you a very simple step list.",
    relatedSlug: "gmail-password-reset"
  };
}
