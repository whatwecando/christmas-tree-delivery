import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Straighten as StraightenIcon,
} from '@mui/icons-material';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

interface Tree {
  id: string;
  customer_name: string;
  customer_phone: string;
  size: string;
  pickup_status: string;
  pickup_date: string | null;
}

export const TreeList = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const treesRef = ref(database, 'trees');

    onValue(treesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const treesList = Object.entries(data).map(([id, tree]: [string, any]) => ({
            id,
            ...tree,
          }));
          setTrees(treesList);
        } else {
          setTrees([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    }, (error) => {
      setError('Erreur de connexion à la base de données');
      setLoading(false);
    });

    return () => off(treesRef);
  }, []);

  const getStatusColor = (status: string): { color: string, background: string } => {
    switch (status) {
      case 'completed':
        return { color: '#1B5E20', background: '#E8F5E9' };
      case 'scheduled':
        return { color: '#0D47A1', background: '#E3F2FD' };
      default:
        return { color: '#E65100', background: '#FFF3E0' };
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Récupéré';
      case 'scheduled':
        return 'Planifié';
      default:
        return 'En attente';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {trees.map((tree) => (
        <Grid item xs={12} sm={6} md={4} key={tree.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              onClick={() => navigate(`/update/${tree.id}`)}
            >
              <EditIcon />
            </IconButton>

            <CardContent>
              <Typography variant="h6" gutterBottom>
                {tree.customer_name}
              </Typography>

              <Chip
                label={getStatusLabel(tree.pickup_status)}
                sx={{
                  backgroundColor: getStatusColor(tree.pickup_status).background,
                  color: getStatusColor(tree.pickup_status).color,
                  marginBottom: 2,
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <StraightenIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Taille: {tree.size}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {tree.customer_phone}
                </Typography>
              </Box>

              {tree.pickup_date && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(tree.pickup_date), 'dd MMMM yyyy', { locale: fr })}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
