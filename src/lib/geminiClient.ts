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

export interface AskPastSelfStreamCallbacks {
  onStart?: (meta: { modelUsed: string; retrievedCount: number }) => void;
  onChunk: (text: string) => void;
  onDone?: (meta: { modelUsed: string }) => void;
  onError?: (error: Error) => void;
}

export async function requestGeminiAskPastSelfStream(
  question: string,
  contextEntries: ContextEntryPayload[],
  callbacks: AskPastSelfStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('/api/gemini/ask-past-self', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      contextEntries,
    }),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported by client environment.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const payloadStr = trimmed.slice(5).trim();
        if (!payloadStr) continue;

        try {
          const payload = JSON.parse(payloadStr);
          if (payload.type === 'start') {
            callbacks.onStart?.({
              modelUsed: payload.modelUsed,
              retrievedCount: payload.retrievedCount,
            });
          } else if (payload.type === 'chunk' && typeof payload.text === 'string') {
            callbacks.onChunk(payload.text);
          } else if (payload.type === 'done') {
            callbacks.onDone?.({
              modelUsed: payload.modelUsed,
            });
          } else if (payload.type === 'error') {
            const streamErr = new Error(payload.error || 'Server error during generation stream');
            callbacks.onError?.(streamErr);
            throw streamErr;
          }
        } catch (jsonErr: any) {
          if (jsonErr.message && payloadStr.includes(jsonErr.message)) {
            throw jsonErr;
          }
          console.warn('Failed to parse SSE payload:', payloadStr, jsonErr);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function requestGeminiAskPastSelf(
  question: string,
  contextEntries: ContextEntryPayload[]
): Promise<AskPastSelfResponse> {
  let answer = '';
  let modelUsed = 'gemini-3.6-flash';
  let retrievedCount = contextEntries.length;

  await requestGeminiAskPastSelfStream(question, contextEntries, {
    onStart: (meta) => {
      modelUsed = meta.modelUsed;
      retrievedCount = meta.retrievedCount;
    },
    onChunk: (text) => {
      answer += text;
    },
    onDone: (meta) => {
      modelUsed = meta.modelUsed;
    },
  });

  return {
    answer,
    modelUsed,
    retrievedCount,
    timestamp: new Date().toISOString(),
  };
}

export async function requestGoogleBookCover(title: string, author?: string, tag?: string) {
  const response = await fetch('/api/books/cover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, author, tag }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Book lookup failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function requestGoogleBooksBatch(books: Array<{ title: string; author?: string; tag?: string }>) {
  const response = await fetch('/api/books/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ books }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Batch book lookup failed' }));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

