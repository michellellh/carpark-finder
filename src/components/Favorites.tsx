import { List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
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
    <List>
      {favorites.map((carpark) => (
        <ListItem
          key={carpark.carpark_id}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFavorite(carpark.carpark_id)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={carpark.address}
            secondary={`Available Lots: ${carpark.available_lots} / ${carpark.total_lots}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Favorites;