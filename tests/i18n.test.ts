import { describe, expect, it } from "vitest";
import { switchLocalePath } from "../src/i18n/config";
import ar from "../src/i18n/dictionaries/ar";
import en from "../src/i18n/dictionaries/en";

/** Collects every leaf path with its value so both languages can be compared. */
function leaves(obj: unknown, prefix = ""): Map<string, unknown> {
  const out = new Map<string, unknown>();
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      for (const [p, leaf] of leaves(v, prefix ? `${prefix}.${k}` : k)) out.set(p, leaf);
    }
  } else {
    out.set(prefix, obj);
  }
  return out;
}

describe("dictionaries", () => {
  const a = leaves(ar);
  const e = leaves(en);

  it("have exactly the same keys and array lengths", () => {
    expect([...e.keys()].sort()).toEqual([...a.keys()].sort());
  });

  it("only leave a string empty when it is empty in both languages", () => {
    for (const [key, value] of a) {
      if (typeof value !== "string") continue;
      expect(value === "", key).toBe(e.get(key) === "");
    }
  });
});

describe("switchLocalePath", () => {
  it("swaps the locale segment and keeps the rest of the path", () => {
    expect(switchLocalePath("/ar", "en")).toBe("/en");
    expect(switchLocalePath("/ar/projects/neomove", "en")).toBe("/en/projects/neomove");
    expect(switchLocalePath("/en/projects/cardio-k", "ar")).toBe("/ar/projects/cardio-k");
  });

  it("prefixes paths that have no locale", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/projects/omnisense", "ar")).toBe("/ar/projects/omnisense");
  });
});
