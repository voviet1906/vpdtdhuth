import axios from '~/api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/auth/refresh-token', {
                withCredentials: true,
            });
            localStorage.setItem('auth', JSON.stringify({ ...auth, accessToken: response.data.accessToken }));
            setAuth((prev) => {
                console.log(JSON.stringify(prev));
                console.log(response.data.accessToken);
                return { ...prev, accessToken: response.data.accessToken };
            });
            return response.data.accessToken;
        } catch (err) {
            localStorage.removeItem('auth');
            setAuth({});
        }
    };
    return refresh;
};

export default useRefreshToken;
