import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const user = localStorage.getItem('auth');
    const [auth, setAuth] = useState(user ? JSON.parse(user) : {});

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
