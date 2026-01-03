import { TollSummary } from "../utils/types";

type TollRules = {
  kmPerToll: number;
  baseCost: number;
  maxCost: number;
};

// Rules-based estimator to allow swapping for a real toll provider later.
const defaultRules: TollRules = {
  kmPerToll: 95,
  baseCost: 9.5,
  maxCost: 24,
};

export const estimateTolls = (
  distanceKm: number,
  rules: TollRules = defaultRules
): TollSummary => {
  const totalTolls = Math.max(0, Math.floor(distanceKm / rules.kmPerToll));
  const averageCostPerToll = Math.min(
    rules.maxCost,
    rules.baseCost + (distanceKm / 600) * 4
  );
  const totalCost = totalTolls * averageCostPerToll;

  return {
    totalTolls,
    totalCost,
    averageCostPerToll,
  };
};
