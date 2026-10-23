import React, { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-grimoire-700 bg-grimoire-950 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-grimoire-900 border-b border-grimoire-800 text-xs text-gray-300">
        <span className="flex items-center gap-1.5 font-semibold text-amber-400">
          <Code className="w-3.5 h-3.5" />
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-grimoire-800 hover:bg-grimoire-700 px-2 py-1 rounded text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ الكود</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-gray-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};
