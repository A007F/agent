import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, FolderSearch, CornerDownLeft, Wrench } from 'lucide-react';
import { Message } from '../types';
import { CodeBlock } from './CodeBlock';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onScanProject: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  onScanProject,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const renderContentWithCode = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; value: string; language?: string }[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: content.substring(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        value: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        value: content.substring(lastIndex),
      });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return <CodeBlock key={idx} language={part.language ?? 'text'} code={part.value} />;
      }
      return (
        <p key={idx} className="whitespace-pre-wrap leading-relaxed text-gray-200 my-1">
          {part.value}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-grimoire-950 overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center shadow-xl mb-4 animate-bounce">
              <Bot className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">مرحباً بك في Grimoire Agent</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              مساعدك البرمجي الذكي الموصول بالنموذج المحلي Qwen3-7B. جاهز لقراءة الأكواد، تحليل الملفات، وتوليد الحلول دون إرسال بياناتك خارج جهازك.
            </p>

            <div className="grid grid-cols-1 gap-2.5 w-full text-right">
              <button
                onClick={() => onSendMessage('كيف يمكنني قراءة وكتابة الملفات محلياً باستخدام إطار العمل؟')}
                className="p-3 bg-grimoire-900 hover:bg-grimoire-800 border border-grimoire-800 hover:border-amber-500/50 rounded-xl text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span>"كيف يمكنني قراءة وكتابة الملفات محلياً باستخدام إطار العمل؟"</span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => onSendMessage('اشرح لي نظام الذاكرة المحلية وطريقة حفظ السياق.')}
                className="p-3 bg-grimoire-900 hover:bg-grimoire-800 border border-grimoire-800 hover:border-purple-500/50 rounded-xl text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span>"اشرح لي نظام الذاكرة المحلية وطريقة حفظ السياق."</span>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={onScanProject}
                className="p-3 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 rounded-xl text-xs text-cyan-200 font-semibold transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <FolderSearch className="w-4 h-4 text-cyan-400" />
                  <span>مسح وتحليل مشروع الهيكل البرمجي الحالي</span>
                </div>
                <CornerDownLeft className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-4xl mx-auto ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                  msg.role === 'user'
                    ? 'bg-amber-600'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                }`}
              >
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 rounded-2xl p-4 text-sm shadow-md border ${
                  msg.role === 'user'
                    ? 'bg-grimoire-800 border-grimoire-700 text-white rounded-tr-none'
                    : 'bg-grimoire-900 border-grimoire-800 text-gray-100 rounded-tl-none'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 pb-1 border-b border-grimoire-800/60">
                  <span className="font-semibold text-gray-300">
                    {msg.role === 'user' ? 'أنت' : 'Grimoire Agent'}
                  </span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Tool call indicator */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {msg.toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="flex items-center gap-2 p-2 bg-grimoire-950 rounded-lg border border-cyan-800/50 text-xs text-cyan-300 font-mono"
                      >
                        <Wrench className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>استدعاء الأداة المحلية: {tc.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div>{renderContentWithCode(msg.content)}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-grimoire-900 border-t border-grimoire-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2 bg-grimoire-950 p-2 rounded-2xl border border-grimoire-800 focus-within:border-amber-500/50 transition-colors shadow-lg">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="اكتب سؤالك أو طلبك للوكيل البرمجي الذكي..."
            rows={1}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none min-h-[42px] max-h-32"
          />

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
        <p className="text-[11px] text-gray-500 text-center mt-2">
          النموذج يعمل محلياً بالكامل بضمان الخصوصية وسرية البيانات.
        </p>
      </div>
    </div>
  );
};
