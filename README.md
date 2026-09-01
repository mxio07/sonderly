# 🌤️ Sonderly — An AI Thinking Companion

> *sonder (n.) — the realization that each passer-by has a life as vivid and complex as your own.*
> 

Sonderly is a secure, multi-user AI application for people who want to **think things through** ; not just journal, but reflect, converse, and interrogate their own history with the help of Gemini. 

It goes well beyond a simple journal: it **retrieves and reasons over your past entries**, **surfaces connections across time**, and **recommends real books matched** to what you're working through. 

All on a production-grade, user-isolated, zero-hardcoded-secrets architecture.

Built for the **Google GenAI APAC / Cloud Run Build & Deploy Challenge**, starting from the "Personal Gemini Journal" baseline and extended into a genuinely distinct application.

**🔗 Live app:** *Deployment in progress — link coming soon*

**💻 Repository:** https://github.com/mxio07/sonderly

---

## ✨ What Makes Sonderly Different

Being a competitive person, I did my solid research and watched my competitors closely and noticed that most submissions to this challenge stop merely at the baseline: a simple sign in, chat with Gemini and save your entry and that’s it.

Well…that made me think that what makes Sonderly different from all these journals?

Sonderly is built as a **retrieval-augmented thinking tool**. These are the features designed and built *on top of* the baseline(which was just the basic codelab):

### 🔍 Semantic Search

Search your entries by **meaning, not keywords**.

 Every entry is embedded into a vector at save time (`gemini-embedding-2-preview`), and queries are matched by **cosine similarity**  so searching *"anxiety"* surfaces an entry that says *"my chest was tight before the meeting"* even though it never uses the word. 

This is by far my most favorite one if you ask me and I have previously used the same knowledge for my project and I can’t lie I enjoyed it even more here!

### 💬 Ask Your Past Self (RAG)

Ask questions about your own journaling history!

*"What have I written about my friendships?"*  and get an answer **grounded in your real past entries**, with the **source entries cited**.

 It's a full retrieval-augmented generation pipeline over personal data, with an **honesty guardrail**: if you've never written about a topic, it says so rather than fabricating a past that doesn't exist. That is the most interesting part about RAG that if there is no answer, you will NOT be lied to with hallucinations.

### 🧵 Entry Threading

When viewing an entry, Sonderly automatically surfaces **related past reflections** via embedding similarity, with a relevance threshold so only genuine connections appear.

What sets it apart from the other common features is that your journal becomes a connected web of thought overtime, not isolated notes that don’t make sense at all.

### 📚 Contextual Book Recommendations (Google Books API)

Being a book nerd myself, this feature was built purely by heart because sometimes when I have some strong emotions, I want to understand them but I get confused with this abundance of knowledge available, so this feature is a good one!

Gemini reads the emotional tone and theme of an entry and recommends real books that might help , which are fetched live from **Google Books API** with real cover art, displayed as a tap-to-cycle deck. A secure third-party API integration with graceful fallbacks.

### 🧭 Three Ways to Think

A guided entry point lets users choose how they want to engage:

- **Reflect & Synthesize** : write freely and receive an AI synthesis with emotional themes and book recommendations.
- **Talk it Through** : a real multi-turn conversation to untangle a problem or work through a decision.
- **Ask Your Past Self** : query your own journaling history and get answers grounded in your real past entries (see below).

---

## 🏗️ Architecture

Sonderly runs as a **single containerized service on Cloud Run** it is an Express/Node backend that both serves the React frontend and handles all AI and data operations server-side.

```
Browser (React) ──sign in──▶ Firebase Auth (ID token)
      │
      │  authenticated requests (ID token)
      ▼
Express backend (Cloud Run)
      ├─ verifies the Firebase ID token
      ├─ retrieves API keys server-side (never exposed to the browser)
      ├─ calls Gemini (chat, synthesis, embeddings)
      ├─ calls Google Books API
      └─ reads/writes Cloud Firestore, scoped to the verified user's UID
```

