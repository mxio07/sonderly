import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Save, 
  Wand2, 
  Tag, 
  Lightbulb, 
  Clock, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  ExternalLink,
  GitFork,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { JournalEntry, RecommendedBook } from '../types';
import { requestGoogleBooksBatch, computeCosineSimilarity } from '../lib/geminiClient';

interface JournalEditorProps {
  entry: JournalEntry;
  allEntries?: JournalEntry[];
  onSelectEntry?: (entry: JournalEntry) => void;
  onUpdateEntry: (updated: Partial<JournalEntry>) => void;
  onSaveEntry: () => Promise<void>;
  onGenerateSummary: () => Promise<void>;
  isSaving: boolean;
  isSummarizing: boolean;
  saveStatus: 'idle' | 'saved' | 'error';
  errorMessage?: string | null;
}

const DEFAULT_BOOKS: RecommendedBook[] = [
  {
    id: 'book-1',
    title: 'The Courage to Be Disliked',
    author: 'Ichiro Kishimi & Fumitake Koga',
    tag: 'Adlerian Psychology & Self-Determination',
    coverUrl: null,
  },
  {
    id: 'book-2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    tag: 'Stoic Perspective & Inner Resilience',
    coverUrl: null,
  },
  {
    id: 'book-3',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    tag: 'Existential Clarity & Purpose',
    coverUrl: null,
  },
];

