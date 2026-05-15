import { useState } from 'react';
import { List, ListItem, ListItemText, Typography, IconButton, TextField, Button, Box } from '@mui/material';
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
  const [height, setHeight] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = () => {
    if (name && height) {
      const heightValue = parseFloat(height);
      if (!isNaN(heightValue)) {
        if (editingIndex !== null) {
          onUpdateProfile(editingIndex, { name, height: heightValue });
        } else {
          onAddProfile({ name, height: heightValue });
        }
        setName('');
        setHeight('');
        setEditingIndex(null);
      }
    }
  };

  const handleEdit = (index: number) => {
    const profile = profiles[index];
    setName(profile.name);
    setHeight(String(profile.height));
    setEditingIndex(index);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Manage Vehicle Profiles</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Vehicle Height in meters, with 1 decimal point"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          InputProps={{ inputProps: { step: '0.1' } }}
        />
        <Button onClick={handleSave}>{editingIndex !== null ? 'Update' : 'Add'}</Button>
      </Box>
      <List>
        {profiles.map((profile, index) => (
          <ListItem
            key={index}
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
        ))}
      </List>
    </Box>
  );
};

export default VehicleProfiles;