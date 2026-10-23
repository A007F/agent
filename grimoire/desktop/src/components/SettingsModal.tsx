import React from 'react';
import { Settings, Cpu, Cloud, Zap, X, Save } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-grimoire-900 border border-grimoire-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-grimoire-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-grimoire-800 pb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">إعدادات النموذج والربط المحلي</h3>
            <p className="text-xs text-gray-400">ربط ملف الـ GGUF وسيرفر الاستدلال المحلي.</p>
          </div>
        </div>

        {/* Local Model GGUF Path Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300">
            مسار ملف نموذج GGUF المحلي:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.modelPath || 'H:\\Qwen2.5-7B-Instruct-Q5_K_M.gguf'}
              onChange={(e) => onUpdateSettings({ ...settings, modelPath: e.target.value })}
              placeholder="H:\Qwen2.5-7B-Instruct-Q5_K_M.gguf"
              className="w-full bg-grimoire-950 border border-grimoire-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Local Server URL Endpoint */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300">
            رابط سيرفر الاستدلال المحلي (Server Endpoint):
          </label>
          <input
            type="text"
            value={settings.serverUrl || 'http://127.0.0.1:8080/v1/chat/completions'}
            onChange={(e) => onUpdateSettings({ ...settings, serverUrl: e.target.value })}
            placeholder="http://127.0.0.1:8080/v1/chat/completions"
            className="w-full bg-grimoire-950 border border-grimoire-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Execution Mode Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">نمط التشغيل (Execution Mode):</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ ...settings, executionMode: 'local' })}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                settings.executionMode === 'local'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-grimoire-950 border-grimoire-800 text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>محلي بالكامل (Local GGUF)</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ ...settings, executionMode: 'cloud' })}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                settings.executionMode === 'cloud'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                  : 'bg-grimoire-950 border-grimoire-800 text-gray-400 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-purple-400" />
              <span>سحابي (Cloud API Hybrid)</span>
            </button>
          </div>
        </div>

        {/* Low Resource Mode Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-grimoire-950 rounded-2xl border border-grimoire-800">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>وضع الأداء المنخفض (Low-Resource Mode)</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              تقليل استهلاك الذاكرة والرسومات للأجهزة القديمة (4GB RAM).
            </p>
          </div>

          <button
            onClick={() => onUpdateSettings({ ...settings, lowResourceMode: !settings.lowResourceMode })}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 relative ${
              settings.lowResourceMode ? 'bg-emerald-500' : 'bg-grimoire-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.lowResourceMode ? 'translate-x-0' : '-translate-x-5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>حفظ وتطبيق الإعدادات</span>
        </button>
      </div>
    </div>
  );
};
