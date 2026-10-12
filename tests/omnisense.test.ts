import { describe, expect, it } from "vitest";
import { countingImpact, DEFAULT_COUNTING } from "../src/lib/omnisense";

describe("countingImpact", () => {
  it("reproduces the company-profile figures with the default inputs", () => {
    const r = countingImpact(DEFAULT_COUNTING);
    expect(r.annualHours).toBe(13104);
    expect(r.fte).toBeCloseTo(6.3, 1);
  });

  it("scales linearly with the number of units", () => {
    expect(countingImpact({ ...DEFAULT_COUNTING, units: 3 }).annualHours).toBe(13104 * 3);
  });

  it("applies the reduction percentage and clamps it to 0–100", () => {
    expect(countingImpact({ ...DEFAULT_COUNTING, reductionPercent: 50 }).reclaimedHours).toBe(6552);
    expect(countingImpact({ ...DEFAULT_COUNTING, reductionPercent: 150 }).reclaimedHours).toBe(13104);
    expect(countingImpact({ ...DEFAULT_COUNTING, reductionPercent: -10 }).reclaimedHours).toBe(0);
  });

  it("never returns negative hours", () => {
    expect(countingImpact({ ...DEFAULT_COUNTING, units: -2 }).annualHours).toBe(0);
  });
});
