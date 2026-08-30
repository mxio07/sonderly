import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Plus, 
  ChevronRight
} from 'lucide-react';
import { JournalEntry } from '../types';

interface EntryHistoryProps {
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onNewEntry: () => void;
}

export const EntryHistory: React.FC<EntryHistoryProps> = ({
  entries,
  activeEntryId,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(entries.flatMap((e) => e.tags || []))
  ).filter(Boolean);

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
    if (window.confirm(`Are you sure you want to delete "${title || 'Untitled Entry'}"? This action cannot be undone.`)) {
      onDeleteEntry(entryId);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full min-h-[500px]">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
        <div>
          <h2 className="text-lg font-bold text-[#242220] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#638466]" />
            <span>Past Journal Entries</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1F6F1] text-[#466548] font-semibold border border-[#DCE8DC]">
              {entries.length} total
            </span>
          </h2>
          <p className="text-xs text-[#666057] mt-0.5">Isolated & stored securely in your private Cloud Firestore collection</p>
        </div>

        <button
          id="btn-history-new-entry"
          onClick={onNewEntry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#638466] hover:bg-[#527055] text-white transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="py-3 flex flex-col sm:flex-row gap-2 border-b border-[#EDE8E1]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#918B82]" />
          <input
            id="input-history-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by title, notes, or tags..."
            className="w-full bg-[#FAF9F6]/90 border border-[#EDE8E1] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-[#242220] placeholder-[#918B82] focus:outline-none focus:border-[#638466] focus:ring-2 focus:ring-[#638466]/20"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                selectedTag === null
                  ? 'bg-[#638466] text-white shadow-xs'
                  : 'bg-[#F7F4EE] text-[#666057] hover:text-[#242220] hover:bg-[#EDE8E1]'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedTag === tag
                    ? 'bg-[#638466] text-white shadow-xs'
                    : 'bg-[#F7F4EE] text-[#666057] hover:text-[#242220] hover:bg-[#EDE8E1]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entry List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#666057]">
            <p className="text-sm font-semibold text-[#242220] mb-1">No reflections found</p>
            <p className="text-xs text-[#918B82] mb-4">
              {searchQuery || selectedTag
                ? 'Try adjusting your search criteria.'
                : 'Start your first journal reflection with Gemini!'}
            </p>
            {!searchQuery && !selectedTag && (
              <button
                onClick={onNewEntry}
                className="px-4 py-2 bg-[#638466] hover:bg-[#527055] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
                    ? 'bg-[#F7F5F0] border-[#DCE8DC] shadow-xs ring-1 ring-[#638466]/20'
                    : 'bg-[#FFFFFF] border-[#EDE8E1] hover:bg-[#FAF9F6] hover:border-[#E0D9CE]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#242220] group-hover:text-[#638466] transition-colors">
                      {entry.title || 'Untitled Reflection'}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#666057] mt-0.5 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#918B82]" />
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-[#638466]" />
                        {messageCount} AI turns
                      </span>
                      {entry.summaryData?.sentiment && (
                        <>
                          <span>•</span>
                          <span className="text-[#B6634C] font-semibold">{entry.summaryData.sentiment}</span>
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
                      className="p-1.5 text-[#918B82] hover:text-[#C46A52] hover:bg-[#FDF4F0] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#918B82] group-hover:text-[#638466] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {snippet && (
                  <p className="text-xs text-[#423E39] leading-relaxed line-clamp-2 mb-2 font-normal">
                    {snippet}
                  </p>
                )}

                {/* Tags & Insights summary */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-[#EDE8E1]">
                  {entry.tags && entry.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF4F0] text-[#B6634C] border border-[#FADCD5]"
                    >
                      #{t}
                    </span>
                  ))}
                  {entry.summaryData?.keyInsight && (
                    <span className="text-[10px] text-[#466548] font-medium italic truncate max-w-xs ml-auto">
                      💡 {entry.summaryData.keyInsight}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
