import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { DeliveryDashboard } from './components/DeliveryDashboard';

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-green-600">Chargement...</div>
      </div>
    );
  }

  return user ? <DeliveryDashboard user={user} /> : <LoginForm />;
}