import { List, ListItemButton, ListItemText, Typography, CircularProgress, Box, Divider, IconButton } from '@mui/material';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import type { Carpark } from '../types/carpark';

interface CarparkListProps {
  carparks: Carpark[];
  loading: boolean;
  onCarparkSelect: (carpark: Carpark) => void;
  selectedCarpark: Carpark | null;
  favorites: string[];
  onToggleFavorite: (carparkId: string) => void;
  hasSearched: boolean;
}

const CarparkList = ({ carparks, loading, onCarparkSelect, selectedCarpark, favorites, onToggleFavorite, hasSearched }: CarparkListProps) => {
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (!hasSearched) {
    return <Typography sx={{ p: 2, textAlign: 'center' }}>Please enter search criteria and click Search.</Typography>;
  }

  if (carparks.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center' }}>No carparks match your criteria.</Typography>;
  }

  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {carparks.map((carpark, index) => (
        <div key={carpark.carpark_id}>
          <ListItemButton
            alignItems="flex-start"
            selected={selectedCarpark?.carpark_id === carpark.carpark_id}
            onClick={() => onCarparkSelect(carpark)}
            secondaryAction={
              <IconButton edge="end" aria-label="favorite" onClick={() => onToggleFavorite(carpark.carpark_id)}>
                {favorites.includes(carpark.carpark_id) ? <Star /> : <StarBorder />}
              </IconButton>
            }
          >
            <ListItemText
              primary={carpark.address}
              secondary={
                <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography component="span" variant="body2" color="text.secondary">
                    Gantry: {carpark.gantry_height}m | Type: {carpark.car_park_type}
                  </Typography>
                   <Typography component="span" variant="body2" color="text.secondary">
                    Price: ${carpark.price.toFixed(2)} / hr
                  </Typography>
                </Box>
              }
            />
          </ListItemButton>
          {index < carparks.length - 1 && <Divider variant="inset" component="li" />}
        </div>
      ))}
    </List>
  );
};

export default CarparkList;