import React, { useState } from 'react';
import { X, CheckCircle2, Play } from 'lucide-react';

interface TestWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestCase {
  id: string;
  category: string;
  name: string;
  precondition: string;
  steps: string[];
  expectedResult: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: 'TC-01',
    category: 'Authentication',
    name: 'Google Federated Sign-In Flow',
    precondition: 'User is on the public landing page and unauthenticated.',
    steps: [
      'Navigate to the root URL.',
      'Click "Sign In with Google" button (#btn-google-signin).',
      'Select Google account in the popup window.',
    ],
    expectedResult: 'User state updates; user profile document is synced to Firestore; user is transitioned into the private workspace dashboard.',
  },
  {
    id: 'TC-02',
    category: 'Journal Writing',
    name: 'Custom Title Preservation & Auto-Generation on Blank Title',
    precondition: 'User is authenticated in the dashboard.',
    steps: [
      'Scenario A (Custom title): Type a custom title in "#input-entry-title" and write reflection text. Click "Save to Firestore" (#btn-save-entry). Verify the custom title is preserved verbatim and never overwritten.',
      'Scenario B (Blank title auto-generation): Leave the title field blank, write reflection content, and click "Save to Firestore". Verify a short, fitting title is automatically generated based on the content.',
      'Scenario C (Editable auto-title): Click on the auto-generated title, overwrite it with new text, and save. Verify user edits are persisted.',
    ],
    expectedResult: 'User-typed titles are always kept intact; blank titles auto-generate a context-aware title that remains completely editable at any time.',
  },
  {
    id: 'TC-03',
    category: 'Persistence',
    name: 'Save Entry to Firestore (User Isolation)',
    precondition: 'Entry contains title and content.',
    steps: [
      'Click "Save to Firestore" button (#btn-save-entry).',
      'Observe button transitioning from "Saving..." to "Saved".',
      'Switch to "Past Entries" tab (#nav-tab-history).',
    ],
    expectedResult: 'The entry document is stored at `/users/{userId}/entries/{entryId}` with stripped undefined values and zero cross-user leakage.',
  },
  {
    id: 'TC-04',
    category: 'AI Processing',
    name: 'Gemini Multi-Turn Reflection & Mode Switching',
    precondition: 'Journal entry has text content.',
    steps: [
      'Select reflection style chip (e.g. "Brainstorm" or "Socratic Prompts").',
      'Type a follow-up question or click a suggested prompt in the Gemini dialogue panel.',
      'Click Send (#btn-send-message).',
    ],
    expectedResult: 'Gemini server-side proxy handles the request via the fallback ladder (gemini-3.6-flash -> gemini-3.1-flash-lite) and streams back a formatted markdown response.',
  },
  {
    id: 'TC-05',
    category: 'AI Summarization',
    name: 'Automated Qualitative Summary & Recommended Reads Deck',
    precondition: 'Journal entry has written thoughts.',
    steps: [
      'Click "AI Summary" button (#btn-ai-summarize).',
      'Wait for structured JSON generation.',
      'Inspect the Recommended Reads section in the Gemini Synthesis card.',
      'Tap or click the top book card (#recommended-reads-deck) to cycle between the 3 stacked book recommendations.',
    ],
    expectedResult: 'Gemini generates a structured summary card with sentiment badge, key insight, thematic tags, and a 3D stacked book card deck that smoothly cycles on click.',
  },
  {
    id: 'TC-06',
    category: 'History & Search',
    name: 'Entry Search, Filter, and Deletion',
    precondition: 'Multiple entries exist in Firestore.',
    steps: [
      'Navigate to "Past Entries" tab (#nav-tab-history).',
      'Type a keyword into the search bar (#input-history-search).',
      'Click a tag chip to filter by tag.',
      'Click on an entry card to load it into the active editor.',
      'Click the trash icon (#btn-delete-entry-*) and confirm.',
    ],
    expectedResult: 'Real-time Firestore snapshot updates list; deleting removes the document permanently from the user collection.',
  },
  {
    id: 'TC-07',
    category: 'Semantic Search Infrastructure',
    name: 'Server-Side Vector Embedding Generation on Save',
    precondition: 'User is writing an entry with text content.',
    steps: [
      'Write reflection text in the main journal textarea.',
      'Click "Save to Firestore" (#btn-save-entry).',
      'The client invokes `/api/gemini/embed` which computes text embeddings using Gemini embedding models (gemini-embedding-2-preview).',
      'Verify the resulting high-dimensional vector array is stored in the "embedding" field of the entry document at `/users/{userId}/entries/{entryId}` in Firestore.',
    ],
    expectedResult: 'The entry is persisted with a valid numeric embedding vector stored directly inside the Firestore document for future semantic search querying.',
  },
  {
    id: 'TC-08',
    category: 'Semantic Search & Ranking',
    name: 'Semantic Search with Cosine Similarity Ranking',
    precondition: 'User has saved entries with vector embeddings in their private collection.',
    steps: [
      'Navigate to "Past Entries" tab (#nav-tab-history).',
      'Type a conceptual query (e.g., "coping with work stress" or "gratitude and calm") into the search input (#input-history-search).',
      'Click the "Semantic Search" button (#btn-semantic-search) or press Enter.',
      'Observe the loader spinner ("Ranking...") while the server generates the query embedding.',
      'Inspect the returned ranked results list, checking that entries are ordered from highest to lowest semantic similarity with rank badges (#1, #2, ...) and match percentage pills (e.g., "94% semantic match").',
      'Click on a ranked result card to open and edit that specific entry in the journal editor.',
      'Click "Reset to all" (#btn-clear-semantic-results) to return to the full list.',
    ],
    expectedResult: 'Query vector embedding is computed server-side, cosine similarity is computed across the active user’s isolated entries, and matching results are presented in descending order of relevance with match percentages.',
  },
  {
    id: 'TC-09',
    category: 'Retrieval-Augmented Generation (RAG)',
    name: 'Ask Your Past Self - Grounded Historical Q&A',
    precondition: 'User has saved journal entries with stored embeddings.',
    steps: [
      'Click the "Ask Past Self" tab in the top navigation (#nav-tab-ask) or the shortcut in Past Entries (#btn-history-goto-ask).',
      'Type a question about past reflections into the prompt input (#input-ask-past-self) or click one of the suggested query chips.',
      'Click "Ask" (#btn-submit-ask-past-self) or press Enter.',
      'Observe the query embedding generation, local user-isolated cosine retrieval, and server-side grounded synthesis.',
      'Verify the generated answer is formatted cleanly in markdown and cites specific past thoughts/dates without hallucinating events.',
      'Check that the source entry cards appear beneath the answer with rank and similarity scores, and clicking any source card navigates directly to that entry.',
    ],
    expectedResult: 'Gemini synthesizes a warm, reflective answer grounded exclusively in the user’s retrieved past reflections, respecting user isolation and prompt-injection defenses.',
  },
  {
    id: 'TC-10',
    category: 'Third-Party Integration & Cover Art',
    name: 'Recommended Reads - Google Books API Real Covers',
    precondition: 'User writes reflection content in the editor.',
    steps: [
      'Type a reflection into the journal editor (#textarea-journal-content).',
      'Click "AI Summary" (#btn-ai-summarize).',
      'Observe Gemini generating reflection insights and tailored book recommendations.',
      'Verify the server looks up each recommended book via Google Books API and returns real cover image URLs.',
      'Inspect the "Recommended Reads" stacked card deck (#recommended-reads-deck) in the summary section.',
      'Click or tap the deck to cycle through the cards and observe smooth stacking transitions with book cover images, titles, authors, and thematic pills.',
      'Verify that if a book cover is missing or fails to load, the card gracefully falls back to the styled placeholder card without breaking the deck.',
    ],
    expectedResult: 'Real book cover art is retrieved server-side from Google Books API and rendered on each deck card with cycling animations and robust fallback placeholders.',
  },
  {
    id: 'TC-11',
    category: 'Semantic Threading & Discovery',
    name: 'Entry Threading & Related Reflections Discovery',
    precondition: 'User has multiple saved reflections with generated vector embeddings in their private collection.',
    steps: [
      'Open any saved journal entry from Past Entries (#nav-tab-history) into the active editor view.',
      'Inspect the "Related Reflections" section (#section-related-reflections) rendered beneath the journal editor.',
      'Verify that 2-3 small linked cards appear, showing the title, formatted date, and semantic match percentage of related past entries.',
      'Verify that the current entry itself is excluded from the list.',
      'Click on any related reflection card (#related-entry-card-*).',
      'Verify the editor seamlessly transitions to and loads the clicked past reflection.',
      'Open an entry with unique/unrelated topics or clear all other entries; verify the Related Reflections section is cleanly hidden (suppressed when relevance is below threshold or no connections exist).',
    ],
    expectedResult: 'Cosine similarity is computed over stored embedding vectors; only the current user’s own related reflections meeting relevance thresholds (>=65%) are shown; clicking immediately opens the connected entry, and unmeaningful matches are suppressed.',
  },
  {
    id: 'TC-12',
    category: 'Navigation & Mode Architecture',
    name: 'Home Mode Choice Screen & Seamless Mode Routing',
    precondition: 'User successfully signs in with Google Auth.',
    steps: [
      'Observe the post-sign-in landing view: verify the user is presented with the welcoming Home screen ("How would you like to think today?") instead of being abruptly dropped into the raw editor.',
      'Verify the two prominent choice cards are clearly rendered with matching gold/cream/charcoal styling: "Reflect & Synthesize" (#card-mode-write) and "Talk it Through" (#card-mode-dialogue).',
      'Click the "Reflect & Synthesize" card: verify it immediately routes into the full Reflection Workspace with the journal editor, AI synthesis, emotional themes, and literature deck.',
      'Click the "Home" button (#btn-return-home or #nav-tab-home) in the workspace breadcrumb or top navigation: verify it returns to the choice screen.',
      'Click the "Talk it Through" card: verify it opens the focused Socratic dialogue conversation interface powered by Gemini.',
      'Verify top navigation tabs (Past Entries, Ask Past Self, Security Specs) remain accessible across all screens.',
    ],
    expectedResult: 'The Home choice screen acts as a clean, welcoming router into existing, fully-functional workspaces with effortless return-to-home navigation and zero state or data loss.',
  },
];

