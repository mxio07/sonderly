import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Copy, 
  Check, 
  AlertCircle,
  Compass
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { JournalEntry } from '../types';
import { 
  requestGeminiEmbedding, 
  computeCosineSimilarity, 
  requestGeminiAskPastSelf,
  ContextEntryPayload 
} from '../lib/geminiClient';

interface AskPastSelfProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onNavigateToWrite: () => void;
}

interface QAResult {
  id: string;
  question: string;
  answer: string;
  modelUsed: string;
  timestamp: number;
  retrievedSources: Array<{
    entry: JournalEntry;
    similarity: number;
  }>;
}

const SUGGESTED_QUESTIONS = [
  'What were my core strategic priorities last month?',
  'Have I explored decision-making frameworks before?',
  'What key realizations or breakthroughs did I document?',
  'What recurring bottlenecks or cognitive biases have I noticed?',
  'How has my perspective on work or long-term vision evolved?',
];

export const AskPastSelf: React.FC<AskPastSelfProps> = ({
  entries,
  onSelectEntry,
  onNavigateToWrite,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qaHistory, setQaHistory] = useState<QAResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const entriesWithEmbeddings = entries.filter(
    (e) => Array.isArray(e.embedding) && e.embedding.length > 0
  );

  const handleAskQuestion = async (qToAsk?: string) => {
    const q = (qToAsk || question).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (entries.length === 0) {
        throw new Error('You do not have any saved reflections yet. Write your first reflection so your memory system has context to synthesize from!');
      }

      // 1. Generate Question Embedding via Server-Side Gemini endpoint
      let queryVector: number[] | null = null;
      try {
        const embedRes = await requestGeminiEmbedding(q);
        queryVector = embedRes.embedding;
      } catch (err: any) {
        console.warn('Direct embedding failed, will proceed with available text context:', err);
      }

      // 2. Retrieve most relevant entries using Cosine Similarity
      let retrievedItems: Array<{ entry: JournalEntry; similarity: number }> = [];

      if (queryVector && entriesWithEmbeddings.length > 0) {
        retrievedItems = entriesWithEmbeddings
          .map((entry) => ({
            entry,
            similarity: computeCosineSimilarity(queryVector!, entry.embedding),
          }))
          .filter((item) => item.similarity > 0.2) // Only include meaningful matches
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5); // Top 5 most relevant entries
      }

      // Fallback: If no vector matches found or no embeddings yet, retrieve recent entries
      if (retrievedItems.length === 0) {
        retrievedItems = entries
          .slice(0, 4)
          .map((entry) => ({ entry, similarity: 0 }));
      }

      // 3. Format context payloads for the server-side RAG endpoint
      const contextPayloads: ContextEntryPayload[] = retrievedItems.map(({ entry, similarity }) => ({
        id: entry.id,
        title: entry.title || 'Untitled Reflection',
        content: entry.content,
        date: new Date(entry.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        tags: entry.tags,
        similarity,
      }));

      // 4. Invoke Server-Side Grounded RAG Endpoint
      const response = await requestGeminiAskPastSelf(q, contextPayloads);

      const newQA: QAResult = {
        id: `qa_${Date.now()}`,
        question: q,
        answer: response.answer,
        modelUsed: response.modelUsed,
        timestamp: Date.now(),
        retrievedSources: retrievedItems,
      };

      setQaHistory((prev) => [newQA, ...prev]);
      setQuestion('');
    } catch (err: any) {
      console.error('Ask Past Self error:', err);
      setErrorMessage(err?.message || 'Failed to retrieve grounded reflection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E0D8CA] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#F5EFE6] text-[#593A12] border border-[#DFCBA8] mb-3">
              <Sparkles className="w-4 h-4 text-[#8C5E24]" />
              <span>Grounded RAG Reflection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1F1D1A]">
              Ask Your Past Self
            </h2>
            <p className="text-sm sm:text-base text-[#3D352E] mt-2 leading-relaxed max-w-2xl font-normal">
              Query your personal reflection history. Sonderly uses vector semantic search over your private, user-isolated thoughts and synthesizes clear answers strictly grounded in what you actually wrote.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs sm:text-sm text-[#4D453B] font-semibold">
            <span className="font-bold text-[#593A12] font-mono">
              {entriesWithEmbeddings.length} of {entries.length} indexed
            </span>
            <span className="text-[#6B6052]">Zero Cross-User Leakage</span>
          </div>
        </div>

        {/* Question Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="mt-6 space-y-3"
        >
          <div className="relative">
            <input
              id="input-ask-past-self"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about your past reflections... (e.g. 'What was I feeling about my goals in June?')"
              disabled={isLoading}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CA] focus:border-[#8C5E24] rounded-xl pl-4 pr-32 py-3.5 text-sm sm:text-base text-[#1F1D1A] placeholder-[#6B6052] focus:outline-none focus:ring-2 focus:ring-[#8C5E24]/20 transition-all font-normal"
            />
            <button
              id="btn-submit-ask-past-self"
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-[#8C5E24] hover:bg-[#734A18] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Reflecting...</span>
                </>
              ) : (
                <>
                  <span>Ask</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1.5">
            <span className="text-xs sm:text-sm text-[#4D453B] font-bold flex items-center gap-1 mr-1">
              <Compass className="w-4 h-4 text-[#8C5E24]" />
              <span>Try asking:</span>
            </span>
            {SUGGESTED_QUESTIONS.map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => {
                  setQuestion(promptText);
                  handleAskQuestion(promptText);
                }}
                disabled={isLoading}
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EAE1] text-[#2A241F] hover:text-[#000000] border border-[#E0D8CA] transition-colors cursor-pointer text-left font-semibold shadow-2xs"
              >
                &ldquo;{promptText}&rdquo;
              </button>
            ))}
          </div>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-[#FDF3F0] border border-[#FADCD5] rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-[#9E4733] font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C46A52] mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Unable to complete reflection</p>
              <p className="mt-0.5 text-[#9E4733]">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Placeholder */}
      {isLoading && (
        <div className="bg-[#FFFFFF] border border-[#DFCBA8] rounded-2xl p-8 text-center space-y-3 shadow-xs animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center mx-auto text-[#8C5E24]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F1D1A]">Consulting your past reflections...</h3>
          <p className="text-xs sm:text-sm text-[#3D352E] max-w-md mx-auto font-normal">
            Generating semantic query vector, retrieving matching entry excerpts via cosine similarity, and synthesizing a grounded answer with Gemini.
          </p>
        </div>
      )}

      {/* Empty State when no Q&A yet */}
      {qaHistory.length === 0 && !isLoading && (
        <div className="bg-[#FFFFFF] border border-[#E0D8CA] rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CA] flex items-center justify-center mx-auto text-[#8C5E24]">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1F1D1A]">No conversations with your past self yet</h3>
            <p className="text-xs sm:text-sm text-[#3D352E] mt-1.5 max-w-md mx-auto leading-relaxed font-normal">
              Ask a question above to explore patterns, strategic shifts, or core decisions across your reflections. Sonderly connects the dots while remaining strictly grounded in what you actually wrote.
            </p>
          </div>
          {entries.length === 0 && (
            <button
              onClick={onNavigateToWrite}
              className="px-5 py-2.5 bg-[#8C5E24] hover:bg-[#734A18] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>Write Your First Reflection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Q&A Stream History */}
      <div className="space-y-6">
        {qaHistory.map((qa) => (
          <div
            key={qa.id}
            id={`qa-card-${qa.id}`}
            className="bg-[#FFFFFF] border border-[#E0D8CA] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
          >
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EAE4DC]">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#1F1D1A] text-[#E5C287] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  Q
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1F1D1A]">
                    &ldquo;{qa.question}&rdquo;
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4D453B] mt-1.5 font-semibold flex-wrap font-mono">
                    <span>{new Date(qa.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>Model: {qa.modelUsed}</span>
                    <span>•</span>
                    <span className="text-[#593A12] font-bold">{qa.retrievedSources.length} sources referenced</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(qa.id, qa.answer)}
                title="Copy Answer"
                className="p-2.5 text-[#4D453B] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
              >
                {copiedId === qa.id ? <Check className="w-5 h-5 text-[#8C5E24]" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Grounded AI Answer */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] border border-[#DFCBA8] text-[#593A12] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                <Sparkles className="w-4.5 h-4.5 text-[#8C5E24]" />
              </div>
              <div className="flex-1 text-base sm:text-lg text-[#1F1D1A] leading-relaxed space-y-3 prose prose-stone max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-[#1F1D1A] leading-relaxed font-normal" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-[#1F1D1A] bg-[#F5EFE6] px-1.5 py-0.5 rounded border border-[#DFCBA8]" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1.5 mb-3 text-[#24201C]" {...props} />,
                    li: ({ node, ...props }) => <li className="text-[#24201C]" {...props} />,
                  }}
                >
                  {qa.answer}
                </ReactMarkdown>
              </div>
            </div>

            {/* Retrieved Source Excerpts Section */}
            {qa.retrievedSources.length > 0 && (
              <div className="pt-4 border-t border-[#EAE4DC] space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#3D352E] font-bold">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#8C5E24]" />
                    <span>Retrieved Entries From Your Private Journal</span>
                  </span>
                  <span className="text-xs text-[#4D453B] font-semibold">Click entry to view or edit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {qa.retrievedSources.map(({ entry, similarity }, idx) => {
                    const similarityPct = Math.round(similarity * 100);
                    return (
                      <div
                        key={entry.id}
                        id={`source-card-${qa.id}-${entry.id}`}
                        onClick={() => onSelectEntry(entry)}
                        className="p-3.5 bg-[#FAF8F5] hover:bg-[#F8F5F0] border border-[#E0D8CA] hover:border-[#8C5E24] rounded-xl transition-all cursor-pointer group flex flex-col justify-between text-left shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#2A241F] text-white font-mono">
                              #{idx + 1}
                            </span>
                            {similarity > 0 && (
                              <span className="text-xs font-bold text-[#593A12] bg-[#F5EFE6] px-2 py-0.5 rounded border border-[#DFCBA8] font-mono">
                                {similarityPct}% match
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-serif font-bold text-[#1F1D1A] group-hover:text-[#593A12] transition-colors truncate">
                            {entry.title || 'Untitled Reflection'}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#3D352E] line-clamp-2 mt-1 leading-snug font-normal">
                            {entry.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#4D453B] font-semibold mt-2.5 pt-2 border-t border-[#EAE4DC]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#8C5E24]" />
                            {new Date(entry.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-0.5 text-[#593A12] font-bold group-hover:underline">
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
