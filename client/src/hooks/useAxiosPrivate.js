import { useEffect } from 'react';
import { axiosPrivate } from '~/api/axios';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        let refreshingFunc = undefined;
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                try {
                    if (error?.response?.status === 403 && !prevRequest?.sent) {
                        prevRequest.sent = true;
                        if (!refreshingFunc) refreshingFunc = true;
                        const newAccessToken = await refresh();
                        if (!newAccessToken) {
                            window.location.reload();
                        }
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    }
                    return Promise.reject(error);
                } catch (err) {
                    localStorage.removeItem('auth');
                    window.location = `${window.location.origin}/dang-nhap`;
                } finally {
                    refreshingFunc = undefined;
                }
            },
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
