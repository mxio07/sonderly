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
