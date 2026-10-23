import React from 'react';
import { MessageSquare, Brain, Settings, Trash2, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: 'chat' | 'memory' | 'tools' | 'settings';
  setActiveTab: (tab: 'chat' | 'memory' | 'tools' | 'settings') => void;
  memoryCount: number;
  onClearMemory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  memoryCount,
  onClearMemory,
}) => {
  return (
    <aside className="w-64 bg-grimoire-900 border-l border-grimoire-800 flex flex-col justify-between p-4 select-none">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            القائمة الرئيسية
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white border border-amber-500/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-grimoire-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>المحادثة المباشرة</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'memory'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white border border-amber-500/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-grimoire-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>ذاكرة الوكيل</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                {memoryCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white border border-amber-500/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-grimoire-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>إطار الأدوات (Tools)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white border border-amber-500/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-grimoire-800/60'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>الإعدادات والنموذج</span>
            </button>
          </nav>
        </div>

        {/* System Info Box */}
        <div className="p-3 bg-grimoire-950/80 rounded-xl border border-grimoire-800 text-xs text-gray-400 space-y-1.5">
          <div className="flex justify-between items-center text-gray-300 font-semibold">
            <span>النموذج المحلي</span>
            <span className="text-amber-400 font-mono">Qwen3-7B</span>
          </div>
          <p className="text-[11px] text-gray-400">التكميم: INT4 (GGUF)</p>
          <p className="text-[11px] text-gray-400">الذاكرة المستخدمة: ~4.2 GB</p>
        </div>
      </div>

      {/* Clear Memory / Danger Zone Button */}
      <div className="pt-4 border-t border-grimoire-800">
        <button
          onClick={onClearMemory}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>مسح الذاكرة بالكامل</span>
        </button>
      </div>
    </aside>
  );
};
