import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { TreeList } from './src/components/TreeList';
import { UpdateTreeStatus } from './src/components/UpdateTreeStatus';

export default function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sapins de Saint-Roch
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<TreeList />} />
          <Route path="/update/:treeId" element={<UpdateTreeStatus />} />
        </Routes>
      </Container>
    </Box>
  );
}
