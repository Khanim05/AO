import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
  const { token, user, justLoggetOut } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to={justLoggetOut ? "/" : "/login"} replace />;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default PrivateRoute;
