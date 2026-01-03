import {
  formatCurrency,
  formatKm,
  formatLiters,
  formatMinutes,
} from "../utils/format";
import { RouteResult } from "../utils/types";
import StatsCard from "./StatsCard";

type StatsPanelProps = {
  result: RouteResult | null;
  loading: boolean;
};

const StatsPanel = ({ result, loading }: StatsPanelProps) => {
  return (
    <div className="rounded-3xl border border-ink-700/60 bg-ink-800/60 p-2 shadow-glow">
      <h3 className="text-sm font-display text-ink-100">Resumo da viagem</h3>

      <div className="mt-6 grid gap-4">
        <StatsCard
          title="Distancia"
          value={
            loading || !result ? "--" : `${formatKm(result.route.distanceKm)} km`
          }
          accentClassName="text-emerald-400"
        />
        <StatsCard
          title="Tempo"
          value={loading || !result ? "--" : formatMinutes(result.route.durationMin)}
          accentClassName="text-highlight-400"
        />
        <StatsCard
          title="Pedagios"
          value={loading || !result ? "--" : formatCurrency(result.tolls.totalCost)}
          helper={
            loading || !result
              ? "Aguardando rota"
              : `${result.tolls.totalTolls} pracas estimadas | medio ${formatCurrency(
                  result.tolls.averageCostPerToll
                )}`
          }
        />
        <StatsCard
          title="Combustivel"
          value={loading || !result ? "--" : formatCurrency(result.fuel.cost)}
          helper={
            loading || !result
              ? "Aguardando rota"
              : `${formatLiters(result.fuel.liters)} L | ${formatCurrency(
                  result.fuel.pricePerLiter
                )}/L`
          }
        />
      </div>
    </div>
  );
};

export default StatsPanel;
