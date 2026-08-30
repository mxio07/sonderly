# Sonderly — Multi-Turn AI Journaling & Reflection Application

A secure, user-authenticated journaling web application powered by **Google Firebase Authentication**, **Cloud Firestore** (with owner-bound data isolation), and server-side **Gemini 3.6 Flash** reflections.

---

## 🌟 Application Features

1. **Federated Authentication**: Passwordless Google Sign-In via Firebase Auth.
2. **User-Isolated Firestore Storage**: Every reflection and interaction log is strictly sandboxed under `/users/{userId}/...` with locked-down security rules.
3. **Gemini 3.6 Flash Multi-Turn Dialogue**: Conversational journal companion with 4 specialized reflection modes (*Deep Reflection*, *Creative Brainstorm*, *Socratic Prompts*, and *Synthesis*).
4. **Resilient Fallback Ladder**: Robust automated fallback (`gemini-3.6-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest` -> `gemini-3.7-flash`) with error status code recovery.
5. **Automated Qualitative Summarization**: Instant extraction of mood/sentiment, key insight, and thematic tags.
6. **Zero-Crash Undefined-Stripping Hygiene**: Payload sanitization before writing to Cloud Firestore.

---

## 🛡️ Agentic Threat Modeling & Security Directives

### 1. The 5 Threat Zones Analysis

| Threat Zone | Scenario / Risk | Implemented Countermeasure | OWASP Standard |
| :--- | :--- | :--- | :--- |
| **Input Surfaces** | Malicious injection in journal text | Schema validation; user text treated as conversational data, not instruction overrides. | OWASP A03 / LLM02 |
| **Planning & Reasoning** | System prompt override | Explicit system role constraints isolating journal context from system directives. | OWASP LLM01 |
| **Tool Execution** | API Key leakage or direct model misuse | API key encapsulated server-side; client calls backend proxy with resilient fallback ladder. | OWASP A01 / A05 |
| **Memory & State** | Cross-user data snooping | Owner-bound Firestore Security Rules enforcing `request.auth.uid == userId`. | OWASP A01 |
| **Inter-System Comm** | Undefined payload crashes & token leaks | Zero-crash payload sanitization (`sanitizeForFirestore`) and HTTPS transport. | OWASP A02 |

---

## 🔒 Firestore Security Rules

Deploy the following owner-bound security rules to ensure zero cross-user access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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

---

## 🔑 Google Cloud Secret Manager Setup

Store your Gemini API key in Secret Manager and grant access to your Cloud Run service account:

```bash
# 1. Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. Grant the default Cloud Run service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🚀 Google Cloud Run Deployment

### 1. Build and Deploy Service

```bash
# Enable required Google Cloud APIs
gcloud services enable run.googleapis.com secretmanager.googleapis.com firestore.googleapis.com

# Deploy the container to Google Cloud Run
gcloud run deploy reflectai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### 2. Mandatory Verification Labeling

Apply the challenge verification label to register the service:

```bash
gcloud run services update reflectai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 🧪 Functional Verification Test Walkthrough

| Test ID | Process | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | **Google Sign-In** | Click "Sign In with Google", select account. | Profile synced, user enters private workspace. |
| **TC-02** | **Journal Writing** | Add title, insert prompt template, write reflection. | Reactive character and word counters update. |
| **TC-03** | **Firestore Persistence** | Click "Save to Firestore". | Stored under `/users/{userId}/entries/{entryId}`. |
| **TC-04** | **Gemini Dialogue** | Select mode, ask question, click Send. | Gemini streams empathetic response with Markdown. |
| **TC-05** | **AI Synthesis** | Click "AI Summary". | Sentiment, key insight, and thematic tags rendered. |
| **TC-06** | **Search & Deletion** | Filter entries by tag/keyword, delete entry. | Firestore real-time listener updates view. |
