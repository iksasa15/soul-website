"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setDone(true);
          window.setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-sky hover:text-accent"
      aria-live="polite"
    >
      {done ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
      {done ? copied : copy}
    </button>
  );
}
