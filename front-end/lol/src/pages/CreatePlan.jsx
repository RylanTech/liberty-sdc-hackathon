import { Button, Container, Form, Row } from "react-bootstrap"
import Header from "../components/Header"
import { DestinationContext } from "../context/DestinationContext";
import { useAuth } from "../context/AuthContext";
import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Curated destination images for fallback
const destinationImages = {
    'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'bali': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'iceland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
};

function CreatePlan() {
    const [destination, setDestination] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);
    const [backgroundImage, setBackgroundImage] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const { fetchSuggestions } = useContext(DestinationContext);
    const { isAuthenticated, user } = useAuth();
    const debounceTimeout = useRef(null);

    // Function to fetch destination images
    const fetchDestinationImage = async (destinationName) => {
        setImageLoading(true);
        try {

            try {
                const googleOptions = {
                    method: 'GET',
                    url: 'https://google-api35.p.rapidapi.com/google/images',
                    params: {
                        query: `${destinationName} travel destination`,
                        page: 1,
                        timeframe: 'Any',
                        countryCode: 'gb',
                        responseLanguage: 'en'
                    },
                    headers: {
                        'x-rapidapi-key': import.meta.env.VITE_GOOGLE_SEARCH_API,
                        'x-rapidapi-host': 'google-api35.p.rapidapi.com'
                    }
                };

                const response = await axios.request(googleOptions);
                console.log('Google API Response:', response.data);

                // Check if we have images in the response
                if (response.data && response.data.images && response.data.images.length > 0) {
                    const images = response.data.images;
                    console.log(`Found ${images.length} images from Google API`);
                    
                    // Filter out problematic images and sort by resolution
                    const sortedImages = images
                        .filter(img => {
                            // Filter out the problematic Expedia image
                            if (img.imageUrl && img.imageUrl.includes('mediaim.expedia.com')) {
                                console.log('Skipping Expedia image due to poor cropping');
                                return false;
                            }
                            return img.imageUrl && img.imageWidth && img.imageHeight;
                        })
                        .sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight));

                    if (sortedImages.length > 0) {
                        const bestImage = sortedImages[0];
                        console.log('Selected image:', bestImage);
                        setBackgroundImage(bestImage.imageUrl);
                        return;
                    }
                }
            } catch (googleError) {
                console.log('Google API failed, trying fallback:', googleError.response?.data || googleError.message);
            }

            // Check if we have a curated image for this destination
            const searchKey = destinationName.toLowerCase();
            for (const [key, imageUrl] of Object.entries(destinationImages)) {
                if (searchKey.includes(key)) {
                    console.log(`Using curated image for ${key}:`, imageUrl);
                    setBackgroundImage(imageUrl + '?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
                    return;
                }
            }

            // Final Approach: Generic travel image as final fallback
            const genericTravelImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
            console.log('Using generic travel image');
            setBackgroundImage(genericTravelImage);

        } catch (error) {
            console.error('Error fetching destination image:', error);
        } finally {
            setImageLoading(false);
        }
    };

    function searchDestinations(e) {
        const value = e.target.value;
        setDestination(value);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
            if (value.trim()) {
                let desti = await fetchSuggestions(value);
                setSuggestions(desti.data.predictions || []);
            }
        }, 500);
    }

    let navigate = useNavigate();

    // Handle destination selection
    const handleDestinationSelect = (suggestion) => {
        setDestination(suggestion.description);
        setSuggestions([]);
        setPlaceId(suggestion.place_id);
        
        console.log('Selected destination:', suggestion.description, 'Place ID:', suggestion.place_id);
        // Fetch background image for the selected destination
        fetchDestinationImage(suggestion.description);
    };

    function handleSubmit() {
        let planDetails = {
            destination,
            startDate,
            endDate,
            numberOfTravelers,
            placeId,
            backgroundImage
        }
        console.log('Plan Details:', planDetails);
        console.log('Is Authenticated:', isAuthenticated);
        console.log('User:', user);

        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to sign-up');
            navigate("/sign-up");
        } else {
            console.log('User authenticated, creating trip...');
            createTrip(planDetails);
        }
    }

    // Function to create a trip
    const createTrip = async (tripData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                navigate("/sign-up");
                return;
            }

            const response = await axios.post('http://localhost:3001/trips', tripData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.trip) {
                console.log('Trip created successfully:', response.data.trip);
                // Navigate to travel planning with the trip data
                navigate("/travel-planing", { 
                    state: { 
                        ...tripData, 
                        tripId: response.data.trip.id,
                        trip: response.data.trip 
                    } 
                });
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            if (error.response?.status === 401) {
                // Token might be expired or invalid
                localStorage.removeItem('token');
                navigate("/sign-up");
            } else {
                // Handle other errors (show user-friendly message)
                alert('Failed to create trip. Please try again.');
            }
        }
    };
    const today = new Date().toISOString().split('T')[0];

    // Dynamic background style
    const mainStyle = {
        background: backgroundImage 
            ? `linear-gradient(rgba(253, 246, 227, 0.85), rgba(224, 234, 252, 0.85)), url(${backgroundImage})`
            : 'linear-gradient(135deg, #fdf6e3 0%, #e0eafc 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        padding: 0,
        transition: 'all 0.5s ease-in-out',
        // Additional properties for better image cropping
        backgroundClip: 'border-box',
        overflow: 'hidden'
    };

    return (
        <>
            <Header />
            <main style={mainStyle}>
                <Container className="py-5">
                    <section className="text-center mb-5">
                        <h1 style={{ fontWeight: 700, fontSize: '2.5rem', color: '#2d3a4b' }}>Create Your Dream Journey</h1>
                        <p style={{ fontSize: '1.2rem', color: '#4f5d75', maxWidth: 600, margin: '1rem auto' }}>
                            Every adventure begins with a single step. Start planning your next unforgettable trip—whether it's a solo escape, a family holiday, or a friends' getaway. Let your imagination soar and turn your travel dreams into reality!
                        </p>
                    </section>
                    <section className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-lg border-0 p-4" style={{ 
                                backgroundColor: backgroundImage ? 'rgba(255, 255, 255, 0.95)' : 'white',
                                backdropFilter: backgroundImage ? 'blur(10px)' : 'none',
                                transition: 'all 0.3s ease-in-out'
                            }}>
                                <h3 className="mb-4 text-center" style={{ color: '#457b9d' }}>Plan Details</h3>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="destination" className="form-label">Destination</label>
                                        <div className="position-relative">
                                            <Form.Control type="text"
                                                value={destination}
                                                onChange={(e) => searchDestinations(e)}
                                                onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                                                id="destination"
                                                placeholder="Where do you want to go?" />
                                            {imageLoading && (
                                                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                        <span className="visually-hidden">Loading image...</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {suggestions.length > 0 && (
                                            <ul className="list-group position-absolute" style={{ zIndex: 1000, width: '100%' }}>
                                                {suggestions.map((suggestion) => (
                                                    <li 
                                                        key={suggestion.place_id} 
                                                        className="list-group-item list-group-item-action" 
                                                        onClick={() => handleDestinationSelect(suggestion)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {suggestion.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <Row>
                                            <div className="col-6">
                                                From
                                                <Form.Control
                                                    type="date"
                                                    min={today}
                                                    value={startDate}
                                                    onChange={e => setStartDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-6">
                                                To
                                                <Form.Control type="date"
                                                    min={startDate || today}
                                                    value={endDate}
                                                    onChange={e => setEndDate(e.target.value)}
                                                />
                                            </div>
                                        </Row>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="travelers" className="form-label">Number of Travelers</label>
                                        <input
                                            type="number"
                                            value={numberOfTravelers}
                                            onChange={e => setNumberOfTravelers(e.target.value)}
                                            className="form-control"
                                            id="travelers"
                                            min="1"
                                        />
                                    </div>
                                    <div className="d-grid gap-2 mt-4">
                                        <Button onClick={handleSubmit} className="btn btn-primary btn-lg" style={{ background: '#457b9d', border: 'none' }}>
                                            Start Planning ✈️
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                    <section className="text-center mt-5">
                        <h4 style={{ color: '#2d3a4b', fontWeight: 600 }}>“The world is a book, and those who do not travel read only one page.”</h4>
                        <p style={{ color: '#4f5d75' }}>– Saint Augustine</p>
                    </section>
                </Container>
            </main>
        </>
    );
}
export default CreatePlan