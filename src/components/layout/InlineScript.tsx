"use client";

/**
 * Inline script that runs during HTML parsing on full page loads. On client
 * renders it becomes inert text/plain, which avoids React's script-tag warning.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
