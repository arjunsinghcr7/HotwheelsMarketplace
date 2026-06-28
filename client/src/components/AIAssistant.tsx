import React, { useEffect, useRef, useState } from 'react';
import { askAssistant } from '../services/api';
import type { AssistantMessage } from '../services/api';
import { fileToDataURL } from '../services/collection';

interface ChatTurn extends AssistantMessage {
  image?: string; // data URL shown in the bubble
}

const SUGGESTIONS = [
  'Recommend a JDM car under $30',
  'Review the Ferrari F40',
  'Best hypercar for a first buy?',
];

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: 'assistant',
      text: "Hi! I'm your HotWheels Paradise concierge. I can recommend cars from the store, review a specific model, or help with pricing & condition — just ask, or upload a photo.",
    },
  ]);
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, isOpen, isSending]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataURL(file);
      setPendingImage(dataUrl);
    } catch {
      // ignore — user can retry
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingImage) || isSending) return;

    const image = pendingImage;
    const userTurn: ChatTurn = {
      role: 'user',
      text: trimmed || (image ? '(uploaded a photo)' : ''),
      image: image || undefined,
    };
    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    setInput('');
    setPendingImage('');
    setIsSending(true);

    try {
      // Send the conversation as plain text turns; the image rides on the latest turn.
      const history: AssistantMessage[] = nextTurns.map((t) => ({
        role: t.role,
        text: t.text || (t.image ? 'Assess this car: condition and a fair price range.' : ''),
      }));
      const { reply } = await askAssistant(history, image || undefined);
      setTurns((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err: any) {
      setTurns((prev) => [
        ...prev,
        { role: 'assistant', text: err?.message || 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating launcher button — bottom right */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="AI price assistant"
        className="fixed bottom-12 right-4 z-50 w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container shadow-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all border border-outline-variant"
      >
        <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[32rem] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-outline-variant bg-surface-container-low">
          {/* Header */}
          <div className="p-md bg-surface-container-high border-b border-outline-variant flex items-center gap-sm">
            <span className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">smart_toy</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-label-md font-bold text-on-surface">Paradise Concierge</p>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]"></span>
                Recommend · review · price
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">
            {turns.map((t, i) => (
              <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-sm py-2 text-body-md whitespace-pre-wrap ${
                    t.role === 'user'
                      ? 'bg-secondary-container text-on-secondary-container rounded-br-sm'
                      : 'bg-surface-container-high text-on-surface rounded-bl-sm'
                  }`}
                >
                  {t.image && (
                    <img src={t.image} alt="upload" className="mb-2 rounded-lg max-h-40 w-full object-cover" />
                  )}
                  {renderText(t.text)}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-surface-container-high text-on-surface-variant rounded-2xl rounded-bl-sm px-sm py-2 text-body-md flex items-center gap-1">
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (only before the first user message) */}
          {turns.length === 1 && (
            <div className="px-md pb-2 flex flex-wrap gap-xs">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-sm py-1 text-[11px] rounded-full border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Pending image preview */}
          {pendingImage && (
            <div className="px-md pb-2">
              <div className="relative inline-block">
                <img src={pendingImage} alt="attached" className="h-16 w-16 object-cover rounded-lg border border-outline-variant" />
                <button
                  onClick={() => setPendingImage('')}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center border border-outline-variant"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-sm border-t border-outline-variant bg-surface-container flex items-end gap-xs"
          >
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Upload a car photo"
              className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest rounded-full transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask about a price or condition…"
              className="flex-1 resize-none bg-surface-container-lowest border border-outline-variant rounded-xl px-sm py-2 max-h-24 leading-snug outline-none focus:ring-1 focus:ring-secondary focus:border-secondary text-label-sm text-on-surface placeholder:text-on-surface-variant/50 placeholder:truncate"
            />
            <button
              type="submit"
              disabled={isSending || (!input.trim() && !pendingImage)}
              className="p-2 rounded-full bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// Minimal **bold** rendering so the assistant's emphasis shows up.
function renderText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
