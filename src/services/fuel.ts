import { FuelSummary } from "../utils/types";

type FuelRules = {
  consumptionKmPerLiter: number;
  pricePerLiter: number;
};

export const estimateFuel = (
  distanceKm: number,
  rules: FuelRules
): FuelSummary => {
  const safeConsumption = Math.max(0.1, rules.consumptionKmPerLiter);
  const safePrice = Math.max(0, rules.pricePerLiter);
  const liters = distanceKm / safeConsumption;
  const cost = liters * safePrice;

  return {
    liters,
    cost,
    pricePerLiter: safePrice,
    consumptionKmPerLiter: safeConsumption,
  };
};
