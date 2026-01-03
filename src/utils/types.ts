export type LatLng = {
  lat: number;
  lng: number;
};

export type Place = {
  name: string;
  location: LatLng;
};

export type RouteSummary = {
  distanceKm: number;
  durationMin: number;
  geometry: LatLng[];
};

export type TollSummary = {
  totalTolls: number;
  totalCost: number;
  averageCostPerToll: number;
};

export type FuelSummary = {
  liters: number;
  cost: number;
  pricePerLiter: number;
  consumptionKmPerLiter: number;
};

export type RouteResult = {
  origin: Place;
  destination: Place;
  route: RouteSummary;
  tolls: TollSummary;
  fuel: FuelSummary;
};
