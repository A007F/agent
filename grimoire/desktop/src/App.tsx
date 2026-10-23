import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { LicensingModal } from './components/LicensingModal';
import { SettingsModal } from './components/SettingsModal';
import { Message, MemoryItem, LicenseStatus, AppSettings } from './types';
import {
  sendPromptToModel,
  getConversationHistory,
  saveMessage,
  getMemories,
  scanWorkspace,
  checkLicenseStatus,
  verifyLicenseKey,
  clearAllMemory,
} from './services/tauriBridge';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'tools' | 'settings'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Modals state
  const [isLicensingOpen, setIsLicensingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // App settings & license state
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({
    isLicensed: true,
    hardwareId: 'HW-8F39A2-LOCAL-DEV',
    tier: 'pro_lifetime',
  });

  const [settings, setSettings] = useState<AppSettings>({
    executionMode: 'local',
    localModelName: 'Qwen2.5-7B-Instruct-Q5_K_M',
    lowResourceMode: false,
    autoSummary: true,
    modelPath: 'H:\\Qwen2.5-7B-Instruct-Q5_K_M.gguf',
    serverUrl: 'http://127.0.0.1:8080/v1/chat/completions',
  });

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const hist = await getConversationHistory();
        setMessages(hist);
        const mems = await getMemories();
        setMemories(mems);
        const lic = await checkLicenseStatus();
        setLicenseStatus(lic);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadData();
  }, []);

  // Send message
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const assistantMsg: Message = {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsGenerating(true);

    try {
      await saveMessage(userMsg);
      let accumulatedResponse = '';

      await sendPromptToModel(
        text,
        (token) => {
          accumulatedResponse = token;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsg.id ? { ...msg, content: accumulatedResponse } : msg
            )
          );
        },
        settings
      );

      const finalAssistantMsg: Message = {
        ...assistantMsg,
        content: accumulatedResponse,
        isStreaming: false,
      };

      await saveMessage(finalAssistantMsg);
    } catch (err) {
      console.error('Error generating response:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsg.id
            ? { ...msg, content: 'حدث خطأ أثناء الاتصال بالنموذج المحلي.', isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Scan workspace
  const handleScanProject = async () => {
    setIsScanning(true);
    try {
      const result = await scanWorkspace();
      const systemMsg: Message = {
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `🔍 **نتائج تحليل مشروعك المحلي:**\n\n${result}\n\nتمت إضافة هيكل المشروع إلى ذاكرة السياق للوكيل الذكي!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMsg]);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Clear memory
  const handleClearMemory = async () => {
    if (confirm('هل أنت تأكد من رغبتك في مسح كافة السجلات والذكريات المحفوظة محلياً؟')) {
      await clearAllMemory();
      setMemories([]);
      setMessages([]);
      alert('تم مسح الذاكرة بالكامل بنجاح.');
    }
  };

  // Verify license key
  const handleVerifyLicense = async (key: string): Promise<boolean> => {
    const success = await verifyLicenseKey(key);
    if (success) {
      setLicenseStatus((prev) => ({ ...prev, isLicensed: true, licenseKey: key }));
    }
    return success;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-grimoire-950 font-sans text-gray-100 overflow-hidden dir-rtl">
      {/* Header */}
      <Header
        licenseStatus={licenseStatus}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLicensing={() => setIsLicensingOpen(true)}
        onScanProject={handleScanProject}
        isScanning={isScanning}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          memoryCount={memories.length}
          onClearMemory={handleClearMemory}
        />

        {/* Dynamic Content */}
        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' && (
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onScanProject={handleScanProject}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryPanel memories={memories} onClearMemory={handleClearMemory} />
          )}

          {activeTab === 'tools' && (
            <div className="flex-1 p-8 bg-grimoire-950 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-grimoire-800 pb-3">
                  إطار عمل الأدوات والمهام (Tools Framework)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-grimoire-900 border border-grimoire-800 rounded-2xl space-y-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      read_file
                    </span>
                    <h3 className="font-bold text-white text-sm">قراءة الملفات المحلية</h3>
                    <p className="text-xs text-gray-400">تتيح للنموذج استكشاف وقراءة المحتوى البرمجي من الجهاز.</p>
                  </div>

                  <div className="p-4 bg-grimoire-900 border border-grimoire-800 rounded-2xl space-y-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      write_file
                    </span>
                    <h3 className="font-bold text-white text-sm">كتابة وتعديل الملفات</h3>
                    <p className="text-xs text-gray-400">تسمح للوكيل بتعديل الملفات وإنشاء السكربتات بسلامة.</p>
                  </div>

                  <div className="p-4 bg-grimoire-900 border border-grimoire-800 rounded-2xl space-y-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      search_workspace
                    </span>
                    <h3 className="font-bold text-white text-sm">البحث في المجلد</h3>
                    <p className="text-xs text-gray-400">البحث واستخراج هيكل المجلدات والرموز البرمجية.</p>
                  </div>

                  <div className="p-4 bg-grimoire-900 border border-grimoire-800 rounded-2xl space-y-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      auto_script_sandbox
                    </span>
                    <h3 className="font-bold text-white text-sm">مولد الأدوات التلقائي</h3>
                    <p className="text-xs text-gray-400">كتابة سكربتات Rust/Python وتنفيذها في بيئة معزولة Sandbox.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 p-8 bg-grimoire-950 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-grimoire-800 pb-3">
                  إعدادات التطبيق العامة
                </h2>
                <div className="p-6 bg-grimoire-900 border border-grimoire-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-sm">وضع التشغيل الأوفلاين</h3>
                      <p className="text-xs text-gray-400">النموذج يعمل محلياً 100% بدون اتصال بالإنترنت.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-semibold">
                      مفعل
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-grimoire-800">
                    <div>
                      <h3 className="font-bold text-white text-sm">التحديثات المجدولة تلقائياً</h3>
                      <p className="text-xs text-gray-400">فحص وتحديث قواعد الأدوات والذاكرة شهرياً.</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-xl text-xs font-semibold">
                      تلقائي
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <LicensingModal
        isOpen={isLicensingOpen}
        onClose={() => setIsLicensingOpen(false)}
        licenseStatus={licenseStatus}
        onVerifyKey={handleVerifyLicense}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};
