import { List, ListItem, ListItemText, Typography, IconButton, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Carpark } from '../types/carpark';

interface FavoritesProps {
  favorites: Carpark[];
  onRemoveFavorite: (carparkId: string) => void;
}

const Favorites = ({ favorites, onRemoveFavorite }: FavoritesProps) => {
  if (favorites.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center' }}>You have no favorite carparks yet.</Typography>;
  }

  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {favorites.map((carpark, index) => (
        <div key={carpark.carpark_id}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFavorite(carpark.carpark_id)}>
                <DeleteIcon />
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
                </Box>
              }
            />
          </ListItem>
          {index < favorites.length - 1 && <Divider variant="inset" component="li" />}
        </div>
      ))}
    </List>
  );
};

export default Favorites;