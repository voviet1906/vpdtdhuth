import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';

const NoRequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return !auth.name ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};

export default NoRequireAuth;
