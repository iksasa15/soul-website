import { Fragment, type ReactNode } from "react";

const HYPHENATED = /([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/g;

/**
 * Keeps hyphenated Latin names such as "Cardio-K" on one line and in one
 * direction, so they don't split at the hyphen inside Arabic text.
 */
export function nb(text: string): ReactNode {
  const parts = text.split(HYPHENATED);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} className="whitespace-nowrap">
        {part}
      </bdi>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
