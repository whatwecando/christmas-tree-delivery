import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { database } from '../config/firebase';
import { ref, update, get } from 'firebase/database';

export const UpdateTreeStatus = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('pending');
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTree = async () => {
      if (!treeId) return;
      
      try {
        const treeRef = ref(database, `trees/${treeId}`);
        const snapshot = await get(treeRef);
        const treeData = snapshot.val();
        
        if (treeData) {
          setStatus(treeData.pickup_status || 'pending');
          setPickupDate(treeData.pickup_date ? new Date(treeData.pickup_date) : new Date());
          setNotes(treeData.pickup_notes || '');
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchTree();
  }, [treeId]);

  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: string,
  ) => {
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };

  const handleSubmit = async () => {
    if (!treeId) return;

    try {
      const treeRef = ref(database, `trees/${treeId}`);
      
      await update(treeRef, {
        pickup_status: status,
        pickup_date: pickupDate ? format(pickupDate, 'yyyy-MM-dd') : null,
        pickup_notes: notes,
        updated_at: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Mise à jour du statut
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Statut
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={status}
          exclusive
          onChange={handleStatusChange}
          fullWidth
        >
          <ToggleButton value="pending">En attente</ToggleButton>
          <ToggleButton value="scheduled">Planifié</ToggleButton>
          <ToggleButton value="completed">Récupéré</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ my: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <DatePicker
            label="Date de récupération"
            value={pickupDate}
            onChange={(newValue) => setPickupDate(newValue)}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ my: 3 }}>
        <TextField
          label="Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Mettre à jour
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          fullWidth
        >
          Annuler
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Mise à jour effectuée avec succès
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
