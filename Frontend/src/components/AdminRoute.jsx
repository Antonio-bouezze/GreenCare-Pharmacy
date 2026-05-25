import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function AdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Checking permissions" />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
