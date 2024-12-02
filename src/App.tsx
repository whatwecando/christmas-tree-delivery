import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { Navbar } from './components/Navbar';
import { TreeList } from './components/TreeList';
import { UpdateTreeStatus } from './components/UpdateTreeStatus';

const App = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<TreeList />} />
          <Route path="/update/:orderId" element={<UpdateTreeStatus />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
