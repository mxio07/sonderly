import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2
} from 'lucide-react';
import { ChatMessage, ReflectionStyle } from '../types';

interface GeminiConversationProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, style: ReflectionStyle) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  entryContent: string;
  errorMessage?: string | null;
}

const STYLE_OPTIONS: Array<{
  id: ReflectionStyle;
  label: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'reflection',
    label: 'Deep Inquiry',
    desc: 'Empathetic reframing & cognitive insights',
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    desc: 'Creative possibilities & next steps',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
  },
  {
    id: 'questions',
    label: 'Socratic Prompts',
    desc: 'Thought-provoking deep questions',
    icon: <HelpCircle className="w-3.5 h-3.5" />,
  },
  {
    id: 'summary',
    label: 'Synthesis',
    desc: 'Structured overview of realizations',
    icon: <FileText className="w-3.5 h-3.5" />,
  },
];

const SUGGESTED_QUESTIONS = [
  'What underlying assumptions might I be making here?',
  'How might this challenge look if I viewed it as a strategic inflection point?',
  'What is the highest-leverage boundary or action I can establish this week?',
  'What latent signals or tensions are present under the surface of this thought?',
];

export const GeminiConversation: React.FC<GeminiConversationProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  entryContent,
  errorMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ReflectionStyle>('reflection');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg, selectedStyle);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptClick = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full min-h-[500px]">
      
      {/* Header with Style Selection */}
      <div className="pb-4 border-b border-[#EAE4DC] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5EFE6] text-[#8C6226] flex items-center justify-center border border-[#E8DCB8] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#B88746]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F1D1A] flex items-center gap-2">
                Gemini Dialogue
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#7C7469] border border-[#E8E2D7]">
                  gemini-3.6-flash
                </span>
              </h3>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              id="btn-clear-chat"
              onClick={onClearChat}
              title="Clear dialogue history for this entry"
              className="flex items-center gap-1 text-xs font-semibold text-[#9E9589] hover:text-[#9E4733] px-2.5 py-1 rounded-lg hover:bg-[#FDF3F0] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Reflection Mode Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              id={`btn-style-${style.id}`}
              onClick={() => setSelectedStyle(style.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedStyle === style.id
                  ? 'bg-[#F5EFE6] border-[#DFCBA8] text-[#593A12] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E0D8CA] text-[#3D352E] hover:text-[#1F1D1A] hover:bg-[#F0EAE1]'
              }`}
            >
              <div className={selectedStyle === style.id ? 'text-[#8C5E24]' : 'text-[#6B6052]'}>
                {style.icon}
              </div>
              <div className="truncate">
                <p className="truncate font-bold">{style.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[440px] pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#4D453B]">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] border border-[#DFCBA8] flex items-center justify-center text-[#8C5E24] mb-3 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#1F1D1A] mb-1">Begin Your Exploration</h4>
            <p className="text-xs sm:text-sm text-[#3D352E] max-w-sm mb-4 leading-relaxed font-normal">
              Ask Gemini to analyze your reflection above, examine tensions, or synthesize actionable insights.
            </p>

            {/* Suggested quick questions */}
            <div className="w-full max-w-md flex flex-col gap-2 text-left">
              <span className="text-xs uppercase tracking-wider text-[#3D352E] font-bold px-1">
                Suggested Prompts:
              </span>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(q)}
                  className="text-xs sm:text-sm p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E0D8CA] text-[#1F1D1A] hover:border-[#8C5E24] transition-all text-left shadow-2xs cursor-pointer font-medium leading-relaxed"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm sm:text-base ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-[#F5EFE6] text-[#593A12] flex items-center justify-center shrink-0 border border-[#DFCBA8] mt-0.5 shadow-xs">
                  <Bot className="w-4.5 h-4.5 text-[#8C5E24]" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#2A241F] text-white rounded-tr-xs'
                    : 'bg-[#FAF8F5] border border-[#E0D8CA] text-[#1F1D1A] rounded-tl-xs'
                }`}
              >
                {msg.role === 'model' ? (
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#EAE4DC] text-xs text-[#4D453B] font-semibold">
                      <span className="capitalize font-bold text-[#593A12]">
                        {msg.style ? `${msg.style} Mode` : 'Reflection'}
                      </span>
                      <div className="flex items-center gap-2">
                        {msg.modelUsed && <span className="font-mono text-xs">{msg.modelUsed}</span>}
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="text-[#6B6052] hover:text-[#1F1D1A] p-0.5 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-[#8C5E24]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="max-w-none text-sm sm:text-base leading-relaxed space-y-2 text-[#1F1D1A] font-normal">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed font-normal">{msg.text}</p>
                )}

                <div className={`text-xs mt-2 font-medium ${msg.role === 'user' ? 'text-[#E0D8CA] text-right' : 'text-[#6B6052]'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#2A241F] text-[#E5C287] flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-xs">
                  <User className="w-4.5 h-4.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 text-xs sm:text-sm justify-start">
            <div className="w-8 h-8 rounded-xl bg-[#F5EFE6] text-[#593A12] flex items-center justify-center shrink-0 border border-[#DFCBA8] mt-0.5 shadow-xs">
              <Bot className="w-4.5 h-4.5 animate-pulse text-[#8C5E24]" />
            </div>
            <div className="bg-[#FAF8F5] border border-[#E0D8CA] text-[#3D352E] font-semibold rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#8C5E24]" />
              <span>Gemini is synthesizing thoughts...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-[#FDF3F0] border border-[#FADCD5] rounded-xl text-[#9E4733] text-xs sm:text-sm shadow-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-[#EAE4DC] flex flex-col gap-2">
        <div className="relative">
          <textarea
            id="textarea-dialogue-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Gemini in ${STYLE_OPTIONS.find(s => s.id === selectedStyle)?.label} mode... (Shift+Enter for newline)`}
            rows={2}
            className="w-full bg-[#FAF8F5] border border-[#E0D8CA] rounded-xl p-3 pr-12 text-[#1F1D1A] placeholder-[#6B6052] text-sm sm:text-base focus:outline-none focus:border-[#8C5E24] focus:ring-2 focus:ring-[#8C5E24]/20 transition-all resize-none font-normal"
          />
          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 bottom-3.5 p-2 rounded-xl bg-[#8C5E24] hover:bg-[#734A18] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-[#4D453B] px-1 font-semibold">
          <span>Active context: Journal Content ({entryContent.length} chars)</span>
          <span>Press Enter to send</span>
        </div>
      </form>

    </div>
  );
};
