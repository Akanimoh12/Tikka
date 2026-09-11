"use client";

import { useState } from "react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative border-2 border-[var(--of-ink)] bg-[var(--of-ink)] text-[var(--of-paper)]">
      <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[0.72rem] font-bold text-[var(--of-paper)]/60">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="of-pill border-2 border-[var(--of-paper)]/40 bg-transparent px-3 py-1 text-[0.72rem] font-bold text-[var(--of-paper)] hover:bg-[var(--of-paper)]/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-[family-name:var(--font-mono)] text-[0.82rem] leading-[1.6]">{code}</code>
      </pre>
    </div>
  );
}
