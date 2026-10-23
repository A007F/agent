import React, { useState } from 'react';
import { ShieldCheck, X, ExternalLink } from 'lucide-react';
import { LicenseStatus } from '../types';

interface LicensingModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseStatus: LicenseStatus;
  onVerifyKey: (key: string) => Promise<boolean>;
}

export const LicensingModal: React.FC<LicensingModalProps> = ({
  isOpen,
  onClose,
  licenseStatus,
  onVerifyKey,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const isValid = await onVerifyKey(keyInput.trim());
      if (isValid) {
        setMessage({ type: 'success', text: 'تم تفعيل الترخيص بنجاح! مبروك الحصول على النسخة الكاملة مدى الحياة.' });
      } else {
        setMessage({ type: 'error', text: 'رمز التفعيل غير صحيح أو متطابق مع مفتاح آخر.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاتصال بسيرفر التفعيل.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-grimoire-900 border border-grimoire-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-grimoire-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-grimoire-800 pb-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">نظام التراخيص والتفعيل</h3>
            <p className="text-xs text-gray-400">شراء وتفعيل الترخيص لمرة واحدة مع ربط الحماية بالجهاز.</p>
          </div>
        </div>

        {/* Hardware ID Display */}
        <div className="p-3.5 bg-grimoire-950 rounded-2xl border border-grimoire-800 space-y-1">
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>البصمة الرقمية للجهاز (Hardware ID):</span>
            <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">نشط</span>
          </div>
          <p className="font-mono text-xs text-amber-300 font-semibold">{licenseStatus.hardwareId}</p>
        </div>

        {/* License Verification Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-semibold text-gray-300">
            أدخل مفتاح التفعيل (License Key):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="flex-1 bg-grimoire-950 border border-grimoire-800 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !keyInput.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'تفعيل'}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-900 text-rose-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Payment Gateways Options */}
        <div className="p-4 bg-gradient-to-br from-amber-950/30 to-purple-950/30 rounded-2xl border border-amber-500/20 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-amber-300">
            <span>الترخيص مدى الحياة (Lifetime Access)</span>
            <span className="text-sm font-extrabold">$50 / لمرة واحدة</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            احصل على كود التفعيل الفوري مع دعم كامل للتحديثات المستقبلية والتشغيل أوفلاين دون اشتراكات شهرية.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => alert('إعادة التوجيه إلى بوابة Paddle...')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>الشراء عبر Paddle</span>
            </button>
            <button
              onClick={() => alert('إعادة التوجيه إلى بوابة Gumroad...')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>الشراء عبر Gumroad</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
