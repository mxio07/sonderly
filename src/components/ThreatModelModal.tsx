import React from 'react';
import { ShieldCheck, X, Lock, Database, Key, Globe, Cpu, AlertTriangle } from 'lucide-react';

interface ThreatModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatModelModal: React.FC<ThreatModelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242220]/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-[#242220]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EDE8E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F6F1] text-[#466548] flex items-center justify-center border border-[#DCE8DC] shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#638466]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#242220]">Agentic Threat Model & Security Controls</h2>
              <p className="text-xs text-[#666057]">Structured 5-Zone Threat Modeling & OWASP Top 10 Compliance</p>
            </div>
          </div>
          <button
            id="btn-threat-model-close"
            onClick={onClose}
            className="p-2 text-[#918B82] hover:text-[#242220] hover:bg-[#F7F4EE] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Overview Callout */}
          <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EDE8E1] text-[#423E39]">
            <p className="font-semibold text-[#242220] mb-1">Architecture Security Boundary</p>
            <p className="text-xs text-[#666057] leading-relaxed">
              Sonderly separates client-side authentication from server-side AI execution. All Gemini API keys are isolated in backend environment variables, and Firestore reads/writes are strictly restricted to the authenticated Google user&apos;s UID.
            </p>
          </div>

          {/* 5 Threat Zones Summary Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#466548] mb-3">
              1. The 5 Threat Zones Analysis
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#EDE8E1]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F7F4EE] text-[#242220] font-semibold border-b border-[#EDE8E1]">
                  <tr>
                    <th className="p-3">Threat Zone</th>
                    <th className="p-3">Scenario / Vulnerability Risk</th>
                    <th className="p-3">Implemented Countermeasure</th>
                    <th className="p-3">OWASP Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8E1] text-[#423E39]">
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="p-3 font-semibold text-[#638466] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Input Surfaces
                    </td>
                    <td className="p-3">Malicious payloads or adversarial prompt injections in journal notes.</td>
                    <td className="p-3">Strict schema validation; user text injected as conversational data, not executable system instructions.</td>
                    <td className="p-3 text-[#666057] font-medium">OWASP A03 / LLM02</td>
                  </tr>
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="p-3 font-semibold text-[#638466] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B6634C]" /> Planning &amp; Reasoning
                    </td>
                    <td className="p-3">System prompt override or hallucinated security disclosure.</td>
                    <td className="p-3">Explicit system role constraints isolating journal context from system operational directives.</td>
                    <td className="p-3 text-[#666057] font-medium">OWASP LLM01</td>
                  </tr>
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="p-3 font-semibold text-[#638466] flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#B6634C]" /> Tool Execution
                    </td>
                    <td className="p-3">Server-side API key leak or unauthorized invocation of Gemini models.</td>
                    <td className="p-3">Gemini API key encapsulated server-side; client proxies through `/api/gemini/reflect` with resilient fallback ladder.</td>
                    <td className="p-3 text-[#666057] font-medium">OWASP A01 / A05</td>
                  </tr>
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="p-3 font-semibold text-[#638466] flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> Memory &amp; State
                    </td>
                    <td className="p-3">Cross-user journal read/write or database record snooping.</td>
                    <td className="p-3">Owner-bound Firestore Security Rules enforcing <code>request.auth.uid == userId</code> at the collection path <code>/users/&#123;userId&#125;/...</code>.</td>
                    <td className="p-3 text-[#666057] font-medium">OWASP A01</td>
                  </tr>
                  <tr className="hover:bg-[#FAF9F6]">
                    <td className="p-3 font-semibold text-[#638466] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Inter-System Comm
                    </td>
                    <td className="p-3">Undefined payload crashes, credential leakage during transit.</td>
                    <td className="p-3">Zero-crash payload sanitization (`sanitizeForFirestore`) stripping undefined properties; HTTPS transport.</td>
                    <td className="p-3 text-[#666057] font-medium">OWASP A02</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Firestore Rules Verification */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#466548] mb-2">
              2. Deployed Firestore Security Rules
            </h3>
            <pre className="p-4 rounded-xl bg-[#242220] border border-[#3A3733] text-[#FAF9F6] font-mono text-xs overflow-x-auto">
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
        <div className="p-4 border-t border-[#EDE8E1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F7F4EE] hover:bg-[#EDE8E1] text-[#242220] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Threat Model
          </button>
        </div>

      </div>
    </div>
  );
};