The core security principle: **the browser never holds a secret and never talks to a paid API directly.** All sensitive operations happen on the server, and all data access is bound to the authenticated user.

---

## 🔐 Security

Security is the foundation of this challenge, and Sonderly treats it as a first-class concern rather than an afterthought.

### User Authentication

- **Firebase Authentication** (Google Sign-In) : no password handling, server-side ID-token verification on every protected request.

### Per-User Data Isolation (Zero Cross-User Leakage)

Every user's data lives under their own UID path (`/users/{userId}/...`), and access is enforced **at the database layer** by Firestore Security Rules — not just in application code. Even if the frontend were fully compromised, the database itself rejects any cross-user access.

```jsx
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User-isolated interactions and journal entries
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This isolation extends to the AI features too: semantic search, RAG, and entry threading only ever query the authenticated user's own documents — cross-user retrieval is impossible by construction.

### Secure Key Management

- **No hardcoded secrets.** API keys are retrieved **server-side only** and never shipped to the browser.
- In production, keys are designed to be retrieved via **Google Cloud Secret Manager**; a secure server-side environment variable is used as the development fallback.
- The Gemini and Google Books keys are used exclusively on the Express backend.

### Threat Modeling & Secure Coding

Development was governed by custom security directives (an evolving "constitution" in Google AI Studio) covering:

- **Agentic threat modeling** across input surfaces, tool execution, and memory/state.
- **OWASP Web & LLM Top 10** : input validation, prompt-injection safety (retrieved entry content is treated as data, never instructions), and safe output handling.
- **Zero insecure defaults** in Firestore rules, and undefined-stripping before writes for data integrity.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript |
| Backend | Node.js / Express (single Cloud Run service) |
| AI — generation | Gemini API (`gemini-3.6-flash`) |
| AI — embeddings | Gemini embeddings (`gemini-embedding-2-preview`) with a resilient fallback ladder |
| Authentication | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore (user-isolated) |
| External API | Google Books API |
| Secrets | Google Cloud Secret Manager (prod) / server-side env var (dev) |
| Deployment | Google Cloud Run (containerized) |

---

## 🚀 Setup & Deployment

### Prerequisites

- A Google Cloud project with billing enabled
- Firebase project (Authentication + Firestore enabled)
- `gcloud` CLI (or Google Cloud Shell)

### Environment Variables

The backend expects the following (set as environment variables locally / Secret Manager in production — never hardcoded):

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API access (chat, synthesis, embeddings) |
| `GOOGLE_BOOKS_API_KEY` | Google Books API (book cover lookups) |
| Firebase config | Firebase Auth / Firestore project configuration |

### Firestore Security Rules

Deploy the rules in `firestore.rules` (shown above) to enforce per-user data isolation.

### Deploy to Cloud Run

The app is deployed from Google AI Studio's publish flow (or via `gcloud run deploy`), which builds the container and provisions a public Cloud Run service.

The Cloud Run service is labeled for challenge verification:

```
dev-tutorial = cloud-run-ai-challenge
```

---

## 🎯 Beyond the Baseline

The challenge baseline provides: Firebase Auth, multi-turn Gemini chat, user-isolated Firestore storage, and secure key management. **Sonderly extends the baseline** with the following original work:

- **Semantic search** over entries using Gemini embeddings + cosine similarity.
- **Ask Your Past Self** : retrieval-augmented Q&A over the user's own entries, with source attribution and an anti-hallucination honesty guardrail.
- **Entry threading** : automatic surfacing of semantically related past reflections, with a relevance threshold.
- **Google Books API integration** : real, secured third-party API for context-aware book recommendations with live cover art.
- **A three-mode UX** (Reflect & Synthesize / Talk it Through / Ask Your Past Self) with a guided choice screen.
- **A complete custom design system** and product identity.
- **Expanded security directives** in Google AI Studio covering each new feature (embeddings, RAG, third-party API), including OWASP-aligned threat modeling.

---

## 📄 License

[Choose a license — e.g. MIT — see note below]

---

*Built with Google AI Studio, Gemini, Firebase, and Cloud Run.*
