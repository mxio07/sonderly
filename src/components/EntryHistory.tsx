import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Plus, 
  ChevronRight,
  Loader2,
  X,
  AlertCircle,
  Hash
} from 'lucide-react';
import { JournalEntry } from '../types';
import { requestGeminiEmbedding, computeCosineSimilarity } from '../lib/geminiClient';

interface EntryHistoryProps {
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onNewEntry: () => void;
  onNavigateToAsk?: () => void;
}

interface RankedEntry {
  entry: JournalEntry;
  similarity: number;
  rank: number;
}

export const EntryHistory: React.FC<EntryHistoryProps> = ({
  entries,
  activeEntryId,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
  onNavigateToAsk,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Semantic Search State
  const [isSemanticSearching, setIsSemanticSearching] = useState(false);
  const [semanticResults, setSemanticResults] = useState<RankedEntry[] | null>(null);
  const [activeSemanticQuery, setActiveSemanticQuery] = useState<string | null>(null);
  const [semanticError, setSemanticError] = useState<string | null>(null);

  // In-App Deletion Confirmation Modal State
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(entries.flatMap((e) => e.tags || []))
  ).filter(Boolean);

  // Count how many entries have embeddings
  const entriesWithEmbeddingsCount = entries.filter((e) => Array.isArray(e.embedding) && e.embedding.length > 0).length;

  const handleExecuteSemanticSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSemanticSearching(true);
    setSemanticError(null);

    try {
      // 1. Generate query embedding securely via server-side Gemini endpoint
      const embedResponse = await requestGeminiEmbedding(query);
      const queryVec = embedResponse.embedding;

      if (!queryVec || !Array.isArray(queryVec) || queryVec.length === 0) {
        throw new Error('Server returned an empty embedding vector');
      }

      // 2. Filter current user's entries with embeddings and calculate cosine similarity
      const ranked: RankedEntry[] = entries
        .map((entry) => {
          if (!entry.embedding || !Array.isArray(entry.embedding) || entry.embedding.length === 0) {
            return { entry, similarity: -1, rank: 0 };
          }
          const similarity = computeCosineSimilarity(queryVec, entry.embedding);
          return { entry, similarity, rank: 0 };
        })
        .filter((item) => item.similarity > -1)
        .sort((a, b) => b.similarity - a.similarity)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

      setSemanticResults(ranked);
      setActiveSemanticQuery(query);
    } catch (err: any) {
      console.error('Semantic search error:', err);
      setSemanticError(err?.message || 'Failed to complete semantic search. Please try again.');
    } finally {
      setIsSemanticSearching(false);
    }
  };

  const handleClearSemanticSearch = () => {
    setSemanticResults(null);
    setActiveSemanticQuery(null);
    setSemanticError(null);
    setSearchQuery('');
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      !searchQuery.trim() ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTag = !selectedTag || (e.tags && e.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const handleDelete = (e: React.MouseEvent, entryId: string, title: string) => {
    e.stopPropagation();
    setDeleteError(null);
    setEntryToDelete({ id: entryId, title: title || 'Untitled Entry' });
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDeleteEntry(entryToDelete.id);
      // If currently showing semantic results, remove deleted entry from semantic list
      if (semanticResults) {
        setSemanticResults((prev) => prev ? prev.filter((r) => r.entry.id !== entryToDelete.id) : null);
      }
      setEntryToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete entry:', err);
      setDeleteError(err?.message || 'Failed to delete entry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setEntryToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full min-h-[500px]">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4DC]">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#1F1D1A] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B88746]" />
            <span>Past Reflections</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C6226] font-semibold border border-[#E8DCB8]">
              {entries.length} total
            </span>
          </h2>
          <p className="text-xs text-[#7C7469] mt-0.5">Isolated &amp; stored securely in your private Cloud Firestore collection</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onNavigateToAsk && (
            <button
              id="btn-history-goto-ask"
              onClick={onNavigateToAsk}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F5EFE6] hover:bg-[#EDE3D4] text-[#8C6226] border border-[#E8DCB8] transition-all shadow-xs cursor-pointer"
              title="Ask questions grounded in your past reflections"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B88746]" />
              <span>Ask Past Self</span>
            </button>
          )}

          <button
            id="btn-history-new-entry"
            onClick={onNewEntry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#B88746] hover:bg-[#A37438] text-white transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Semantic Search & Filter Bar */}
      <div className="py-3.5 border-b border-[#EAE4DC] space-y-2.5">
        <form onSubmit={handleExecuteSemanticSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9E9589]" />
            <input
              id="input-history-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search semantically (e.g., 'feeling anxious about goals') or by keyword..."
              className="w-full bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-[#1F1D1A] placeholder-[#9E9589] focus:outline-none focus:border-[#B88746] focus:ring-2 focus:ring-[#B88746]/20"
            />
            {searchQuery && (
              <button
                type="button"
                id="btn-clear-search-input"
                onClick={handleClearSemanticSearch}
                className="absolute right-2.5 top-2.5 text-[#9E9589] hover:text-[#1F1D1A] cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-semantic-search"
              type="submit"
              disabled={isSemanticSearching || !searchQuery.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2A241F] hover:bg-[#1F1B17] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
              title="Compare query vector embedding against stored entry embeddings with cosine similarity"
            >
              {isSemanticSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Ranking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>Semantic Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Semantic Error Alert */}
        {semanticError && (
          <div className="p-2.5 bg-[#FDF3F0] border border-[#FADCD5] rounded-xl flex items-center justify-between text-xs text-[#9E4733]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C46A52]" />
              <span>{semanticError}</span>
            </div>
            <button
              onClick={() => setSemanticError(null)}
              className="p-1 hover:text-[#1F1D1A] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Semantic Filter Banner */}
        {activeSemanticQuery && semanticResults !== null ? (
          <div className="flex items-center justify-between bg-[#F5EFE6] border border-[#E8DCB8] rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-2 text-xs text-[#8C6226] font-medium">
              <Sparkles className="w-4 h-4 text-[#B88746] shrink-0" />
              <span>
                Semantic ranking for: <strong className="text-[#1F1D1A]">"{activeSemanticQuery}"</strong> ({semanticResults.length} matches)
              </span>
            </div>
            <button
              id="btn-clear-semantic-results"
              onClick={handleClearSemanticSearch}
              className="text-xs font-semibold text-[#8C6226] hover:text-[#734F1F] hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset to all</span>
            </button>
          </div>
        ) : (
          /* Tag Filter Pills */
          allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedTag === null
                    ? 'bg-[#2A241F] text-white shadow-xs'
                    : 'bg-[#F8F5F0] text-[#7C7469] hover:text-[#1F1D1A] hover:bg-[#EDE8E1]'
                }`}
              >
                All Tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-[#2A241F] text-white shadow-xs'
                      : 'bg-[#F8F5F0] text-[#7C7469] hover:text-[#1F1D1A] hover:bg-[#EDE8E1]'
                  }`}
                >
                  <Hash className="w-3 h-3 opacity-60" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* Entry List / Semantic Results */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {/* Case A: Semantic Results View */}
        {activeSemanticQuery && semanticResults !== null ? (
          semanticResults.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#7C7469]">
              <Sparkles className="w-8 h-8 text-[#9E9589] mb-2" />
              <p className="text-sm font-semibold text-[#1F1D1A] mb-1">No semantic matches found</p>
              <p className="text-xs text-[#9E9589] mb-4">
                {entriesWithEmbeddingsCount === 0 
                  ? 'No entries have vector embeddings yet. Save an entry to generate embeddings.'
                  : 'Try searching with different concepts or phrasing.'}
              </p>
              <button
                onClick={handleClearSemanticSearch}
                className="px-4 py-2 bg-[#B88746] hover:bg-[#A37438] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Show All Entries
              </button>
            </div>
          ) : (
            semanticResults.map(({ entry, similarity, rank }) => {
              const isSelected = activeEntryId === entry.id;
              const messageCount = entry.messages?.length || 0;
              const snippet = entry.content.slice(0, 150) + (entry.content.length > 150 ? '...' : '');
              const similarityPercentage = Math.max(0, Math.round(similarity * 100));

              return (
                <div
                  key={entry.id}
                  id={`semantic-entry-card-${entry.id}`}
                  onClick={() => onSelectEntry(entry)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                    isSelected
                      ? 'bg-[#F8F5F0] border-[#E8DCB8] shadow-xs ring-1 ring-[#B88746]/20'
                      : 'bg-[#FFFFFF] border-[#E8E2D7] hover:bg-[#FAF8F5] hover:border-[#D8CEBE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Rank Badge */}
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#1F1D1A] text-white font-mono">
                          #{rank}
                        </span>
                        {/* Similarity Score Pill */}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F5EFE6] text-[#8C6226] border border-[#E8DCB8] flex items-center gap-1 font-mono">
                          <Sparkles className="w-3 h-3 text-[#B88746]" />
                          <span>{similarityPercentage}% semantic match</span>
                        </span>
                        {entry.embeddingModel && (
                          <span className="text-[10px] text-[#9E9589] font-mono">
                            ({entry.embeddingModel})
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#1F1D1A] group-hover:text-[#8C6226] transition-colors">
                        {entry.title || 'Untitled Reflection'}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#7C7469] mt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#9E9589]" />
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#B88746]" />
                          {messageCount} AI turns
                        </span>
                        {entry.summaryData?.sentiment && (
                          <>
                            <span>•</span>
                            <span className="text-[#8C6226] font-semibold">{entry.summaryData.sentiment}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-delete-entry-${entry.id}`}
                        onClick={(e) => handleDelete(e, entry.id, entry.title)}
                        title="Delete Entry"
                        className="p-1.5 text-[#9E9589] hover:text-[#9E4733] hover:bg-[#FDF3F0] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#9E9589] group-hover:text-[#8C6226] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {snippet && (
                    <p className="text-xs text-[#423A31] leading-relaxed line-clamp-2 mb-2 font-normal">
                      {snippet}
                    </p>
                  )}

                  {/* Tags & Insights summary */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-[#EAE4DC]">
                    {entry.tags && entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C6226] border border-[#E8DCB8]"
                      >
                        #{t}
                      </span>
                    ))}
                    {entry.summaryData?.keyInsight && (
                      <span className="text-[10px] text-[#8C6226] font-medium italic truncate max-w-xs ml-auto">
                        &ldquo;{entry.summaryData.keyInsight}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* Case B: Standard / Filtered Entry List View */
          filteredEntries.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#7C7469]">
              <p className="text-sm font-semibold text-[#1F1D1A] mb-1">No reflections found</p>
              <p className="text-xs text-[#9E9589] mb-4">
                {searchQuery || selectedTag
                  ? 'Try adjusting your search criteria or clicking "Semantic Search" to search by concept.'
                  : 'Start your first reflection with Gemini!'}
              </p>
              {!searchQuery && !selectedTag && (
                <button
                  onClick={onNewEntry}
                  className="px-4 py-2 bg-[#B88746] hover:bg-[#A37438] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Write First Reflection
                </button>
              )}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = activeEntryId === entry.id;
              const messageCount = entry.messages?.length || 0;
              const snippet = entry.content.slice(0, 140) + (entry.content.length > 140 ? '...' : '');

              return (
                <div
                  key={entry.id}
                  id={`entry-card-${entry.id}`}
                  onClick={() => onSelectEntry(entry)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                    isSelected
                      ? 'bg-[#F8F5F0] border-[#E8DCB8] shadow-xs ring-1 ring-[#B88746]/20'
                      : 'bg-[#FFFFFF] border-[#E8E2D7] hover:bg-[#FAF8F5] hover:border-[#D8CEBE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#1F1D1A] group-hover:text-[#8C6226] transition-colors">
                        {entry.title || 'Untitled Reflection'}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#7C7469] mt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#9E9589]" />
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#B88746]" />
                          {messageCount} AI turns
                        </span>
                        {entry.summaryData?.sentiment && (
                          <>
                            <span>•</span>
                            <span className="text-[#8C6226] font-semibold">{entry.summaryData.sentiment}</span>
                          </>
                        )}
                        {entry.embedding && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F5EFE6] text-[#8C6226] font-mono border border-[#E8DCB8]">
                            vector-indexed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-delete-entry-${entry.id}`}
                        onClick={(e) => handleDelete(e, entry.id, entry.title)}
                        title="Delete Entry"
                        className="p-1.5 text-[#9E9589] hover:text-[#9E4733] hover:bg-[#FDF3F0] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#9E9589] group-hover:text-[#8C6226] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {snippet && (
                    <p className="text-xs text-[#423A31] leading-relaxed line-clamp-2 mb-2 font-normal">
                      {snippet}
                    </p>
                  )}

                  {/* Tags & Insights summary */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-[#EAE4DC]">
                    {entry.tags && entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C6226] border border-[#E8DCB8]"
                      >
                        #{t}
                      </span>
                    ))}
                    {entry.summaryData?.keyInsight && (
                      <span className="text-[10px] text-[#8C6226] font-medium italic truncate max-w-xs ml-auto">
                        &ldquo;{entry.summaryData.keyInsight}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Footer Info */}
      {entries.length > 0 && (
        <div className="pt-3 border-t border-[#EAE4DC] text-[11px] text-[#9E9589] flex items-center justify-between flex-wrap gap-2">
          <span>
            {entriesWithEmbeddingsCount} of {entries.length} entries vector-indexed for semantic search
          </span>
          <span className="text-[#8C6226] font-medium">
            User-isolated cosine similarity
          </span>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {entryToDelete && (
        <div
          id="modal-delete-confirmation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D1A]/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-lg relative space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#FDF3F0] text-[#9E4733] rounded-xl shrink-0 border border-[#FADCD5]">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-serif font-bold text-[#1F1D1A]">
                  Delete Reflection?
                </h3>
                <p className="text-xs text-[#7C7469] mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-[#1F1D1A]">"{entryToDelete.title}"</strong>? This will permanently remove it from your Firestore journal and vector index. This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-[#FDF3F0] border border-[#FADCD5] rounded-xl flex items-center gap-2 text-xs text-[#9E4733]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE4DC]">
              <button
                id="btn-cancel-delete-modal"
                type="button"
                disabled={isDeleting}
                onClick={handleCancelDelete}
                className="px-4 py-2 text-xs font-semibold text-[#7C7469] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-modal"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#9E4733] hover:bg-[#853B2A] rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
