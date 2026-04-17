import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; 
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        setUser(res.data);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post('/api/auth/register', { username, email, password });
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    const googleLogin = async (credential) => {
        const res = await axios.post('/api/auth/google', { credential });
        setUser(res.data);
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
