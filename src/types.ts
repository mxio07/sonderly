export type ReflectionStyle = 'reflection' | 'brainstorm' | 'summary' | 'questions';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  style?: ReflectionStyle;
  modelUsed?: string;
}

export interface RecommendedBook {
  id?: string;
  title: string;
  author: string;
  tag?: string;
  coverUrl?: string | null;
  infoLink?: string | null;
  description?: string | null;
}

export interface SummaryData {
  title?: string;
  summary?: string;
  keyThemes?: string[];
  sentiment?: 'Positive' | 'Reflective' | 'Anxious' | 'Energized' | 'Grateful' | 'Mixed';
  keyInsight?: string;
  recommendedBooks?: RecommendedBook[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  summaryData?: SummaryData;
  messages: ChatMessage[];
  mood?: string;
  embedding?: number[];
  embeddingModel?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
