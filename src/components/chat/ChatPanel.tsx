'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Zap, Cpu } from 'lucide-react';
import { PlantConfig } from '@/lib/types/plant';
import { parseNaturalLanguagePrompt } from '@/lib/engine/aiParser';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface ChatPanelProps {
  plantConfig: PlantConfig;
  setPlantConfig: React.Dispatch<React.SetStateAction<PlantConfig>>;
  onPromptApplied: (explanation: string) => void;
}

const QUICK_PROMPTS = [
  "Agave Americana with sharp blue-green sword rosette",
  "Tall Italian Cypress spire, narrow columnar elevation",
  "Ornamental fountain grass with arching blades and seed heads",
  "Weeping Japanese maple with delicate crimson foliage",
  "Scots pine conifer tower with rugged dark needle clusters",
  "Architectural circle elevation tree symbol for CAD blueprint",
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
      text: "Welcome! I am your AI Botanical Geometry Assistant powered by Google Gemini. Describe any plant species or architectural symbol (e.g., *'Agave rosette'*, *'Italian cypress spire'*, or *'Weeping maple'*), and I will procedurally generate its CAD parameters.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Gemini AI Engine',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async (textToSend?: string) => {
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

    try {
      // Call Gemini API Route
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, currentConfig: plantConfig }),
      });

      const data = await res.json();

      if (data.success && data.config) {
        // Apply Gemini AI-generated plant config
        setPlantConfig((prev) => ({
          ...prev,
          ...data.config,
          seed: Math.floor(Math.random() * 100000),
        }));

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.explanation || `Generated procedural ${data.config.growthProfile || 'plant'} model from Gemini AI.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Gemini 2.0 Flash',
        };

        setMessages((prev) => [...prev, aiMsg]);
        onPromptApplied(aiMsg.text);
      } else {
        // Fallback to client-side botanical parser if API key is not present or error
        const fallbackResult = parseNaturalLanguagePrompt(query, plantConfig);
        setPlantConfig((prev) => ({
          ...prev,
          ...fallbackResult.config,
        }));

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallbackResult.explanation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Procedural Engine',
        };

        setMessages((prev) => [...prev, aiMsg]);
        onPromptApplied(fallbackResult.explanation);
      }
    } catch (err) {
      console.error('Error contacting Gemini API:', err);
      // Fallback
      const fallbackResult = parseNaturalLanguagePrompt(query, plantConfig);
      setPlantConfig((prev) => ({
        ...prev,
        ...fallbackResult.config,
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallbackResult.explanation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Procedural Engine',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Gemini Botanical Translator
          </h2>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono flex items-center space-x-1">
          <Cpu className="w-3 h-3 mr-1" />
          <span>GEMINIAPI Active</span>
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
              <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/10">
                <span
                  className={`text-[9px] ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {msg.timestamp}
                </span>
                {msg.source && (
                  <span className="text-[9px] font-mono text-emerald-400/90 font-semibold">
                    {msg.source}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting Gemini AI API for botanical parameters...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex items-center space-x-1 mb-2 text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Botanical Prompts</span>
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
            placeholder="Ask Gemini (e.g. 'Agave rosette' or 'Italian cypress spire')..."
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
