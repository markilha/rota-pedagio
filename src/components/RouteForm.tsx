import { useEffect, useMemo, useState } from "react";
import {
  fetchMunicipalities,
  MunicipalityOption,
  normalizeText,
} from "../services/ibge";
import Field from "./Field";

type RouteFormProps = {
  origin: string;
  destination: string;
  fuelConsumption: string;
  fuelPrice: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onFuelConsumptionChange: (value: string) => void;
  onFuelPriceChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  errors: {
    origin?: string;
    destination?: string;
    fuelConsumption?: string;
    fuelPrice?: string;
  };
};

const RouteForm = ({
  origin,
  destination,
  fuelConsumption,
  fuelPrice,
  onOriginChange,
  onDestinationChange,
  onFuelConsumptionChange,
  onFuelPriceChange,
  onSubmit,
  loading,
  errors,
}: RouteFormProps) => {
  const [municipalities, setMunicipalities] = useState<MunicipalityOption[]>(
    []
  );
  const [municipalitiesError, setMunicipalitiesError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let active = true;
    fetchMunicipalities()
      .then((data) => {
        if (!active) {
          return;
        }
        setMunicipalities(data);
        setMunicipalitiesError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setMunicipalities([]);
        setMunicipalitiesError("Falha ao carregar municipios.");
      });
    return () => {
      active = false;
    };
  }, []);

  const buildOptions = (query: string) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
      return municipalities.slice(0, 5);
    }
    return municipalities
      .filter((item) => item.search.includes(normalizedQuery))
      .slice(0, 5);
  };
  console.log(buildOptions("sao"));

  const originOptions = useMemo(
    () => buildOptions(origin),
    [origin, municipalities]
  );
  const destinationOptions = useMemo(
    () => buildOptions(destination),
    [destination, municipalities]
  );

  return (
    <div className="rounded-3xl border border-ink-700/60 bg-ink-800/70 p-6 shadow-glow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink-300">
            Planejador
          </p>
          <h2 className="text-2xl font-display text-ink-100">Calcule a rota</h2>
        </div>
        <span className="rounded-full border border-highlight-400/40 bg-highlight-500/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-highlight-400">
          Beta
        </span>
      </div>

      <div className="space-y-2">
        <Field
          id="origin"
          label="Origem"
          placeholder="Ex: Sao Paulo, SP"
          value={origin}
          onChange={onOriginChange}
          error={errors.origin}
          listId="municipalities-origin"
        />
        <datalist id="municipalities-origin">
          {originOptions.map((option) => (
            <option key={option.label} value={option.value} label={option.label} />
          ))}
        </datalist>
        <Field
          id="destination"
          label="Destino"
          placeholder="Ex: Rio de Janeiro, RJ"
          value={destination}
          onChange={onDestinationChange}
          error={errors.destination}
          listId="municipalities-destination"
        />
        <datalist id="municipalities-destination">
          {destinationOptions.map((option) => (
            <option key={option.label} value={option.value} label={option.label} />
          ))}
        </datalist>
        <Field
          id="fuelConsumption"
          label="Consumo (km/l)"
          placeholder="Ex: 12"
          value={fuelConsumption}
          onChange={onFuelConsumptionChange}
          error={errors.fuelConsumption}
          type="number"
          inputMode="decimal"
        />
        <Field
          id="fuelPrice"
          label="Preco do combustivel (R$/l)"
          placeholder="Ex: 5.89"
          value={fuelPrice}
          onChange={onFuelPriceChange}
          error={errors.fuelPrice}
          type="number"
          inputMode="decimal"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-highlight-500 px-2 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-ink-900 transition hover:bg-highlight-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Calculando..." : "Calcular rota"}
        </button>
        {municipalitiesError ? (
          <p className="text-xs text-amber-300">{municipalitiesError}</p>
        ) : null}
      </div>
    </div>
  );
};

export default RouteForm;
