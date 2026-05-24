# How to Tech - Product Skills Blueprint

## Product Vision

How to Tech is a plain-language learning and assistance product that helps people understand, choose, set up, and confidently use technology. It should feel calm, practical, and human: a place where a beginner can ask "how do I do this?" and receive guidance that is simple, accurate, and immediately usable.

FutureLab Studios can position How to Tech as a trust-first AI education and enablement layer for individuals, teams, and organizations that need technology adoption without jargon.

## Core Product Promise

Help anyone learn and use technology with confidence through:

- Step-by-step guides written in plain language.
- AI-assisted answers that adapt to the user's skill level.
- Visual walkthroughs for common digital tasks.
- Tool recommendations based on user goals, budget, and comfort level.
- Safe explanations of privacy, security, payments, accounts, AI tools, and workplace technology.
- Learning paths for individuals, families, students, employees, founders, and small businesses.

## Primary User Groups

- Beginners who feel overwhelmed by technology.
- Professionals trying to adopt AI tools at work.
- Small business owners who need practical digital systems.
- Students who want to learn modern tools faster.
- Parents and older adults who need friendly technology help.
- Corporate teams that need internal AI and software training.
- Founders and operators who need no-jargon CTO-style guidance.

## Frontend Skills And Features

### Landing Page UX

The landing page should be minimal, calm, and approachable. Use subtle pastel colors, generous spacing, soft contrast, and simple navigation. The design should avoid looking like a generic AI hype page. The first screen should immediately communicate that this is a practical technology guide, not a technical documentation site.

Recommended first-viewport structure:

- Clear headline: "Learn technology in plain language."
- Supporting copy: "Simple guides and AI help for everyday tools, work software, and modern AI."
- Primary action: "Start learning"
- Secondary action: "Ask a tech question"
- Visual signal: a clean interactive search or question box, not a decorative hero card.

### Visual Design Direction

- Palette: soft mint, pale sky, warm off-white, muted lavender, charcoal text, and gentle coral accents.
- Typography: modern sans-serif with strong readability.
- Layout: minimalist, content-forward, and spacious.
- Components: rounded subtly, but avoid overly pill-shaped UI everywhere.
- Motion: small transitions for search, cards, and guide steps; no distracting animation.
- Tone: encouraging, direct, and jargon-free.

### Key Frontend Pages

- Home: product promise, guide search, featured categories, popular guides.
- Guide Library: searchable and filterable technology guides.
- Guide Detail: step-by-step instructions, difficulty level, time estimate, screenshots, glossary, related guides.
- Ask How to Tech: AI question interface that returns plain-language answers and suggested guides.
- Learning Paths: curated sequences such as "AI Basics for Work", "Phone Safety", "Small Business Tech Stack", and "Beginner Internet Skills".
- Tool Finder: compare tools by use case, price, difficulty, privacy, and setup effort.
- Business Training: explain FutureLab Studios' corporate AI training and custom deployment services.
- Account Dashboard: saved guides, learning progress, bookmarks, organization access.
- Admin CMS: create, edit, review, tag, and publish guides.

### Essential UI Components

- Search-first guide finder.
- Category cards with icons and short descriptions.
- Plain-language glossary popovers.
- Step-by-step guide blocks.
- "Explain this simpler" control.
- Difficulty and confidence indicators.
- Tool comparison tables.
- Checklist-style setup flows.
- Copyable prompts and templates.
- Feedback controls: helpful, confusing, outdated, needs screenshot.
- Accessibility controls for text size and reading comfort.

### Accessibility And Trust

- WCAG-aware color contrast.
- Keyboard-friendly navigation.
- Screen-reader-friendly guide structure.
- No jargon without definitions.
- Clear source and review metadata for guides.
- Disclaimers for security, finance, health, and legal-adjacent technology topics.
- Visible "last updated" dates for all guides.

## Backend Skills And Features

### Core Backend Capabilities

- User authentication and role-based access.
- Guide content management.
- Search and filtering across guides, tools, categories, and learning paths.
- AI question-answering with retrieval from approved content.
- User progress tracking.
- Bookmarking and saved guides.
- Feedback collection for content improvement.
- Admin review workflow for guide quality.
- Analytics for popular questions, failed searches, and confusing steps.
- Organization/team support for corporate training customers.

## Open-Source LLM And AI Stack

### LLM Priorities

The AI layer should prioritize clarity, safety, and grounded answers over novelty. How to Tech should not act like an unrestricted chatbot. It should behave like a patient technology coach using approved guide content whenever possible.

### Recommended Open-Weight And Open-Source Models

Start with models that are practical to host or swap. The model market changes quickly, so the exact production model should be selected after license review, latency testing, retrieval quality testing, and cost benchmarking.

- Llama 4 or newer open-weight Llama models for general and multimodal assistance, subject to Meta license review.
- Mistral open models such as Mistral Large, Mistral Small, Ministral, or Devstral variants depending on the use case.
- Qwen open foundation models for language, code, math, reasoning, multilingual support, and mixture-of-experts deployments.
- Gemma 3 or newer Gemma open models for efficient text, vision, multilingual, and single-GPU deployments.
- Fully open research-oriented models should be considered when OSI-style openness, auditability, or reproducibility matters more than benchmark performance.

## RAG (Retrieval-Augmented Generation)

The AI answer flow should use RAG:

1. User asks a question.
2. System detects intent, skill level, and topic.
3. Relevant guides, glossary terms, and tool records are retrieved.
4. LLM answers using only trusted retrieved content where possible.
5. Answer includes a simple summary, steps, warnings, and related guides.
6. If confidence is low, the system asks a clarifying question or recommends human support.

## Brand Voice

How to Tech should sound:

- Clear.
- Patient.
- Friendly.
- Practical.
- Confident without being condescending.
- Plain-spoken without being childish.
