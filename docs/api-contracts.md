# How to Tech API Contracts

Base URL for local development: `http://localhost:8000`

## Guides

### `GET /guides`

Query params:

- `q`: optional search text
- `category`: optional category slug
- `difficulty`: optional difficulty label

Response:

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

### `GET /guides/{slug}`

Returns the guide list shape plus:

```json
{
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
  ]
}
```

## Categories

### `GET /categories`

```json
[
  {
    "slug": "security",
    "name": "Security",
    "description": "Security guides for beginners."
  }
]
```

## Resources

Resources are imported from the private Excel workbook into the database. The workbook itself should stay outside the public repo.

### `GET /resources`

Query params:

- `source_type`: optional `website` or `youtube`
- `category`: optional category contains filter
- `q`: optional name/category/description search
- `limit`: optional, default `50`, max `100`

```json
[
  {
    "id": 1,
    "sourceType": "website",
    "name": "MDN Web Docs",
    "url": "https://developer.mozilla.org",
    "category": "Frontend / Web fundamentals",
    "whyUseful": "Best reference for HTML, CSS, JavaScript, browser APIs."
  }
]
```

## Feedback

### `POST /guides/{slug}/feedback`

```json
{
  "rating": "helpful",
  "comment": "This was easy to follow."
}
```

### `POST /ai/answers/{answer_id}/feedback`

Same request body as guide feedback.

Response:

```json
{
  "ok": true,
  "id": 1
}
```

## AI

### `POST /ai/question`

This is mocked for Sprint 1 and can later call the AI service interface.

```json
{
  "question": "How do I reset my Gmail password?"
}
```

Response:

```json
{
  "id": "answer-uuid",
  "answer": "Beginner-friendly answer text...",
  "relatedGuideSlugs": ["gmail-password-reset"],
  "sources": ["How to reset your Gmail password"]
}
```

