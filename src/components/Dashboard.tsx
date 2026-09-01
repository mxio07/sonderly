import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JournalEntry, ChatMessage, ReflectionStyle, SummaryData, UserProfile } from '../types';
import { JournalEditor } from './JournalEditor';
import { GeminiConversation } from './GeminiConversation';
import { EntryHistory } from './EntryHistory';
import { AskPastSelf } from './AskPastSelf';
import { ModeChoiceHome } from './ModeChoiceHome';
import { AppTab } from './Navbar';
import { saveJournalEntry, deleteJournalEntry, subscribeToUserEntries } from '../lib/firebase';
import { requestGeminiReflection, requestGeminiSummary, requestGeminiTitle, requestGeminiEmbedding } from '../lib/geminiClient';
import { 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  Home, 
  PenTool, 
  MessageSquare,
  Sparkles,
  Layers,
  Columns
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onEntriesCountChange: (count: number) => void;
}

function createEmptyEntry(userId: string): JournalEntry {
  const now = Date.now();
  return {
    id: `entry_${now}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    title: '',
    content: '',
    createdAt: now,
    updatedAt: now,
    tags: [],
    messages: [],
  };
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  activeTab,
  setActiveTab,
  onEntriesCountChange,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry>(() => createEmptyEntry(user.uid));
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Subscribe to real-time entries from Firestore
  useEffect(() => {
    if (!user.uid) return;

    const unsubscribe = subscribeToUserEntries(
      user.uid,
      (fetchedEntries) => {
        setEntries(fetchedEntries);
        onEntriesCountChange(fetchedEntries.length);
        setFirestoreError(null);
      },
      (err) => {
        console.error('Firestore sync error:', err);
        setFirestoreError('Failed to load past entries from Firestore. Please check connection.');
      }
    );

    return () => unsubscribe();
  }, [user.uid, onEntriesCountChange]);

  // Update active entry state
  const handleUpdateEntry = (updatedFields: Partial<JournalEntry>) => {
    setActiveEntry((prev) => {
      const updated = { ...prev, ...updatedFields, updatedAt: Date.now() };
      setSaveStatus('idle');
      return updated;
    });
  };

  // Save current entry to Firestore
  const handleSaveEntry = async (): Promise<void> => {
    if (!activeEntry.content.trim() && !activeEntry.title.trim()) {
      setErrorMessage('Please write some thoughts or a title before saving.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      let finalTitle = activeEntry.title.trim();

      // Only auto-generate title if the user left it blank and has written content
      if (!finalTitle && activeEntry.content.trim()) {
        try {
          const titleRes = await requestGeminiTitle(activeEntry.content.trim());
          if (titleRes?.title && titleRes.title.trim()) {
            finalTitle = titleRes.title.trim();
          }
        } catch (titleErr) {
          console.warn('Auto-title generation error, using fallback date title:', titleErr);
        }
      }

      // If still empty (e.g. offline/no content), fallback to date reflection
      if (!finalTitle) {
        finalTitle = `Reflection on ${new Date(activeEntry.createdAt).toLocaleDateString()}`;
      }

      let finalEmbedding = activeEntry.embedding;
      let finalEmbeddingModel = activeEntry.embeddingModel;

      // Generate text embedding vector using server-side Gemini embedding model
      if (activeEntry.content.trim()) {
        try {
          const embedRes = await requestGeminiEmbedding(activeEntry.content.trim());
          if (embedRes?.embedding && Array.isArray(embedRes.embedding)) {
            finalEmbedding = embedRes.embedding;
            finalEmbeddingModel = embedRes.modelUsed;
          }
        } catch (embedErr) {
          console.warn('Embedding generation notice (proceeding with entry save):', embedErr);
        }
      }

      const entryToSave: JournalEntry = {
        ...activeEntry,
        title: finalTitle,
        embedding: finalEmbedding,
        embeddingModel: finalEmbeddingModel,
        updatedAt: Date.now(),
      };

      await saveJournalEntry(user.uid, entryToSave);
      setActiveEntry(entryToSave);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveStatus('error');
      setErrorMessage(err?.message || 'Failed to save entry to Cloud Firestore. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger AI Summarization
  const handleGenerateSummary = async (): Promise<void> => {
    if (!activeEntry.content.trim()) return;

    setIsSummarizing(true);
    setErrorMessage(null);

    try {
      const result = await requestGeminiSummary(activeEntry.content);
      const updatedTitle = activeEntry.title.trim() || result.data.title || activeEntry.title;

      const updatedEntry: JournalEntry = {
        ...activeEntry,
        title: updatedTitle,
        summaryData: result.data,
        updatedAt: Date.now(),
      };

      setActiveEntry(updatedEntry);
      // Automatically persist summary update
      await saveJournalEntry(user.uid, updatedEntry);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Summary error:', err);
      setErrorMessage(err?.message || 'Failed to generate AI summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Multi-turn Send Message to Gemini
  const handleSendMessage = async (text: string, style: ReflectionStyle): Promise<void> => {
    if (!text.trim() || isAiLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      text,
      timestamp: Date.now(),
      style,
    };

    const newMessages = [...activeEntry.messages, userMessage];
    const updatedEntryWithUserMsg = {
      ...activeEntry,
      messages: newMessages,
      updatedAt: Date.now(),
    };

    setActiveEntry(updatedEntryWithUserMsg);
    setIsAiLoading(true);
    setErrorMessage(null);

    try {
      // Build conversation turns for backend
      const turns = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const aiResponse = await requestGeminiReflection(
        turns,
        style,
        activeEntry.content
      );

      const modelMessage: ChatMessage = {
        id: `msg_${Date.now()}_model`,
        role: 'model',
        text: aiResponse.text,
        timestamp: Date.now(),
        style,
        modelUsed: aiResponse.modelUsed,
      };

      const finalMessages = [...newMessages, modelMessage];
      const finalUpdatedEntry: JournalEntry = {
        ...activeEntry,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setActiveEntry(finalUpdatedEntry);

      // Persist conversation to Firestore
      await saveJournalEntry(user.uid, finalUpdatedEntry);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('AI Reflection Error:', err);
      setErrorMessage(err?.message || 'Failed to generate Gemini response. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Clear Chat for this entry
  const handleClearChat = async () => {
    if (window.confirm('Reset the AI dialogue for this journal entry?')) {
      const updated = { ...activeEntry, messages: [], updatedAt: Date.now() };
      setActiveEntry(updated);
      await saveJournalEntry(user.uid, updated);
    }
  };

  // Select entry from history
  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setActiveTab('write');
  };

  // Delete entry
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteJournalEntry(user.uid, entryId);
      if (activeEntry.id === entryId) {
        setActiveEntry(createEmptyEntry(user.uid));
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setErrorMessage('Failed to delete entry from Firestore.');
    }
  };

  // Create brand new entry
  const handleNewEntry = () => {
    setActiveEntry(createEmptyEntry(user.uid));
    setActiveTab('write');
  };

  if (activeTab === 'home') {
    return (
      <div>
        {firestoreError && (
          <div className="max-w-5xl mx-auto px-4 pt-4">
            <div className="p-4 rounded-xl bg-[#FDF3F0] border border-[#FADCD5] text-[#9E4733] text-xs flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#C46A52] shrink-0" />
                <span>{firestoreError}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-[#9E4733] hover:bg-[#853B2A] text-white rounded-lg transition-colors cursor-pointer font-semibold"
              >
                Reload
              </button>
            </div>
          </div>
        )}

        <ModeChoiceHome
          user={user}
          entries={entries}
          onSelectMode={(mode) => setActiveTab(mode)}
          onNavigateToHistory={() => setActiveTab('history')}
          onNavigateToAsk={() => setActiveTab('ask')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Global Error Banner */}
      {firestoreError && (
        <div className="mb-6 p-4 rounded-xl bg-[#FDF3F0] border border-[#FADCD5] text-[#9E4733] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C46A52] shrink-0" />
            <span>{firestoreError}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-[#9E4733] hover:bg-[#853B2A] text-white rounded-lg transition-colors cursor-pointer font-semibold"
          >
            Reload
          </button>
        </div>
      )}

      {/* View 2: Reflect & Synthesize Mode (Full Workspace with Editor & Companion) */}
      {activeTab === 'write' && (
        <div className="space-y-4">
          
          {/* Mode Navigation & Breadcrumb Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <button
                id="btn-return-home"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFE6] text-[#3D352E] hover:text-[#1F1D1A] font-semibold text-xs border border-[#E0D8CA] transition-colors shadow-2xs cursor-pointer"
                title="Return to Mode Choice Screen"
              >
                <Home className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Home</span>
              </button>

              <span className="text-[#D8CEBE]">/</span>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5EFE6] text-[#6B4716] text-xs font-semibold border border-[#DFCBA8]">
                <PenTool className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Mode: Reflect &amp; Synthesize</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dialogue')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#4D453B] hover:text-[#1F1D1A] font-medium text-xs border border-[#E0D8CA] transition-colors cursor-pointer"
                title="Switch to Talk it Through mode"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Switch to Talk it Through &rarr;</span>
              </button>
            </div>
          </div>

          {/* Existing Editor & Companion Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Journal Editor */}
            <div className="lg:col-span-6 xl:col-span-7">
              <JournalEditor
                entry={activeEntry}
                allEntries={entries}
                onSelectEntry={handleSelectEntry}
                onUpdateEntry={handleUpdateEntry}
                onSaveEntry={handleSaveEntry}
                onGenerateSummary={handleGenerateSummary}
                isSaving={isSaving}
                isSummarizing={isSummarizing}
                saveStatus={saveStatus}
                errorMessage={errorMessage}
              />
            </div>

            {/* Right: Gemini Multi-Turn Conversation */}
            <div className="lg:col-span-6 xl:col-span-5">
              <GeminiConversation
                messages={activeEntry.messages || []}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isAiLoading}
                entryContent={activeEntry.content}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        </div>
      )}

      {/* View 3: Talk it Through Mode (Focused Socratic Dialogue Interface) */}
      {activeTab === 'dialogue' && (
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Mode Navigation & Breadcrumb Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <button
                id="btn-return-home-dialogue"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFE6] text-[#3D352E] hover:text-[#1F1D1A] font-semibold text-xs border border-[#E0D8CA] transition-colors shadow-2xs cursor-pointer"
                title="Return to Mode Choice Screen"
              >
                <Home className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Home</span>
              </button>

              <span className="text-[#D8CEBE]">/</span>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#6B4716] text-xs font-semibold border border-[#DFCBA8]">
                <MessageSquare className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Mode: Talk it Through</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('write')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#4D453B] hover:text-[#1F1D1A] font-medium text-xs border border-[#E0D8CA] transition-colors cursor-pointer"
                title="Switch to Reflect & Synthesize mode"
              >
                <PenTool className="w-3.5 h-3.5 text-[#8C5E24]" />
                <span>Open in Split Workspace &rarr;</span>
              </button>
            </div>
          </div>

          {/* Focused Gemini Socratic Dialogue Component */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#E0D8CA] shadow-sm p-4 sm:p-6">
            <div className="mb-4 pb-4 border-b border-[#EAE4DC] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1F1D1A]">Socratic Inquiry &amp; Thinking Dialogue</h3>
                <p className="text-xs text-[#5C5346] font-medium mt-0.5">
                  Untangle problems, challenge assumptions, and explore possibilities in real-time.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#F5EFE6] text-[#6B4716] border border-[#DFCBA8]">
                <Sparkles className="w-3 h-3 text-[#8C5E24]" />
                Gemini Multi-Turn
              </span>
            </div>

            <GeminiConversation
              messages={activeEntry.messages || []}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={isAiLoading}
              entryContent={activeEntry.content}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      )}

      {/* View 4: Past Entries History */}
      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFE6] text-[#3D352E] hover:text-[#1F1D1A] font-semibold text-xs border border-[#E0D8CA] transition-colors shadow-2xs cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#8C5E24]" />
              <span>Home</span>
            </button>
            <span className="text-[#D8CEBE]">/</span>
            <span className="text-xs font-semibold text-[#6B4716]">Past Entries Vault</span>
          </div>

          <EntryHistory
            entries={entries}
            activeEntryId={activeEntry.id}
            onSelectEntry={handleSelectEntry}
            onDeleteEntry={handleDeleteEntry}
            onNewEntry={handleNewEntry}
            onNavigateToAsk={() => setActiveTab('ask')}
          />
        </div>
      )}

      {/* View 5: Ask Your Past Self (RAG) */}
      {activeTab === 'ask' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFE6] text-[#3D352E] hover:text-[#1F1D1A] font-semibold text-xs border border-[#E0D8CA] transition-colors shadow-2xs cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#8C5E24]" />
              <span>Home</span>
            </button>
            <span className="text-[#D8CEBE]">/</span>
            <span className="text-xs font-semibold text-[#6B4716]">Ask Your Past Self</span>
          </div>

          <AskPastSelf
            entries={entries}
            onSelectEntry={handleSelectEntry}
            onNavigateToWrite={handleNewEntry}
          />
        </div>
      )}

    </div>
  );
};
