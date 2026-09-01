import React from 'react';
import { ShieldCheck, X, Database, Key, Globe, Cpu, AlertTriangle } from 'lucide-react';

interface ThreatModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatModelModal: React.FC<ThreatModelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D1A]/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-[#1F1D1A]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EAE4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#8C5E24]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1F1D1A]">Agentic Threat Model &amp; Security Controls</h2>
              <p className="text-xs sm:text-sm text-[#3D352E] font-semibold">Structured 5-Zone Threat Modeling &amp; OWASP Top 10 Compliance</p>
            </div>
          </div>
          <button
            id="btn-threat-model-close"
            onClick={onClose}
            className="p-2 text-[#593A12] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Overview Callout */}
          <div className="p-4.5 rounded-xl bg-[#FAF8F5] border border-[#DFCBA8] text-[#24201C]">
            <p className="font-bold text-[#1F1D1A] text-sm sm:text-base mb-1">Architecture Security Boundary</p>
            <p className="text-xs sm:text-sm text-[#24201C] leading-relaxed font-medium">
              Sonderly separates client-side authentication from server-side AI execution. All Gemini API keys are isolated in backend environment variables, and Firestore reads/writes are strictly restricted to the authenticated Google user&apos;s UID.
            </p>
          </div>

          {/* 5 Threat Zones Summary Table */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#593A12] mb-3">
              1. The 5 Threat Zones Analysis
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#E0D8CA]">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-[#FAF8F5] text-[#1F1D1A] font-bold border-b border-[#E0D8CA]">
                  <tr>
                    <th className="p-3.5">Threat Zone</th>
                    <th className="p-3.5">Scenario / Vulnerability Risk</th>
                    <th className="p-3.5">Implemented Countermeasure</th>
                    <th className="p-3.5">OWASP Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DC] text-[#24201C]">
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="p-3.5 font-bold text-[#593A12] flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#8C5E24]" /> Input Surfaces
                    </td>
                    <td className="p-3.5 font-medium">Malicious payloads, prompt injections in journal notes, or adversarial RAG questions in "Ask Your Past Self".</td>
                    <td className="p-3.5 font-medium">Strict schema validation; user text and questions are bounded (length-capped) and passed as data parameters, never as executable instructions.</td>
                    <td className="p-3.5 text-[#3D352E] font-bold">OWASP A03 / LLM02</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="p-3.5 font-bold text-[#593A12] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#9E4733]" /> Planning &amp; Reasoning
                    </td>
                    <td className="p-3.5 font-medium">Indirect prompt injection via retrieved past entries or hallucinated historical facts during RAG synthesis.</td>
                    <td className="p-3.5 font-medium">Strict system role framing: retrieved entries are treated as untrusted historical data; answers must be strictly grounded in what the user actually wrote or state absence honestly.</td>
                    <td className="p-3.5 text-[#3D352E] font-bold">OWASP LLM01</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="p-3.5 font-bold text-[#593A12] flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-[#8C5E24]" /> Tool Execution
                    </td>
                    <td className="p-3.5 font-medium">Server-side API key leak (Gemini or Google Books) or unauthorized execution.</td>
                    <td className="p-3.5 font-medium">Zero hardcoded secrets; API keys resolved securely via Google Cloud Secret Manager (`getSecret`) with dev env fallback. Client proxies through `/api/gemini/*` and `/api/books/*`.</td>
                    <td className="p-3.5 text-[#3D352E] font-bold">OWASP A01 / A05</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="p-3.5 font-bold text-[#593A12] flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-[#8C5E24]" /> Memory &amp; State
                    </td>
                    <td className="p-3.5 font-medium">Cross-user journal read/write, vector embedding data snooping, or unauthorized linkage across user boundaries in Semantic Threading / Related Reflections.</td>
                    <td className="p-3.5 font-medium">Owner-bound Firestore Security Rules enforcing <code>request.auth.uid == userId</code> at the collection path <code>/users/&#123;userId&#125;/...</code>. RAG search and Entry Threading strictly compute cosine similarity over the authenticated user's private collection, filtering out the active entry and suppressing sub-threshold matches.</td>
                    <td className="p-3.5 text-[#3D352E] font-bold">OWASP A01</td>
                  </tr>
                  <tr className="hover:bg-[#FAF8F5]">
                    <td className="p-3.5 font-bold text-[#593A12] flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#8C5E24]" /> Inter-System Comm
                    </td>
                    <td className="p-3.5 font-medium">Third-party Google Books API injection, SSRF, mixed-content HTTP image loading, or undefined payload crashes.</td>
                    <td className="p-3.5 font-medium">Book title/author sanitized and length-capped; external Google Books URLs upgraded to HTTPS; zero-crash Firestore undefined property sanitization (`sanitizeForFirestore`).</td>
                    <td className="p-3.5 text-[#3D352E] font-bold">OWASP A02 / A10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Firestore Rules Verification */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#593A12] mb-2">
              2. Deployed Firestore Security Rules
            </h3>
            <pre className="p-4 rounded-xl bg-[#1F1D1A] border border-[#3A332B] text-[#FAF8F5] font-mono text-xs sm:text-sm overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4.5 border-t border-[#EAE4DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#1F1D1A] rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-[#DFCBA8]"
          >
            Close Threat Model
          </button>
        </div>

      </div>
    </div>
  );
};
