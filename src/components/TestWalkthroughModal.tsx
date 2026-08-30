import React, { useState } from 'react';
import { HelpCircle, X, CheckCircle2, Play } from 'lucide-react';

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
];

export const TestWalkthroughModal: React.FC<TestWalkthroughModalProps> = ({ isOpen, onClose }) => {
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCompleted = Object.values(completedTests).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242220]/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-[#242220]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EDE8E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F6F1] text-[#466548] flex items-center justify-center border border-[#DCE8DC] shadow-xs">
              <Play className="w-5 h-5 text-[#638466]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#242220]">Functional Test Walkthroughs</h2>
              <p className="text-xs text-[#666057]">Step-by-step test verification for all user flows and processes</p>
            </div>
          </div>
          <button
            id="btn-test-walkthrough-close"
            onClick={onClose}
            className="p-2 text-[#918B82] hover:text-[#242220] hover:bg-[#F7F4EE] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-[#F7F5F0] border-b border-[#EDE8E1] flex items-center justify-between text-xs text-[#666057]">
          <span className="font-medium">Verification Progress: {totalCompleted} of {TEST_CASES.length} scenarios verified</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 rounded-full bg-[#EDE8E1] overflow-hidden">
              <div
                className="h-full bg-[#638466] transition-all rounded-full"
                style={{ width: `${(totalCompleted / TEST_CASES.length) * 100}%` }}
              />
            </div>
            <span className="font-bold text-[#466548]">
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
                    ? 'bg-[#F1F6F1]/80 border-[#DCE8DC] text-[#242220]'
                    : 'bg-[#FFFFFF] border-[#EDE8E1] text-[#423E39] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTest(tc.id)}
                      className={`p-1 rounded-lg border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#638466] text-white border-[#638466]'
                          : 'bg-[#F7F4EE] text-[#918B82] border-[#EDE8E1] hover:text-[#242220]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F1F6F1] text-[#466548] font-bold mr-2 border border-[#DCE8DC]">
                        {tc.id}
                      </span>
                      <span className="font-bold text-[#242220]">{tc.name}</span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F7F4EE] text-[#666057] font-semibold border border-[#EDE8E1]">
                    {tc.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EDE8E1]">
                    <p className="font-semibold text-[#466548] mb-1.5">Execution Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[#423E39] font-medium">
                      {tc.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EDE8E1] flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-[#638466] mb-1.5">Expected Outcome:</p>
                      <p className="text-[#423E39] leading-relaxed font-medium">{tc.expectedResult}</p>
                    </div>
                    <p className="text-[10px] text-[#918B82] mt-2 font-normal">Precondition: {tc.precondition}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDE8E1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#638466] hover:bg-[#527055] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Done Reviewing
          </button>
        </div>

      </div>
    </div>
  );
};
