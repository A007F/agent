import React from 'react';
import { Cpu, ShieldCheck, FolderSearch, Settings, Zap } from 'lucide-react';
import { LicenseStatus, AppSettings } from '../types';

interface HeaderProps {
  licenseStatus: LicenseStatus;
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenLicensing: () => void;
  onScanProject: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  licenseStatus,
  settings,
  onOpenSettings,
  onOpenLicensing,
  onScanProject,
  isScanning,
}) => {
  return (
    <header className="h-16 bg-grimoire-900 border-b border-grimoire-800 px-6 flex items-center justify-between shadow-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white font-sans tracking-wide">Grimoire Agent</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              v1.0 INT4
            </span>
          </div>
          <p className="text-xs text-gray-400">الوكيل الذكي المحلي - Qwen3-7B Local Engine</p>
        </div>
      </div>

      {/* Control Actions & Status */}
      <div className="flex items-center gap-3">
        {/* Low Resource Badge */}
        {settings.lowResourceMode && (
          <span className="flex items-center gap-1 text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            وضع الأداء الخفيف
          </span>
        )}

        {/* Scan Workspace Button */}
        <button
          onClick={onScanProject}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-grimoire-800 hover:bg-grimoire-700 text-gray-200 hover:text-white border border-grimoire-700 text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          title="مسح وتحليل المجلد الحالي وإضافته للسياق"
        >
          <FolderSearch className={`w-4 h-4 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'جاري المسح...' : 'تحليل المشروع'}</span>
        </button>

        {/* License Badge */}
        <button
          onClick={onOpenLicensing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{licenseStatus.isLicensed ? 'نسخة مرخصة' : 'تفعيل الترخيص'}</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-grimoire-800 hover:bg-grimoire-700 text-gray-300 hover:text-white border border-grimoire-700 transition-colors"
          title="الإعدادات والنموذج"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
