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
    label: 'Deep Reflection',
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
  'How might this challenge look if I viewed it as an opportunity for growth?',
  'What is one small boundary or action I can establish this week?',
  'What emotions are present under the surface of this thought?',
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
    <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full min-h-[500px]">
      
      {/* Header with Style Selection */}
      <div className="pb-4 border-b border-[#EDE8E1] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F1F6F1] text-[#466548] flex items-center justify-center border border-[#DCE8DC] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#638466]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242220] flex items-center gap-2">
                Gemini Dialogue
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F4EE] text-[#666057] border border-[#EDE8E1]">
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
              className="flex items-center gap-1 text-xs font-semibold text-[#918B82] hover:text-[#C46A52] px-2.5 py-1 rounded-lg hover:bg-[#FDF4F0] transition-colors cursor-pointer"
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
              className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                selectedStyle === style.id
                  ? 'bg-[#F1F6F1] border-[#DCE8DC] text-[#466548] shadow-xs'
                  : 'bg-[#F7F4EE] border-[#EAE4DC] text-[#666057] hover:text-[#242220] hover:bg-[#EDE8E1]'
              }`}
            >
              <div className={selectedStyle === style.id ? 'text-[#638466]' : 'text-[#918B82]'}>
                {style.icon}
              </div>
              <div className="truncate">
                <p className="truncate">{style.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[420px] pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#666057]">
            <div className="w-12 h-12 rounded-2xl bg-[#F1F6F1] border border-[#DCE8DC] flex items-center justify-center text-[#638466] mb-3 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#242220] mb-1">Begin Your Reflection</h4>
            <p className="text-xs text-[#666057] max-w-sm mb-4">
              Ask Gemini to reflect on your journal entry above, explore an emotion, or brainstorm next steps.
            </p>

            {/* Suggested quick questions */}
            <div className="w-full max-w-md flex flex-col gap-1.5 text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#918B82] font-bold px-1">
                Suggested Prompts:
              </span>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(q)}
                  className="text-xs p-2.5 rounded-xl bg-[#F7F4EE] hover:bg-[#F1F6F1] border border-[#EAE4DC] text-[#423E39] hover:text-[#242220] hover:border-[#DCE8DC] transition-all text-left shadow-xs cursor-pointer font-medium"
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
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-xl bg-[#F1F6F1] text-[#638466] flex items-center justify-center shrink-0 border border-[#DCE8DC] mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#638466] text-white rounded-tr-xs'
                    : 'bg-[#F7F5F0] border border-[#EDE8E1] text-[#242220] rounded-tl-xs'
                }`}
              >
                {msg.role === 'model' ? (
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#EDE8E1] text-[10px] text-[#666057] font-medium">
                      <span className="capitalize font-semibold text-[#466548]">
                        {msg.style ? `${msg.style} Mode` : 'Reflection'}
                      </span>
                      <div className="flex items-center gap-2">
                        {msg.modelUsed && <span>{msg.modelUsed}</span>}
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="text-[#918B82] hover:text-[#242220] p-0.5 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-[#638466]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="max-w-none text-xs sm:text-sm leading-relaxed space-y-2 text-[#242220]">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                )}

                <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-[#DCE8DC] text-right' : 'text-[#918B82]'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-[#2D2A26] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 text-xs sm:text-sm justify-start">
            <div className="w-7 h-7 rounded-xl bg-[#F1F6F1] text-[#638466] flex items-center justify-center shrink-0 border border-[#DCE8DC] mt-0.5 shadow-xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-[#F7F5F0] border border-[#EDE8E1] text-[#666057] rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#638466]" />
              <span>Gemini is contemplating your reflection...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="mb-3 p-2.5 bg-[#FDF4F0] border border-[#FADCD5] rounded-xl text-[#B6634C] text-xs shadow-xs">
          {errorMessage}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-[#EDE8E1] flex flex-col gap-2">
        <div className="relative">
          <textarea
            id="textarea-dialogue-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Gemini in ${STYLE_OPTIONS.find(s => s.id === selectedStyle)?.label} mode... (Shift+Enter for newline)`}
            rows={2}
            className="w-full bg-[#FAF9F6]/90 border border-[#EDE8E1] rounded-xl p-3 pr-10 text-[#242220] placeholder-[#918B82] text-xs sm:text-sm focus:outline-none focus:border-[#638466] focus:ring-2 focus:ring-[#638466]/20 transition-all resize-none"
          />
          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#638466] hover:bg-[#527055] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#918B82] px-1 font-medium">
          <span>Active context: Journal Content ({entryContent.length} chars)</span>
          <span>Press Enter to send</span>
        </div>
      </form>

    </div>
  );
};
