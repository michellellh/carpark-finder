import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Carpark } from '../types/carpark';
import { useEffect, useRef } from 'react';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface CarparkMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
}

const CarparkMap = ({ carparks, selectedCarpark }: CarparkMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      if (selectedCarpark) {
        mapRef.current.setView([selectedCarpark.latitude, selectedCarpark.longitude], 15);
      } else if (carparks.length > 0) {
        const bounds = L.latLngBounds(carparks.map(p => [p.latitude, p.longitude]));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [carparks, selectedCarpark]);

  return (
    <MapContainer ref={mapRef} center={[1.3521, 103.8198]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {carparks.map(carpark => (
        <Marker key={carpark.carpark_id} position={[carpark.latitude, carpark.longitude]}>
          <Popup>
            {carpark.address}
          </Popup>
        </Marker>
      ))}

      {selectedCarpark && (
        <Marker position={[selectedCarpark.latitude, selectedCarpark.longitude]} icon={L.icon({ ...L.Icon.Default.prototype.options, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png' })}>
          <Popup>
            Selected: {selectedCarpark.address}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default CarparkMap;