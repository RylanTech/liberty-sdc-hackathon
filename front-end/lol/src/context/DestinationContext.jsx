import { createContext, useState } from 'react';
import axios from 'axios';


let xRapidAPIKey = import.meta.env.VITE_X_RAPIDAPI_KEY || '';

export const DestinationContext = createContext();

export function DestinationProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSuggestions = async (input) => {
        setLoading(true);
        setError(null);
        const options = {
            method: 'GET',
            url: 'https://google-place-autocomplete-and-place-info.p.rapidapi.com/maps/api/place/autocomplete/json',
            params: {
                input
            },
            headers: {
                'x-rapidapi-key': xRapidAPIKey,
                'x-rapidapi-host': 'google-place-autocomplete-and-place-info.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            console.log(xRapidAPIKey);
            return response;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DestinationContext.Provider value={{ loading, error, fetchSuggestions }}>
            {children}
        </DestinationContext.Provider>
    );
}
