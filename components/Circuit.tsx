import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, LatLng, Region } from 'react-native-maps';

import Loading from './Loading';

export default function CircuitsMap() {
  const [circuits, setCircuits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);

  const fetchCircuits = async () => {
    try {
      const response = await fetch('http://api.jolpi.ca/ergast/f1/current/circuits.json');
      const data = await response.json();
      const circuitData = data.MRData.CircuitTable.Circuits;

      const circuitLocations = circuitData.map((circuit: any) => ({
        latitude: parseFloat(circuit.Location.lat),
        longitude: parseFloat(circuit.Location.long),
      }));

      const calculatedRegion = getBoundingRegion(circuitLocations);
      setMapRegion(calculatedRegion);
      setCircuits(circuitData);
    } catch (error) {
      console.log('Error while fetching circuit data', error);
    } finally {
      setLoading(false);
    }
  };

  const getBoundingRegion = (locations: LatLng[]): Region => {
    const latitudes = locations.map((loc) => loc.latitude);
    const longitudes = locations.map((loc) => loc.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latitudeDelta = maxLat - minLat + 5;
    const longitudeDelta = maxLng - minLng + 5;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta,
      longitudeDelta,
    };
  };

  useEffect(() => {
    fetchCircuits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!circuits.length) {
    return (
      <View>
        <Text className="font-semibold text-red-500">No circuit data found!</Text>
      </View>
    );
  }

  return (
    <MapView style={{ flex: 1 }} initialRegion={mapRegion}>
      {circuits.map((circuit) => {
        const { circuitId, circuitName, Location } = circuit;
        const { lat, long } = Location;

        return (
          <Marker
            key={circuitId}
            coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(long) }}
            title={circuitName}
            description={`${Location.locality}, ${Location.country}`}
          />
        );
      })}
    </MapView>
  );
}
