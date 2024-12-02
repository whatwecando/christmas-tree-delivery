import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TreeOrder, DeliveryStatus } from '../types/order';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';

const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.PENDING:
      return 'warning';
    case DeliveryStatus.CONFIRMED:
      return 'info';
    case DeliveryStatus.IN_PROGRESS:
      return 'primary';
    case DeliveryStatus.DELIVERED:
      return 'success';
    case DeliveryStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

export const TreeList = () => {
  const [orders, setOrders] = useState<TreeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([id, order]) => ({
          id,
          ...order as Omit<TreeOrder, 'id'>
        }));
        setOrders(ordersList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {orders.map((order) => (
        <Grid item xs={12} sm={6} md={4} key={order.id}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="h6" gutterBottom>
                  {order.customer.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/update/${order.id}`)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {order.customer.address}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Tél: {order.customer.phone}
              </Typography>
              <Box mt={2}>
                <Chip
                  label={order.deliveryStatus}
                  color={getStatusColor(order.deliveryStatus)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
