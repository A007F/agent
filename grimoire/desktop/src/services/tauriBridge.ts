import { invoke } from '@tauri-apps/api/core';
import { Message, MemoryItem, LicenseStatus, AppSettings } from '../types';

// Check if running inside Tauri runtime
export const isTauriAvailable = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Send user prompt to local AI engine via Rust
export async function sendPromptToModel(
  prompt: string,
  onToken: (token: string) => void,
  settings: AppSettings
): Promise<string> {
  if (isTauriAvailable()) {
    try {
      const response = await invoke<string>('generate_response', {
        prompt,
        settings,
      });
      onToken(response);
      return response;
    } catch (err) {
      console.error('Tauri invoke error:', err);
      throw err;
    }
  }

  // Web Fallback Mock Engine for Development/Testing
  return new Promise((resolve) => {
    const mockResponses = [
      `أهلاً بك! أنا **Grimoire Agent** - مساعدك الذكي المحلي.\n\nلقد استلمت سؤالك: "${prompt}".\n\nإليك مثال على كود بلغة Rust لاستدعاء الأداة محلياً:\n\n\`\`\`rust\nfn execute_tool(name: &str, args: &str) -> Result<String, String> {\n    println!("Executing local tool: {} with args: {}", name, args);\n    Ok("Tool execution successful!".to_string())\n}\n\`\`\`\n\nهل هناك ملف تريد أن أقوم بفيزيائه أو تفحصه؟`,
    ];
    const fullText = mockResponses[0];
    let currentLen = 0;

    const interval = setInterval(() => {
      currentLen += 4;
      if (currentLen >= fullText.length) {
        clearInterval(interval);
        onToken(fullText);
        resolve(fullText);
      } else {
        onToken(fullText.slice(0, currentLen));
      }
    }, 30);
  });
}

// Fetch conversation history from SQLite
export async function getConversationHistory(): Promise<Message[]> {
  if (isTauriAvailable()) {
    return await invoke<Message[]>('get_history');
  }
  return [];
}

// Save message to SQLite
export async function saveMessage(msg: Message): Promise<void> {
  if (isTauriAvailable()) {
    await invoke('save_message', { message: msg });
  }
}

// Get memory items
export async function getMemories(): Promise<MemoryItem[]> {
  if (isTauriAvailable()) {
    return await invoke<MemoryItem[]>('get_memories');
  }
  return [
    {
      id: 'mem-1',
      key: 'لغة المستخدم',
      summary: 'يفضل التواصل باللغة العربية مع التركيز على جودة الكود البرمجي.',
      content: 'يفضل التفاعل باللغة العربية وبناء تطبيقات عالي الأداء باستخدام Rust و React.',
      category: 'user_preference',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'mem-2',
      key: 'نموذج التشغيل',
      summary: 'يعمل محلياً باستخدام Qwen3-7B Quantized INT4.',
      content: 'تم تكوين النموذج للعمل أوفلاين مع تحكم تام بالبيانات.',
      category: 'system_rule',
      timestamp: new Date().toISOString(),
    },
  ];
}

// Scan workspace directory
export async function scanWorkspace(): Promise<string> {
  if (isTauriAvailable()) {
    return await invoke<string>('scan_workspace');
  }
  return 'تم مسح مجلد المشروع الحالي بنجاح: تم العثور على 42 ملفاً برمجياً.';
}

// Check License & Hardware ID
export async function checkLicenseStatus(): Promise<LicenseStatus> {
  if (isTauriAvailable()) {
    return await invoke<LicenseStatus>('check_license');
  }
  return {
    isLicensed: true,
    hardwareId: 'HW-8F39A2-LOCAL-DEV',
    tier: 'pro_lifetime',
  };
}

// Verify License Key
export async function verifyLicenseKey(key: string): Promise<boolean> {
  if (isTauriAvailable()) {
    return await invoke<boolean>('verify_license', { licenseKey: key });
  }
  return key.trim().length > 8;
}

// Reset Memory
export async function clearAllMemory(): Promise<void> {
  if (isTauriAvailable()) {
    await invoke('clear_memory');
  }
}
