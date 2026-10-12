/** Days per year used by SOUL's estimate (52 weeks × 7 days). */
export const DAYS_PER_YEAR = 364;
/** Annual hours for one full-time nurse (40 h × 52 weeks). */
export const FTE_HOURS = 2080;

export type CountingInputs = {
  units: number;
  countsPerDay: number;
  nursesPerCount: number;
  hoursPerCount: number;
  /** Expected reduction from automation, 0–100. */
  reductionPercent: number;
};

/** Defaults reproduce the profile figure: 13,104 hours ≈ 6.3 full-time nurses. */
export const DEFAULT_COUNTING: CountingInputs = {
  units: 1,
  countsPerDay: 3,
  nursesPerCount: 6,
  hoursPerCount: 2,
  reductionPercent: 70,
};

export function countingImpact(input: CountingInputs) {
  const annualHours =
    Math.max(0, input.units) *
    Math.max(0, input.countsPerDay) *
    Math.max(0, input.nursesPerCount) *
    Math.max(0, input.hoursPerCount) *
    DAYS_PER_YEAR;
  const fte = annualHours / FTE_HOURS;
  const reduction = Math.min(100, Math.max(0, input.reductionPercent)) / 100;
  return { annualHours, fte, reclaimedHours: annualHours * reduction };
}
