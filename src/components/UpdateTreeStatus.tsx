import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ref, get, update } from 'firebase/database';
import { db } from '../config/firebase';
import { TreeOrder, DeliveryStatus } from '../types/order';

export const UpdateTreeStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<TreeOrder | null>(null);
  const [status, setStatus] = useState<DeliveryStatus>(DeliveryStatus.PENDING);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const orderRef = ref(db, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          setOrder({ id: orderId, ...orderData });
          setStatus(orderData.deliveryStatus);
          setNotes(orderData.notes || '');
        } else {
          setError('Commande non trouvée');
        }
      } catch (err) {
        setError('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleSubmit = async () => {
    if (!orderId || !order) return;

    try {
      const orderRef = ref(db, `orders/${orderId}`);
      const now = new Date().getTime();
      const historyEntry = {
        timestamp: now,
        action: 'Mise à jour du statut',
        previousStatus: order.deliveryStatus,
        newStatus: status,
      };

      await update(orderRef, {
        deliveryStatus: status,
        notes,
        history: [...(order.history || []), historyEntry],
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
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

  if (!order) {
    return <Alert severity="error">Commande non trouvée</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Mise à jour de la commande
        </Typography>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Client: {order.customer.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {order.customer.address}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Tél: {order.customer.phone}
          </Typography>
        </Box>

        <Box mt={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Statut de livraison</InputLabel>
            <Select
              value={status}
              label="Statut de livraison"
              onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
            >
              {Object.values(DeliveryStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Mise à jour réussie
          </Alert>
        )}

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Mettre à jour
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Retour
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
