'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Zap } from 'lucide-react';
import { PlantConfig } from '@/lib/types/plant';
import { parseNaturalLanguagePrompt } from '@/lib/engine/aiParser';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  configDiff?: string;
}

interface ChatPanelProps {
  plantConfig: PlantConfig;
  setPlantConfig: React.Dispatch<React.SetStateAction<PlantConfig>>;
  onPromptApplied: (explanation: string) => void;
}

const QUICK_PROMPTS = [
  "Weeping Japanese maple with delicate crimson foliage",
  "Columnar Italian cypress, side view, dense needle clusters",
  "Architectural elevation symbol with clean circle line art",
  "Scots pine with thick tapered trunk and dark pine needles",
  "Zen garden bonsai tree with gnarled horizontal branching",
  "Make foliage sparse, delicate, and increase height",
  "Switch color palette to Architectural Blueprint blue",
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  plantConfig,
  setPlantConfig,
  onPromptApplied,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello architect! Describe the plant symbol you want to generate (e.g. *'a weeping Japanese maple, front view, delicate branching'* or *'columnar Italian cypress'*), or select a prompt below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsGenerating(true);

    // Simulate AI parsing delay
    setTimeout(() => {
      const result = parseNaturalLanguagePrompt(query, plantConfig);
      
      setPlantConfig((prev) => ({
        ...prev,
        ...result.config,
      }));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.explanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
      onPromptApplied(result.explanation);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            AI Botanical Translator
          </h2>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
          Online
        </span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`text-[9px] mt-1.5 block ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-[var(--text-muted)]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Parsing botanical geometry & parameters...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex items-center space-x-1 mb-2 text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Architectural Prompts</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-[var(--bg-primary)] hover:bg-emerald-500/20 hover:text-emerald-300 text-[var(--text-secondary)] border border-[var(--border-color)] px-2.5 py-1 rounded-md transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a plant (e.g. 'broad oak elevation with dense foliage')..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
