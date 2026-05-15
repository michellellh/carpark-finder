import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  CircularProgress,
  Alert,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import Papa from 'papaparse';
import CarparkMap from '../components/CarparkMap';
import CarparkList from '../components/CarparkList';
import Favorites from '../components/Favorites';
import VehicleProfiles from '../components/VehicleProfiles';
import { convertSvy21ToWgs84 } from '../utils/location';
import type { Carpark } from '../types/carpark';
import type { VehicleProfile } from '../types/vehicle';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carparks, setCarparks] = useState<Carpark[]>([]);
  const [destination, setDestination] = useState('');
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem('carpark_favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [vehicleProfiles, setVehicleProfiles] = useState<VehicleProfile[]>(() => {
    const storedProfiles = localStorage.getItem('vehicle_profiles');
    return storedProfiles ? JSON.parse(storedProfiles) : [];
  });
  const [vehicleHeight, setVehicleHeight] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    localStorage.setItem('carpark_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vehicle_profiles', JSON.stringify(vehicleProfiles));
  }, [vehicleProfiles]);

  const handleToggleFavorite = (carparkId: string) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(carparkId)
        ? prevFavorites.filter(id => id !== carparkId)
        : [...prevFavorites, carparkId]
    );
  };

  const handleCarparkSelect = (carpark: Carpark) => {
    setSelectedCarpark(carpark);
  };

  const handleSearch = () => {
    setHasSearched(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const staticDataResponse = await fetch('/Carpark_gantryheight.csv');
        if (!staticDataResponse.ok) {
          throw new Error('Failed to fetch carpark data.');
        }
        const staticCsv = await staticDataResponse.text();
        Papa.parse(staticCsv, {
          header: true,
          complete: (results: Papa.ParseResult<Record<string, string>>) => {
            const staticCarparks = results.data;
            const mergedCarparks = staticCarparks.map(staticCarpark => {
              if (!staticCarpark.CAR_PARK_NO || !staticCarpark.X_COORD || !staticCarpark.Y_COORD) {
                return null;
              }
              const { latitude, longitude } = convertSvy21ToWgs84(parseFloat(staticCarpark.X_COORD), parseFloat(staticCarpark.Y_COORD));
              return {
                carpark_id: staticCarpark.CAR_PARK_NO,
                address: staticCarpark.ADDRESS,
                latitude,
                longitude,
                gantry_height: parseFloat(staticCarpark.GANTRY_HEIGHT) || 0,
                car_park_type: staticCarpark.CAR_PARK_TYPE,
                price: parseFloat((Math.random() * 4 + 1).toFixed(2)), // Simulated price
              };
            }).filter((p): p is Carpark => p !== null);
            setCarparks(mergedCarparks);
            setLoading(false);
          },
          error: (err: Papa.ParseError) => {
            setError('Error parsing CSV data.');
            setLoading(false);
            console.error(err);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredCarparks = useMemo(() => {
    if (!hasSearched) {
      return [];
    }

    const height = parseFloat(vehicleHeight);
    const hasHeightFilter = !isNaN(height) && height > 0;
    const hasDestinationFilter = destination.trim() !== '';

    if (!hasHeightFilter && !hasDestinationFilter) {
      return [];
    }

    let filtered = carparks;

    if (hasHeightFilter) {
      filtered = filtered.filter(carpark => carpark.gantry_height >= height);
    }

    if (hasDestinationFilter) {
      filtered = filtered.filter(carpark =>
        carpark.address.toLowerCase().includes(destination.toLowerCase())
      );
    }

    return filtered;
  }, [carparks, vehicleHeight, destination, hasSearched]);

  const favoriteCarparks = useMemo(() => {
    return carparks.filter(carpark => favorites.includes(carpark.carpark_id));
  }, [carparks, favorites]);

  const handleAddProfile = (profile: VehicleProfile) => {
    setVehicleProfiles(prevProfiles => [...prevProfiles, profile]);
  };

  const handleUpdateProfile = (index: number, profile: VehicleProfile) => {
    setVehicleProfiles(prevProfiles => {
      const newProfiles = [...prevProfiles];
      newProfiles[index] = profile;
      return newProfiles;
    });
  };

  const handleDeleteProfile = (index: number) => {
    setVehicleProfiles(prevProfiles => {
      const newProfiles = [...prevProfiles];
      newProfiles.splice(index, 1);
      return newProfiles;
    });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Singapore Carpark Finder</Typography>
      </Box>
      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Search" />
        <Tab label="Favorites" />
        <Tab label="Vehicles" />
      </Tabs>

      {currentTab === 0 && (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Vehicle Height (m)"
              value={vehicleHeight}
              onChange={(e) => setVehicleHeight(e.target.value)}
              type="number"
              InputProps={{ inputProps: { step: '0.1' } }}
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Destination (e.g., Blk 133 Woodlands)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 250 } }}
            />
            <Button variant="contained" onClick={handleSearch} sx={{ minWidth: 120 }}>
              Search
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: { md: 2 }, height: '80vh' }}>
              {loading && carparks.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <CarparkMap carparks={filteredCarparks} selectedCarpark={selectedCarpark} />
              )}
            </Box>
            <Box sx={{ flex: { md: 1 }, height: '80vh', overflow: 'auto' }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <CarparkList
                carparks={filteredCarparks}
                loading={loading && carparks.length === 0}
                onCarparkSelect={handleCarparkSelect}
                selectedCarpark={selectedCarpark}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                hasSearched={hasSearched}
              />
            </Box>
          </Box>
        </>
      )}

      {currentTab === 1 && (
        <Favorites favorites={favoriteCarparks} onRemoveFavorite={handleToggleFavorite} />
      )}

      {currentTab === 2 && (
        <VehicleProfiles
          profiles={vehicleProfiles}
          onAddProfile={handleAddProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}
    </Container>
  );
};

export default Home;