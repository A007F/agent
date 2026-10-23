import React, { useState } from 'react';
import { Brain, Search, Trash2 } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryPanelProps {
  memories: MemoryItem[];
  onClearMemory: () => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memories, onClearMemory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMemories = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category: MemoryItem['category']) => {
    switch (category) {
      case 'user_preference':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700">تفضيلات المستخدم</span>;
      case 'project_fact':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-900/60 text-amber-300 border border-amber-700">حقائق المشروع</span>;
      case 'system_rule':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700">قواعد النظام</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300 border border-gray-700">سياق محلي</span>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-grimoire-950 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-grimoire-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ذاكرة الوكيل المعرفية (Agent Memory)</h2>
              <p className="text-xs text-gray-400">
                السياق والحقائق والتفضيلات المحفوظة محلياً في قاعدة البيانات الخاصة بك.
              </p>
            </div>
          </div>

          <button
            onClick={onClearMemory}
            className="flex items-center gap-2 px-3 py-2 bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-900 rounded-xl text-xs font-semibold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح الذاكرة بالكامل</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في سجل الذكريات والسياق..."
            className="w-full bg-grimoire-900 border border-grimoire-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Memory Items List */}
        <div className="space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-grimoire-900 rounded-2xl border border-grimoire-800">
              لا توجد ذكريات مسجلة تتطابق مع البحث.
            </div>
          ) : (
            filteredMemories.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-grimoire-900 rounded-2xl border border-grimoire-800 hover:border-grimoire-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.key}</span>
                    {getCategoryBadge(item.category)}
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{item.content}</p>
                <div className="text-[11px] text-gray-400 bg-grimoire-950 p-2 rounded-lg border border-grimoire-800/80">
                  <span className="text-amber-400 font-semibold">الملخص: </span>
                  {item.summary}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
