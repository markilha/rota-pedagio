import { LatLng, RouteSummary } from "../utils/types";

type OrsFeatureRoute = {
  geometry: {
    coordinates: [number, number][];
  };
  properties: {
    summary: {
      distance: number;
      duration: number;
    };
  };
};

type OrsRoutesRoute = {
  geometry:
    | {
        coordinates?: [number, number][];
        encoded?: string;
      }
    | string;
  summary: {
    distance: number;
    duration: number;
  };
};

type OrsRouteResponse = {
  features?: OrsFeatureRoute[];
  routes?: OrsRoutesRoute[];
};

const ORS_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car?format=geojson";

const decodePolyline = (encoded: string, precision = 5): LatLng[] => {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: LatLng[] = [];
  const factor = 10 ** precision;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push({ lat: lat / factor, lng: lng / factor });
  }

  return coordinates;
};

export const getRoute = async (
  origin: LatLng,
  destination: LatLng
): Promise<RouteSummary> => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  if (!apiKey) {
    throw new Error("Defina a VITE_ORS_API_KEY no arquivo .env.");
  }

  const response = await fetch(ORS_URL, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    }),
  });

  const payload = (await response.json()) as OrsRouteResponse & {
    error?: {
      message?: string;
    };
    message?: string;
  };

  const apiMessage = payload.error?.message ?? payload.message;

  if (!response.ok) {
    throw new Error(apiMessage ?? "Falha ao calcular a rota.");
  }

  if (apiMessage && !payload.features) {
    throw new Error(apiMessage);
  }

  const featureRoute = payload.features?.[0];
  const routesRoute = payload.routes?.[0];

  if (!featureRoute && !routesRoute) {
    throw new Error("Rota indisponivel para esse trajeto.");
  }

  const routeDistance =
    featureRoute?.properties.summary.distance ?? routesRoute!.summary.distance;
  const routeDuration =
    featureRoute?.properties.summary.duration ?? routesRoute!.summary.duration;
  const routesGeometry =
    typeof routesRoute?.geometry === "string" ? routesRoute.geometry : null;
  const coordinates =
    featureRoute?.geometry.coordinates ??
    (routesRoute && typeof routesRoute.geometry !== "string"
      ? routesRoute.geometry.coordinates
      : null) ??
    (routesRoute &&
    typeof routesRoute.geometry !== "string" &&
    routesRoute.geometry.encoded
      ? decodePolyline(routesRoute.geometry.encoded)
      : null) ??
    (routesGeometry ? decodePolyline(routesGeometry) : null);

  if (!coordinates) {
    throw new Error("Rota indisponivel para esse trajeto.");
  }

  const geometry = Array.isArray(coordinates)
    ? coordinates.map((point) =>
        Array.isArray(point) ? { lat: point[1], lng: point[0] } : point
      )
    : [];

  if (geometry.length === 0) {
    throw new Error("Rota indisponivel para esse trajeto.");
  }

  return {
    distanceKm: routeDistance / 1000,
    durationMin: routeDuration / 60,
    geometry,
  };
};
