import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-red-600">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}