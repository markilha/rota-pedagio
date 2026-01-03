import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import RouteForm from "../components/RouteForm";
import StatsPanel from "../components/StatsPanel";
import { estimateFuel } from "../services/fuel";
import { geocodeCity } from "../services/geocoding";
import { getRoute } from "../services/routing";
import { estimateTolls } from "../services/toll";
import { useDebounce } from "../utils/debounce";
import { RouteResult } from "../utils/types";

type FormErrors = {
  origin?: string;
  destination?: string;
  fuelConsumption?: string;
  fuelPrice?: string;
};

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("12");
  const [fuelPrice, setFuelPrice] = useState("5.89");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);

  const debouncedOrigin = useDebounce(origin, 400);
  const debouncedDestination = useDebounce(destination, 400);

  // Debounce-driven cleanup to avoid flashing validation while typing.
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      origin: debouncedOrigin.trim().length > 0 ? undefined : prev.origin,
    }));
  }, [debouncedOrigin]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      destination:
        debouncedDestination.trim().length > 0 ? undefined : prev.destination,
    }));
  }, [debouncedDestination]);

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!origin.trim()) {
      nextErrors.origin = "Informe a cidade de origem.";
    }
    if (!destination.trim()) {
      nextErrors.destination = "Informe a cidade de destino.";
    }
    const parsedConsumption = Number(fuelConsumption.trim().replace(",", "."));
    const parsedPrice = Number(fuelPrice.trim().replace(",", "."));
    if (!Number.isFinite(parsedConsumption) || parsedConsumption <= 0) {
      nextErrors.fuelConsumption = "Informe um consumo valido.";
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      nextErrors.fuelPrice = "Informe um preco valido.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const [originPlace, destinationPlace] = await Promise.all([
        geocodeCity(origin),
        geocodeCity(destination),
      ]);

      const route = await getRoute(
        originPlace.location,
        destinationPlace.location
      );

      const tolls = estimateTolls(route.distanceKm);
      const fuel = estimateFuel(route.distanceKm, {
        consumptionKmPerLiter: Number(fuelConsumption.replace(",", ".")),
        pricePerLiter: Number(fuelPrice.replace(",", ".")),
      });

      setResult({
        origin: originPlace,
        destination: destinationPlace,
        route,
        tolls,
        fuel,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel calcular a rota.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.08),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(245,159,11,0.12),_transparent_35%),linear-gradient(180deg,_rgba(11,15,20,1)_0%,_rgba(18,24,38,1)_100%)] px-4 py-10">
      <div className="mx-auto flex w-full flex-col gap-8">
        <header className="grid gap-2 rounded-3xl border border-ink-700/60 bg-ink-800/50 p-4 shadow-glow">
          <p className="text-xs uppercase tracking-[0.35em] text-highlight-400">
            Planejamento inteligente
          </p>
          <h1 className="text-2xl font-display text-ink-100 md:text-xl">
            Rotas com pedagio estimado em segundos
          </h1>
          <p className="max-w-2xl text-sm text-ink-300">
            Consulte a distancia, o tempo de viagem e uma previsao de pedagios e
            combustivel para rotas entre cidades brasileiras.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <MapView
            origin={result?.origin.location}
            destination={result?.destination.location}
            route={result?.route.geometry}
            loading={loading}
          />
          <div className="space-y-6 lg:h-screen lg:overflow-y-auto">
            <RouteForm
              origin={origin}
              destination={destination}
              fuelConsumption={fuelConsumption}
              fuelPrice={fuelPrice}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onFuelConsumptionChange={setFuelConsumption}
              onFuelPriceChange={setFuelPrice}
              onSubmit={handleSubmit}
              loading={loading}
              errors={errors}
            />
            {message ? (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
                {message}
              </div>
            ) : null}
            <StatsPanel result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
