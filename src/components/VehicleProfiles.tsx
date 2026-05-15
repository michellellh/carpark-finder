import { useState } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { VehicleProfile } from '../types/vehicle';

interface VehicleProfilesProps {
  profiles: VehicleProfile[];
  onAddProfile: (profile: VehicleProfile) => void;
  onUpdateProfile: (index: number, profile: VehicleProfile) => void;
  onDeleteProfile: (index: number) => void;
}

const VehicleProfiles = ({ profiles, onAddProfile, onUpdateProfile, onDeleteProfile }: VehicleProfilesProps) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = () => {
    const profile = { name, height: parseFloat(height) };
    if (editingIndex !== null) {
      onUpdateProfile(editingIndex, profile);
      setEditingIndex(null);
    } else {
      onAddProfile(profile);
    }
    setName('');
    setHeight('');
  };

  const handleEdit = (index: number) => {
    const profile = profiles[index];
    setName(profile.name);
    setHeight(profile.height.toString());
    setEditingIndex(index);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Vehicle Profiles</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Vehicle Height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          type="number"
          inputProps={{ step: '0.1' }}
        />
        <Button onClick={handleSave} variant="contained">{editingIndex !== null ? 'Save' : 'Add'}</Button>
      </Box>
      <List>
        {profiles.map((profile, index) => (
          <div key={index}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDeleteProfile(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={profile.name} secondary={`Height: ${profile.height}m`} />
            </ListItem>
            {index < profiles.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
};

export default VehicleProfiles;