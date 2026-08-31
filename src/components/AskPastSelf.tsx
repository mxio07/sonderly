import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  Loader2, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle,
  Hash,
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
  'What was I worried about last month?',
  'Have I written about my friendships before?',
  'What were some wins or moments of gratitude I recorded?',
  'What recurring goals or habits have I mentioned?',
  'How has my perspective on work or projects evolved?',
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
        throw new Error('You do not have any saved journal reflections yet. Write your first reflection so your past self has memories to draw from!');
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
      <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F6F1] text-[#466548] border border-[#DCE8DC] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#638466]" />
              <span>Grounded RAG Reflection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242220]">
              Ask Your Past Self
            </h2>
            <p className="text-sm text-[#666057] mt-1.5 leading-relaxed max-w-2xl">
              Ask questions about your personal journaling history. Sonderly uses vector semantic search over your private, user-isolated entries and synthesizes thoughtful answers strictly grounded in what you actually wrote.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-[#918B82]">
            <span className="font-semibold text-[#466548] font-mono">
              {entriesWithEmbeddings.length} of {entries.length} indexed
            </span>
            <span>Zero Cross-User Leakage</span>
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
              className="w-full bg-[#FAF9F6] border border-[#EDE8E1] focus:border-[#638466] rounded-xl pl-4 pr-28 py-3 text-sm sm:text-base text-[#242220] placeholder-[#918B82] focus:outline-none focus:ring-2 focus:ring-[#638466]/20 transition-all"
            />
            <button
              id="btn-submit-ask-past-self"
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-[#638466] hover:bg-[#527055] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Reflecting...</span>
                </>
              ) : (
                <>
                  <span>Ask</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-[#918B82] font-medium flex items-center gap-1 mr-1">
              <Compass className="w-3 h-3 text-[#638466]" />
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
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F4EE] hover:bg-[#EDE8E1] text-[#666057] hover:text-[#242220] border border-[#EAE4DC] transition-colors cursor-pointer text-left"
              >
                "{promptText}"
              </button>
            ))}
          </div>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-[#FDF4F0] border border-[#FADCD5] rounded-xl flex items-start gap-2.5 text-xs text-[#B6634C]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C46A52] mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Unable to complete reflection</p>
              <p className="mt-0.5 text-[#A5553E]">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Placeholder */}
      {isLoading && (
        <div className="bg-[#FFFFFF] border border-[#DCE8DC] rounded-2xl p-8 text-center space-y-3 shadow-xs animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[#F1F6F1] flex items-center justify-center mx-auto text-[#638466]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-[#242220]">Consulting your past reflections...</h3>
          <p className="text-xs text-[#666057] max-w-md mx-auto">
            Generating semantic query vector, retrieving matching entry excerpts via cosine similarity, and synthesizing a grounded answer with Gemini.
          </p>
        </div>
      )}

      {/* Empty State when no Q&A yet */}
      {qaHistory.length === 0 && !isLoading && (
        <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-[#EDE8E1] flex items-center justify-center mx-auto text-[#638466]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#242220]">No conversations with your past self yet</h3>
            <p className="text-xs text-[#666057] mt-1 max-w-md mx-auto leading-relaxed">
              Ask a question above to explore themes, emotional shifts, or memories across your journal. Sonderly connects the dots across your entries while never inventing anything you didn't write.
            </p>
          </div>
          {entries.length === 0 && (
            <button
              onClick={onNavigateToWrite}
              className="px-4 py-2 bg-[#638466] hover:bg-[#527055] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Write Your First Reflection</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
            className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
          >
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#242220] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  Q
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#242220]">
                    "{qa.question}"
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#918B82] mt-1 font-mono">
                    <span>{new Date(qa.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>Model: {qa.modelUsed}</span>
                    <span>•</span>
                    <span className="text-[#466548]">{qa.retrievedSources.length} sources referenced</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(qa.id, qa.answer)}
                title="Copy Answer"
                className="p-2 text-[#918B82] hover:text-[#242220] hover:bg-[#F7F4EE] rounded-lg transition-colors cursor-pointer"
              >
                {copiedId === qa.id ? <Check className="w-4 h-4 text-[#638466]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Grounded AI Answer */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#F1F6F1] border border-[#DCE8DC] text-[#466548] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-[#638466]" />
              </div>
              <div className="flex-1 text-sm sm:text-base text-[#242220] leading-relaxed space-y-3 prose prose-stone max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-[#242220] leading-relaxed" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-[#242220] bg-[#F7F4EE] px-1 py-0.5 rounded" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-3 text-[#423E39]" {...props} />,
                    li: ({ node, ...props }) => <li className="text-[#423E39]" {...props} />,
                  }}
                >
                  {qa.answer}
                </ReactMarkdown>
              </div>
            </div>

            {/* Retrieved Source Excerpts Section */}
            {qa.retrievedSources.length > 0 && (
              <div className="pt-4 border-t border-[#EDE8E1] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#666057] font-medium">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#638466]" />
                    <span>Retrieved Entries From Your Private Journal</span>
                  </span>
                  <span className="text-[11px] text-[#918B82]">Click entry to view or edit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {qa.retrievedSources.map(({ entry, similarity }, idx) => {
                    const similarityPct = Math.round(similarity * 100);
                    return (
                      <div
                        key={entry.id}
                        id={`source-card-${qa.id}-${entry.id}`}
                        onClick={() => onSelectEntry(entry)}
                        className="p-3 bg-[#FAF9F6] hover:bg-[#F7F4EE] border border-[#EDE8E1] hover:border-[#DCE8DC] rounded-xl transition-all cursor-pointer group flex flex-col justify-between text-left"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#242220] text-white font-mono">
                              #{idx + 1}
                            </span>
                            {similarity > 0 && (
                              <span className="text-[10px] font-semibold text-[#466548] bg-[#F1F6F1] px-1.5 py-0.5 rounded border border-[#DCE8DC] font-mono">
                                {similarityPct}% match
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-[#242220] group-hover:text-[#638466] transition-colors truncate">
                            {entry.title || 'Untitled Reflection'}
                          </h4>
                          <p className="text-[11px] text-[#666057] line-clamp-2 mt-1 leading-snug">
                            {entry.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#918B82] mt-2 pt-2 border-t border-[#EDE8E1]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-0.5 text-[#638466] font-semibold group-hover:underline">
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
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
