import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, role, children }) {
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;