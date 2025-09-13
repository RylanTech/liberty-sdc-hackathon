import { createContext, useState } from 'react';
import axios from 'axios';


let xRapidAPIKey = import.meta.env.VITE_X_RAPIDAPI_KEY || '';
let xRapidYelpKey = import.meta.env.VITE_YELP_XRAPIDAPI_KEY || '';
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
            console.log(response);
            return response;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    async function yelpLocations(location, query) {
        const options = {
            method: 'GET',
            url: 'https://yelp-business-reviews.p.rapidapi.com/search',
            params: {
                location: location,
                query: query
            },
            headers: {
                'x-rapidapi-key': xRapidYelpKey,
                'x-rapidapi-host': 'yelp-business-reviews.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            return response
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <DestinationContext.Provider value={{ loading, error, fetchSuggestions, yelpLocations }}>
            {children}
        </DestinationContext.Provider>
    );
}
