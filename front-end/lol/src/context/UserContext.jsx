import { createContext, useState } from 'react';
import axios from 'axios';
import SignIn from '../pages/SignIn';


export const UserContext = createContext();

export function UserProvider({ children }) {
    const [logedInStatus, setLogedInStatus] = useState(false);

    const signUp = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3001/api/signup', userData);
            if (response.data && response.data.token) {
                setLogedInStatus(true);
                localStorage.setItem('Bearer', response.data.token);
            }

            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    const signIn = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3001/api/signin', userData);
            if (response.data && response.data.token) {
                setLogedInStatus(true);
                localStorage.setItem('Bearer', response.data.token);
            }

            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    return (
        <UserContext.Provider value={{ signUp, signIn, logedInStatus }}>
            {children}
        </UserContext.Provider>
    );
}
