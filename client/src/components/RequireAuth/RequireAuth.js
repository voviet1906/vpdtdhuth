import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return allowedRoles.includes(auth?.role) ? (
        <Outlet />
    ) : auth?.name ? (
        <Navigate to="/" state={{ from: location }} replace />
    ) : (
        <Navigate to="/dang-nhap" state={{ from: location }} replace />
    );
};

export default RequireAuth;