export const TestWalkthroughModal: React.FC<TestWalkthroughModalProps> = ({ isOpen, onClose }) => {
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCompleted = Object.values(completedTests).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D1A]/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-[#1F1D1A]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EAE4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shadow-xs">
              <Play className="w-5 h-5 text-[#8C5E24]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1F1D1A]">Functional Test Walkthroughs</h2>
              <p className="text-xs sm:text-sm text-[#3D352E] font-semibold">Step-by-step test verification for all user flows and processes</p>
            </div>
          </div>
          <button
            id="btn-test-walkthrough-close"
            onClick={onClose}
            className="p-2 text-[#593A12] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#E0D8CA] flex items-center justify-between text-xs sm:text-sm text-[#24201C]">
          <span className="font-bold">Verification Progress: {totalCompleted} of {TEST_CASES.length} scenarios verified</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2.5 rounded-full bg-[#EAE4DC] overflow-hidden">
              <div
                className="h-full bg-[#8C5E24] transition-all rounded-full"
                style={{ width: `${(totalCompleted / TEST_CASES.length) * 100}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#593A12]">
              {Math.round((totalCompleted / TEST_CASES.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Test Cases List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {TEST_CASES.map((tc) => {
            const isDone = Boolean(completedTests[tc.id]);

            return (
              <div
                key={tc.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-[#F8F5F0] border-[#DFCBA8] text-[#1F1D1A]'
                    : 'bg-[#FFFFFF] border-[#E0D8CA] text-[#24201C] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleTest(tc.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#8C5E24] text-white border-[#8C5E24]'
                          : 'bg-[#FAF8F5] text-[#7C7469] border-[#DFCBA8] hover:text-[#1F1D1A]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#F5EFE6] text-[#593A12] font-bold mr-2 border border-[#DFCBA8]">
                        {tc.id}
                      </span>
                      <span className="font-bold text-[#1F1D1A] text-sm sm:text-base">{tc.name}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#3D352E] font-bold border border-[#DFCBA8]">
                    {tc.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#DFCBA8]">
                    <p className="font-bold text-[#593A12] mb-1.5 text-xs sm:text-sm">Execution Steps:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-[#24201C] font-medium">
                      {tc.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#DFCBA8] flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#593A12] mb-1.5 text-xs sm:text-sm">Expected Outcome:</p>
                      <p className="text-[#24201C] leading-relaxed font-medium">{tc.expectedResult}</p>
                    </div>
                    <p className="text-xs text-[#5C5346] mt-2 font-medium">Precondition: {tc.precondition}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4.5 border-t border-[#EAE4DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#8C5E24] hover:bg-[#7A4F1D] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
          >
            Done Reviewing
          </button>
        </div>

      </div>
    </div>
  );
};
