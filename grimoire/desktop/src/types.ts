export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'running' | 'success' | 'error';
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface MemoryItem {
  id: string;
  key: string;
  summary: string;
  content: string;
  category: 'user_preference' | 'project_fact' | 'system_rule' | 'context';
  timestamp: string;
}

export interface LicenseStatus {
  isLicensed: boolean;
  hardwareId: string;
  licenseKey?: string;
  tier: 'free_trial' | 'pro_lifetime';
  expirationDays?: number;
}

export interface AppSettings {
  executionMode: 'local' | 'cloud' | 'hybrid';
  localModelName: string;
  lowResourceMode: boolean;
  autoSummary: boolean;
  cloudApiKey?: string;
  modelPath?: string;
  serverUrl?: string;
}