const PROMPT_TEMPLATES = [
  {
    label: 'Evening Reflection',
    prompt: 'What was the highlight of today? What challenged me, and how did I respond? What is one lesson I want to carry forward into tomorrow?',
  },
  {
    label: 'Gratitude & Wins',
    prompt: '3 things I am deeply grateful for today:\n1. \n2. \n3. \nOne small victory I achieved that gave me momentum:',
  },
  {
    label: 'Overcoming Friction',
    prompt: 'The obstacle or doubt currently on my mind is:\nThe worst-case scenario vs the realistic reality is:\nThe next actionable step I can take with calm confidence is:',
  },
  {
    label: 'Future Visioning',
    prompt: 'If today was 1 year in the future and everything went according to my best hopes, what does my life look like? What decisions made that possible?',
  },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  entry,
  allEntries = [],
  onSelectEntry,
  onUpdateEntry,
  onSaveEntry,
  onGenerateSummary,
  isSaving,
  isSummarizing,
  saveStatus,
  errorMessage,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [defaultBooksWithCovers, setDefaultBooksWithCovers] = useState<RecommendedBook[]>(DEFAULT_BOOKS);
  const [directImageFailed, setDirectImageFailed] = useState<Record<string, boolean>>({});
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Compute meaningfully related past reflections for the active entry using cosine similarity
  const relatedReflections = useMemo(() => {
    // Determine the active embedding vector for this entry
    const currentEmbedding =
      entry.embedding && Array.isArray(entry.embedding) && entry.embedding.length > 0
        ? entry.embedding
        : allEntries?.find((e) => e.id === entry.id)?.embedding;

    if (!currentEmbedding || !Array.isArray(currentEmbedding) || currentEmbedding.length === 0) {
      return [];
    }

    if (!allEntries || allEntries.length <= 1) {
      return [];
    }

    // Filter out the active entry itself; only examine other entries belonging to the authenticated user that have embeddings
    const otherEntries = allEntries.filter(
      (other) =>
        other.id !== entry.id &&
        other.embedding &&
        Array.isArray(other.embedding) &&
        other.embedding.length > 0
    );

    if (otherEntries.length === 0) {
      return [];
    }

    // Meaningful semantic similarity threshold (exclude weak or irrelevant matches)
    const SIMILARITY_THRESHOLD = 0.65;

    const scored = otherEntries
      .map((other) => ({
        entry: other,
        similarity: computeCosineSimilarity(currentEmbedding, other.embedding),
      }))
      .filter((item) => item.similarity >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3); // 2-3 most relevant entries

    return scored;
  }, [entry.id, entry.embedding, allEntries]);

  // Asynchronously resolve default book covers via server-side Google Books API proxy if needed
  useEffect(() => {
    let isMounted = true;
    async function loadDefaultCovers() {
      try {
        const res = await requestGoogleBooksBatch(
          DEFAULT_BOOKS.map((b) => ({ title: b.title, author: b.author, tag: b.tag }))
        );
        if (isMounted && res.books && res.books.length > 0) {
          setDefaultBooksWithCovers(res.books);
        }
      } catch (err) {
        console.warn('Could not load default book covers:', err);
      }
    }
    loadDefaultCovers();
    return () => {
      isMounted = false;
    };
  }, []);

  const wordCount = entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0;
  const charCount = entry.content.length;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const tag = newTagInput.trim().replace(/^#/, '');
      const existing = entry.tags || [];
      if (!existing.includes(tag)) {
        onUpdateEntry({ tags: [...existing, tag] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const existing = entry.tags || [];
    onUpdateEntry({ tags: existing.filter(t => t !== tagToRemove) });
  };

  const applyTemplate = (templatePrompt: string) => {
    if (entry.content.trim() && !window.confirm('Insert template text? This will append to your current reflection.')) {
      return;
    }
    const newContent = entry.content.trim() 
      ? `${entry.content}\n\n---\n${templatePrompt}` 
      : templatePrompt;
    onUpdateEntry({ content: newContent });
  };

  // Determine active book list: Gemini recommended books with Google Books covers or default books
  const currentBooks: RecommendedBook[] = 
    entry.summaryData?.recommendedBooks && entry.summaryData.recommendedBooks.length > 0
      ? entry.summaryData.recommendedBooks
      : defaultBooksWithCovers;

  return (
    <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      
      {/* Header bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
        <div className="flex-1">
          <input
            id="input-entry-title"
            type="text"
            value={entry.title}
            onChange={(e) => onUpdateEntry({ title: e.target.value })}
            placeholder="Title of this reflection..."
            className="w-full bg-transparent text-xl sm:text-2xl font-bold text-[#242220] placeholder-[#918B82] focus:outline-none focus:ring-2 focus:ring-[#638466]/20 rounded-lg px-2 -ml-2 transition-all"
          />
          <div className="flex items-center gap-3 text-xs text-[#666057] mt-1 pl-0.5">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#918B82]" />
              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* AI Summarize & Key Themes */}
          <button
            id="btn-ai-summarize"
            onClick={onGenerateSummary}
            disabled={isSummarizing || !entry.content.trim()}
            title="Generate AI summary, emotional tone & key insight"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F1F6F1] text-[#466548] hover:bg-[#E4EDE4] border border-[#DCE8DC] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isSummarizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#638466]" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-[#638466]" />
            )}
            <span>{isSummarizing ? 'Analyzing...' : 'AI Summary'}</span>
          </button>

          {/* Save Button */}
          <button
            id="btn-save-entry"
            onClick={onSaveEntry}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              saveStatus === 'saved'
                ? 'bg-[#466548] text-white shadow-xs'
                : 'bg-[#638466] hover:bg-[#527055] text-white'
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save to Firestore'}</span>
          </button>
        </div>
      </div>

      {/* Error banner if save fails */}
      {errorMessage && (
        <div className="p-3 bg-[#FDF4F0] border border-[#FADCD5] rounded-xl text-[#B6634C] text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C46A52] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={onSaveEntry}
            className="px-2.5 py-1 bg-[#C46A52] hover:bg-[#B05B44] rounded-lg text-white font-semibold transition-colors cursor-pointer"
          >
            Retry Save
          </button>
        </div>
      )}

      {/* Quick Prompt Templates Pill Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#666057] flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-[#B6634C]" />
          <span>Prompts:</span>
        </span>
        {PROMPT_TEMPLATES.map((tpl, i) => (
          <button
            key={i}
            id={`btn-prompt-template-${i}`}
            onClick={() => applyTemplate(tpl.prompt)}
            className="text-xs font-medium px-3 py-1 rounded-lg bg-[#F7F4EE] hover:bg-[#EDE8E1] text-[#423E39] hover:text-[#242220] border border-[#EAE4DC] transition-all cursor-pointer shadow-xs"
          >
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Journal Textarea */}
      <div className="relative">
        <textarea
          id="textarea-journal-content"
          value={entry.content}
          onChange={(e) => onUpdateEntry({ content: e.target.value })}
          placeholder="Write your raw thoughts, feelings, reflections, or questions here..."
          rows={10}
          className="w-full bg-[#FAF9F6]/90 border border-[#EDE8E1] rounded-xl p-4 text-[#242220] placeholder-[#918B82] font-sans text-sm sm:text-base leading-relaxed focus:outline-none focus:border-[#638466] focus:ring-2 focus:ring-[#638466]/20 transition-all resize-y min-h-[220px]"
        />
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EDE8E1]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666057]">
          <Tag className="w-3.5 h-3.5 text-[#B6634C]" />
          <span>Tags:</span>
        </div>
        {(entry.tags || []).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDF4F0] text-[#B6634C] border border-[#FADCD5] shadow-xs"
          >
            #{t}
            <button
              onClick={() => handleRemoveTag(t)}
              className="text-[#C46A52] hover:text-[#9E3E28] ml-1 font-bold cursor-pointer"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          id="input-tag-add"
          type="text"
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="+ Add tag (Press Enter)"
          className="bg-transparent text-xs text-[#423E39] placeholder-[#918B82] px-2 py-0.5 rounded-lg border border-transparent focus:border-[#DCE8DC] focus:outline-none"
        />
      </div>

      {/* Structured AI Summary Insights & Recommended Reads Deck */}
      {entry.summaryData && (
        <div className="mt-2 p-4 rounded-xl bg-[#F7F5F0] border border-[#EDE8E1] text-[#242220] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#466548]">
              <Sparkles className="w-3.5 h-3.5 text-[#638466]" />
              Gemini Synthesis
            </span>
            {entry.summaryData.sentiment && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F6F1] text-[#466548] border border-[#DCE8DC]">
                Mood: {entry.summaryData.sentiment}
              </span>
            )}
          </div>

          {entry.summaryData.summary && (
            <p className="text-xs sm:text-sm text-[#423E39] mb-3 leading-relaxed">
              {entry.summaryData.summary}
            </p>
          )}

          {entry.summaryData.keyInsight && (
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#DCE8DC] text-xs text-[#354E37] font-medium italic mb-3 shadow-xs">
              &ldquo;{entry.summaryData.keyInsight}&rdquo;
            </div>
          )}

          {entry.summaryData.keyThemes && entry.summaryData.keyThemes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#666057] font-medium text-[11px]">Identified Themes:</span>
              {entry.summaryData.keyThemes.map((th, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-[#FDF4F0] text-[#B6634C] font-medium text-[11px] border border-[#FADCD5]">
                  {th}
                </span>
              ))}
            </div>
          )}

          {/* Recommended Reads - Stacked Deck with Google Books Cover Art */}
          <div className="mt-5 pt-4 border-t border-[#EDE8E1]">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#466548]">
                <BookOpen className="w-4 h-4 text-[#638466]" />
                Recommended Reads
                <span className="text-[10px] lowercase font-normal px-2.5 py-0.5 rounded-full bg-[#E4EDE4] text-[#354E37] border border-[#D0E0D0] tracking-normal">
                  Google Books API
                </span>
              </span>
              <span className="text-xs font-medium text-[#666057] flex items-center gap-1.5 bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-[#EDE8E1]">
                <Layers className="w-3.5 h-3.5 text-[#638466]" />
                <span>Card {((activeBookIndex % currentBooks.length) + 1)} of {currentBooks.length} · Tap card to cycle</span>
              </span>
            </div>

            <div
              id="recommended-reads-deck"
              onClick={() => setActiveBookIndex((prev) => (prev + 1) % currentBooks.length)}
              className="relative h-[156px] sm:h-[152px] w-full cursor-pointer select-none mb-3"
              role="button"
              tabIndex={0}
              aria-label="Recommended Reads stacked cards, click or tap to cycle"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveBookIndex((prev) => (prev + 1) % currentBooks.length);
                }
              }}
            >
              {currentBooks.map((book, index) => {
                const effectiveIndex = activeBookIndex % currentBooks.length;
                const offset = (index - effectiveIndex + currentBooks.length) % currentBooks.length;

                let zIndex = 30;
                let transform = 'translateY(0px) scale(1)';
                let opacity = 1;
                let borderStyle = 'border-[#DCE8DC] bg-[#FFFFFF] shadow-sm';

                if (offset === 1) {
                  zIndex = 20;
                  transform = 'translateY(8px) scale(0.98)';
                  opacity = 0.88;
                  borderStyle = 'border-[#EDE8E1] bg-[#FAF9F6] shadow-xs';
                } else if (offset === 2) {
                  zIndex = 10;
                  transform = 'translateY(16px) scale(0.96)';
                  opacity = 0.72;
                  borderStyle = 'border-[#EDE8E1] bg-[#F7F4EE] shadow-xs';
                } else if (offset > 2) {
                  zIndex = 5;
                  transform = 'translateY(20px) scale(0.92)';
                  opacity = 0;
                  borderStyle = 'border-[#EDE8E1] bg-[#F7F4EE]';
                }

                const bookKey = book.id || `book-${index}-${book.title}`;
                const hasValidCover = book.coverUrl && !brokenImages[bookKey];

                return (
                  <div
                    key={bookKey}
                    id={`recommended-book-card-${index}`}
                    style={{
                      zIndex,
                      transform,
                      opacity,
                    }}
                    className={`absolute inset-x-0 top-0 rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 ease-out flex items-center justify-between gap-3 sm:gap-4.5 ${borderStyle}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Real Book Cover or Fallback Icon - Prominent Size */}
                      {hasValidCover ? (
                        <div className="w-18 h-26 sm:w-22 sm:h-29 rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#DCE8DC] shadow-xs shrink-0 flex items-center justify-center">
                          <img
                            src={
                              directImageFailed[bookKey]
                                ? `/api/books/image-proxy?url=${encodeURIComponent(book.coverUrl!)}`
                                : book.coverUrl!
                            }
                            alt={`Cover for ${book.title}`}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                            onError={() => {
                              if (!directImageFailed[bookKey]) {
                                setDirectImageFailed((prev) => ({ ...prev, [bookKey]: true }));
                              } else {
                                setBrokenImages((prev) => ({ ...prev, [bookKey]: true }));
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-18 h-26 sm:w-22 sm:h-29 rounded-xl bg-[#F1F6F1] border border-[#DCE8DC] flex flex-col items-center justify-center text-[#466548] shrink-0 font-bold text-xs gap-1.5 shadow-xs p-2 text-center">
                          <BookOpen className="w-6 h-6 text-[#638466]" />
                          <span className="text-[9px] font-bold text-[#638466] uppercase tracking-wider">Book</span>
                        </div>
                      )}

                      {/* Book Details: Title, Author, Thematic Takeaway */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h4 className="text-sm sm:text-base font-bold text-[#242220] leading-snug line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#466548] font-semibold mt-0.5 truncate">
                          by {book.author}
                        </p>
                        {book.tag && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="text-[11px] sm:text-xs text-[#666057] bg-[#F7F4EE] border border-[#EDE8E1] px-2.5 py-0.5 rounded-lg line-clamp-1 font-medium">
                              {book.tag}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action & Next Pill */}
                    <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      {book.infoLink && (
                        <a
                          href={book.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="View on Google Books"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#EDE8E1] text-[#666057] hover:text-[#242220] border border-[#EDE8E1] text-xs font-semibold transition-all cursor-pointer shadow-xs"
                        >
                          <span className="hidden sm:inline">Preview</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#638466]" />
                        </a>
                      )}
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#466548] bg-[#F1F6F1] px-2.5 py-1.5 rounded-xl border border-[#DCE8DC]">
                        <span>{index + 1}/{currentBooks.length}</span>
                        <span className="hidden sm:inline">· Next ↻</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Entry Threading / Related Reflections */}
      {relatedReflections.length > 0 && (
        <div id="section-related-reflections" className="mt-2 p-4 rounded-xl bg-[#FAF9F6] border border-[#EDE8E1] text-[#242220] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#466548]">
              <GitFork className="w-3.5 h-3.5 text-[#638466]" />
              Related Reflections
              <span className="text-[10px] lowercase font-normal px-2.5 py-0.5 rounded-full bg-[#E4EDE4] text-[#354E37] border border-[#D0E0D0] tracking-normal">
                Semantic Threading
              </span>
            </span>
            <span className="text-xs font-medium text-[#666057] flex items-center gap-1 bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#EDE8E1]">
              <span>{relatedReflections.length} connected {relatedReflections.length === 1 ? 'reflection' : 'reflections'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedReflections.map(({ entry: relatedEntry, similarity }) => {
              const dateStr = new Date(relatedEntry.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const matchPercent = Math.round(similarity * 100);
              const snippet =
                relatedEntry.content.slice(0, 80) + (relatedEntry.content.length > 80 ? '...' : '');

              return (
                <div
                  key={relatedEntry.id}
                  id={`related-entry-card-${relatedEntry.id}`}
                  onClick={() => onSelectEntry && onSelectEntry(relatedEntry)}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#EDE8E1] hover:border-[#DCE8DC] hover:bg-[#F7F5F0] transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open related reflection: ${relatedEntry.title || 'Untitled reflection'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEntry && onSelectEntry(relatedEntry);
                    }
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[#242220] group-hover:text-[#638466] transition-colors line-clamp-1">
                        {relatedEntry.title || 'Untitled Reflection'}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-[#918B82] group-hover:text-[#638466] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#666057] mb-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#918B82]" />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span className="text-[#466548] font-semibold bg-[#F1F6F1] px-1.5 py-0.2 rounded border border-[#DCE8DC]">
                        {matchPercent}% match
                      </span>
                    </div>

                    {snippet && (
                      <p className="text-xs text-[#666057] line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>
                    )}
                  </div>

                  {relatedEntry.tags && relatedEntry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-2.5 pt-2 border-t border-[#F2EFE9]">
                      {relatedEntry.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#666057] border border-[#EDE8E1]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
