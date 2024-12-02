import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

export const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <LocalFloristIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Livraison de Sapins
        </Typography>
        <Button
          color="inherit"
          component={RouterLink}
          to="/"
        >
          Liste des commandes
        </Button>
      </Toolbar>
    </AppBar>
  );
};
