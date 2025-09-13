import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// API base URL - update this to match your backend URL
const API_BASE_URL = 'http://localhost:3001';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Configure axios to include auth token in requests
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Verify token on app load
            verifyToken();
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Sign up function
    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
            
            if (response.data.success) {
                const { user: newUser, token: newToken } = response.data.data;
                setUser(newUser);
                setToken(newToken);
                localStorage.setItem('token', newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                return { success: true, user: newUser };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign up. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Sign in function
    const signin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, credentials);
            
            if (response.data.success) {
                const { user: loggedUser, token: newToken } = response.data.data;
                setUser(loggedUser);
                setToken(newToken);
                localStorage.setItem('token', newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                return { success: true, user: loggedUser };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign in. Please check your credentials.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Sign out function
    const signout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Verify token function
    const verifyToken = async () => {
        if (!token) return;
        
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/verify`);
            if (response.data.success) {
                setUser(response.data.data.user);
            } else {
                signout();
            }
        } catch (err) {
            console.error('Token verification failed:', err);
            signout();
        }
    };

    // Get user profile
    const getProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/profile`);
            if (response.data.success) {
                setUser(response.data.data.user);
                return { success: true, user: response.data.data.user };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch profile.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        signup,
        signin,
        signout,
        verifyToken,
        getProfile,
        isAuthenticated: !!user && !!token,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
