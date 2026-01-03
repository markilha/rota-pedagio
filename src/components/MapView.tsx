import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { LatLng } from "../utils/types";
import LoadingOverlay from "./LoadingOverlay";

type MapViewProps = {
  origin?: LatLng;
  destination?: LatLng;
  route?: LatLng[];
  loading: boolean;
};

const BRAZIL_CENTER: LatLng = { lat: -14.235, lng: -51.9253 };

type FitBoundsProps = {
  origin?: LatLng;
  destination?: LatLng;
  route?: LatLng[];
};

const FitBounds = ({ origin, destination, route }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) {
      return;
    }
    const bounds = route && route.length > 0 ? route : [origin, destination];
    map.fitBounds(bounds.map((point) => [point.lat, point.lng]), {
      padding: [40, 40],
    });
  }, [map, origin, destination, route]);

  return null;
};

const MapResize = () => {
  const map = useMap();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);
    return () => {
      window.clearTimeout(handle);
    };
  }, [map]);

  return null;
};

const MapView = ({ origin, destination, route, loading }: MapViewProps) => {
  return (
    <div className="relative h-screen overflow-hidden rounded-3xl border border-ink-700/60 shadow-glow">
      <MapContainer
        center={[BRAZIL_CENTER.lat, BRAZIL_CENTER.lng]}
        zoom={4}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {origin ? <Marker position={[origin.lat, origin.lng]} /> : null}
        {destination ? <Marker position={[destination.lat, destination.lng]} /> : null}
        {route && route.length > 0 ? (
          <Polyline
            positions={route.map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#f59f0b", weight: 4 }}
          />
        ) : null}
        <FitBounds origin={origin} destination={destination} route={route} loading={loading} />
        <MapResize />
      </MapContainer>
      <LoadingOverlay visible={loading} label="Tracando rota" />
    </div>
  );
};

export default MapView;
