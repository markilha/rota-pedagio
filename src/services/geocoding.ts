import { Place } from "../utils/types";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export const geocodeCity = async (query: string): Promise<Place> => {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "br");

  const response = await fetch(url.toString(), {
    headers: {
      "Accept-Language": "pt-BR",
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar a cidade.");
  }

  const data = (await response.json()) as NominatimResult[];

  if (data.length === 0) {
    throw new Error("Cidade nao encontrada.");
  }

  const result = data[0];

  return {
    name: result.display_name,
    location: {
      lat: Number(result.lat),
      lng: Number(result.lon),
    },
  };
};
