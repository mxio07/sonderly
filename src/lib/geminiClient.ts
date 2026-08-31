import { ChatMessage, ReflectionStyle, SummaryData } from '../types';

export interface ReflectResponse {
  text: string;
  modelUsed: string;
  timestamp: string;
}

export async function requestGeminiReflection(
  messages: Array<{ role: 'user' | 'model'; text: string }>,
  style: ReflectionStyle = 'reflection',
  entryContext: string = ''
): Promise<ReflectResponse> {
  const response = await fetch('/api/gemini/reflect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      style,
      entryContext,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function requestGeminiSummary(text: string): Promise<{ data: SummaryData; modelUsed: string }> {
  const response = await fetch('/api/gemini/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function requestGeminiTitle(text: string): Promise<{ title: string; modelUsed: string }> {
  const response = await fetch('/api/gemini/title', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function requestGeminiEmbedding(text: string): Promise<{ embedding: number[]; dimensions: number; modelUsed: string }> {
  const response = await fetch('/api/gemini/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

/**
 * Computes cosine similarity between two numeric vectors.
 * Returns a value between -1.0 and 1.0 (typically 0.0 to 1.0 for normalized text embeddings).
 */
export function computeCosineSimilarity(vecA?: number[], vecB?: number[]): number {
  if (!vecA || !vecB || !Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecB.length === 0) {
    return 0;
  }

  const length = Math.min(vecA.length, vecB.length);
  if (length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return isNaN(similarity) ? 0 : similarity;
}

export interface ContextEntryPayload {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
  similarity?: number;
}

export interface AskPastSelfResponse {
  answer: string;
  modelUsed: string;
  retrievedCount: number;
  timestamp: string;
}

export async function requestGeminiAskPastSelf(
  question: string,
  contextEntries: ContextEntryPayload[]
): Promise<AskPastSelfResponse> {
  const response = await fetch('/api/gemini/ask-past-self', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      contextEntries,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

