import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const DestinationContext = createContext();

export function useDestination() {
	return useContext(DestinationContext);
}

export function DestinationProvider({ children }) {
	const [suggestions, setSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchSuggestions = async (input) => {
		setLoading(true);
		setError(null);
		const options = {
			method: 'GET',
			url: 'https://google-place-autocomplete-and-place-info.p.rapidapi.com/maps/api/place/autocomplete/json',
			params: { input },
			headers: {
				'x-rapidapi-key': '368a56ccdemshdb159b222733ed6p1ad039jsnff59912bb45e',
				'x-rapidapi-host': 'google-place-autocomplete-and-place-info.p.rapidapi.com'
			}
		};
		try {
			const response = await axios.request(options);
			setSuggestions(response.data.predictions || []);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DestinationContext.Provider value={{ suggestions, loading, error, fetchSuggestions }}>
			{children}
		</DestinationContext.Provider>
	);
}
