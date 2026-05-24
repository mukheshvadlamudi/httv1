# How to Tech - API Contracts

This document establishes the contracts between the Next.js Frontend (`apps/web`), the FastAPI Backend (`apps/api`), and the AI Layer.

---

## 1. Guide Endpoints

### GET `/api/guides`
Retrieve a list of all tech guides, supporting pagination and filtering.

**Query Parameters:**
- `category` (optional, string): Filter by category.
- `difficulty` (optional, string): Filter by difficulty level (`Easy`, `Medium`, `Hard`).
- `search` (optional, string): Text search query.

**Response (200 OK):**
```json
[
  {
    "id": "gmail-password-reset",
    "slug": "gmail-password-reset",
    "title": "How to reset your Gmail password",
    "description": "A simple guide to recover or change your Gmail password.",
    "category": "Email",
    "audience": "Beginner",
    "difficulty": "Easy",
    "estimatedMinutes": 5,
    "lastUpdated": "2026-05-23",
    "tags": ["gmail", "password", "account recovery"]
  }
]
```

### GET `/api/guides/{slug}`
Retrieve a single detailed guide sheet.

**Response (200 OK):**
```json
{
  "id": "gmail-password-reset",
  "slug": "gmail-password-reset",
  "title": "How to reset your Gmail password",
  "description": "A simple guide to recover or change your Gmail password.",
  "category": "Email",
  "audience": "Beginner",
  "difficulty": "Easy",
  "estimatedMinutes": 5,
  "lastUpdated": "2026-05-23",
  "steps": [
    {
      "order": 1,
      "title": "Open the sign-in page",
      "body": "Go to the Google sign-in page in your browser."
    }
  ],
  "glossary": [
    {
      "term": "Recovery email",
      "definition": "A backup email address used to help you get back into your account."
    }
  ],
  "tags": ["gmail", "password", "account recovery"]
}
```

---

## 2. Category Endpoints

### GET `/api/categories`
Retrieve all available guide categories.

**Response (200 OK):**
```json
[
  {
    "slug": "email",
    "name": "Email",
    "icon": "Mail",
    "description": "Sending emails, recovery, and inbox settings."
  }
]
```

---

## 3. Feedback Endpoints

### POST `/api/guides/{slug}/feedback`
Submit user feedback on a specific guide.

**Request Body:**
```json
{
  "helpful": true,
  "comment": "Optional additional feedback text from user."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Feedback submitted successfully"
}
```

### POST `/api/ai/answers/{id}/feedback`
Submit user feedback on an AI-generated answer.

**Request Body:**
```json
{
  "helpful": false,
  "comment": "Too complex, explain simpler next time."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "AI feedback recorded"
}
```

---

## 4. AI Endpoint

### POST `/api/ai/question`
Submit a question to the How to Tech AI coach.

**Request Body:**
```json
{
  "question": "How do I secure my Gmail account?",
  "track": "everyday" 
}
```

**Response (200 OK):**
```json
{
  "id": "ans-9018420194",
  "answer": "To secure your Gmail, follow these steps:\n1. Enable Two-Factor Authentication.\n2. Add a recovery phone number...",
  "related_guides": [
    "gmail-password-reset",
    "two-factor-auth"
  ],
  "glossary": [
    {
      "term": "Two-Factor Authentication (2FA)",
      "definition": "An extra security step where you enter a code sent to your phone as well as your password."
    }
  ]
}
```
