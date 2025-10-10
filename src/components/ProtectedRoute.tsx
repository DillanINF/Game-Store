import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem('user'); // atau dari context
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
