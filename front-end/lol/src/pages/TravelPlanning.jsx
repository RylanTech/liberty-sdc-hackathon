import { Container, Card, Row, Col, Modal, Button } from "react-bootstrap";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AddLocationModal from "../components/AddLocationModal";

// Helper to generate days between two dates
function getDaysArray(start, end) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= new Date(end)) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

// Example data for places (replace with real data as needed)
const samplePlaces = [
    {
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        name: "Central Park",
        address: "New York, NY 10022, USA",
        phone: "+1 212-310-6600",
        category: "Park"
    },
    {
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        name: "Metropolitan Museum of Art",
        address: "1000 5th Ave, New York, NY 10028, USA",
        phone: "+1 212-535-7710",
        category: "Museum"
    },
    {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        name: "Joe's Pizza",
        address: "7 Carmine St, New York, NY 10014, USA",
        phone: "+1 212-366-1182",
        category: "Restaurant"
    }
];

function TravelPlanning() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [modalShow, setModalShow] = useState(false);
    const [trip, setTrip] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [destination, setDestination] = useState("");
    const [backgroundImage, setBackgroundImage] = useState("");
    const [userTrips, setUserTrips] = useState([]);
    const [showTripSelectModal, setShowTripSelectModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Function to fetch user's trips
    const fetchUserTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to sign-in');
                navigate("/sign-in");
                return [];
            }

            const response = await axios.get('http://localhost:3001/trips', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.trips) {
                setUserTrips(response.data.trips);
                return response.data.trips;
            }
            return [];
        } catch (error) {
            console.error('Error fetching user trips:', error);
            if (error.response?.status === 401) {
                console.log('Token expired or invalid, redirecting to sign-in');
                localStorage.removeItem('token');
                navigate("/sign-in");
            }
            return [];
        }
    };

    // Function to load a specific trip
    const loadTrip = (selectedTrip) => {
        setTrip(selectedTrip);
        setStartDate(selectedTrip.startDate);
        setEndDate(selectedTrip.endDate);
        setDestination(selectedTrip.destination);
        setBackgroundImage(selectedTrip.backgroundImage || "");
        setShowTripSelectModal(false);
        setLoading(false);
    };
    
    useEffect(() => {
        const initializePage = async () => {
            console.log('TravelPlanning - Initializing page...');
            console.log('TravelPlanning - isAuthenticated:', isAuthenticated);
            console.log('TravelPlanning - user:', user);
            console.log('TravelPlanning - location.state:', location.state);
            
            // First, check if we have a token
            const token = localStorage.getItem('token');
            console.log('TravelPlanning - token exists:', !!token);
            
            if (!token) {
                console.log('No token found, redirecting to sign-in');
                navigate("/sign-in");
                return;
            }

            // If coming from create-plan with trip data, use that
            if (location.state && location.state.trip) {
                console.log('TravelPlanning - Using trip data from location.state');
                const { trip: tripData, startDate: start, endDate: end, destination: dest, backgroundImage: bgImg } = location.state;
                setTrip(tripData);
                setStartDate(start || "2025-09-20");
                setEndDate(end || "2025-09-22");
                setDestination(dest || "Unknown Destination");
                setBackgroundImage(bgImg || "");
                console.log('Trip data received from create-plan:', tripData);
                setLoading(false);
            } else {
                console.log('TravelPlanning - Fetching existing trips...');
                // Navigating directly to travel planning - check for existing trips
                const trips = await fetchUserTrips();
                console.log('TravelPlanning - Found trips:', trips.length);
                
                if (trips.length === 0) {
                    // No trips exist, redirect to create-plan
                    console.log('TravelPlanning - No trips found, redirecting to create-plan');
                    navigate("/create-plan");
                } else if (trips.length === 1) {
                    // Only one trip exists, load it automatically
                    console.log('TravelPlanning - Loading single trip automatically');
                    loadTrip(trips[0]);
                } else {
                    // Multiple trips exist, show selection modal
                    console.log('TravelPlanning - Multiple trips found, showing selection modal');
                    setShowTripSelectModal(true);
                    setLoading(false);
                }
            }
        };

        initializePage();
    }, [location.state, navigate]);

    const days = startDate && endDate ? getDaysArray(startDate, endDate) : [];

    // Dynamic background style similar to CreatePlan
    const mainStyle = {
        background: backgroundImage 
            ? `linear-gradient(rgba(224, 234, 252, 0.85), rgba(253, 246, 227, 0.85)), url(${backgroundImage})`
            : 'linear-gradient(135deg, #e0eafc 0%, #fdf6e3 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        padding: 0,
        transition: 'all 0.5s ease-in-out'
    };

    return (
        <>
            <Header />
            <AddLocationModal show={modalShow} onHide={() => setModalShow(false)} />
            
            {/* Trip Selection Modal */}
            <Modal show={showTripSelectModal} onHide={() => setShowTripSelectModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Modal.Title style={{ color: '#2d3a4b' }}>Select a Trip</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem' }}>
                    <p className="mb-4" style={{ color: '#4f5d75' }}>
                        You have {userTrips.length} existing trip{userTrips.length > 1 ? 's' : ''}. 
                        Please select one to continue planning or create a new trip.
                    </p>
                    <div className="row">
                        {userTrips.map((userTrip) => {
                            const tripDuration = Math.ceil((new Date(userTrip.endDate) - new Date(userTrip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                            return (
                                <div key={userTrip.id} className="col-md-6 mb-3">
                                    <Card 
                                        className="h-100 shadow-sm border-0 trip-card" 
                                        style={{ 
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            border: '2px solid transparent'
                                        }}
                                        onClick={() => loadTrip(userTrip)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        {userTrip.backgroundImage && (
                                            <div style={{ height: '150px', overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
                                                <Card.Img
                                                    variant="top"
                                                    src={userTrip.backgroundImage}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <Card.Body style={{ padding: '1.5rem' }}>
                                            <Card.Title style={{ color: '#457b9d', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                                                {userTrip.destination}
                                            </Card.Title>
                                            <Card.Text style={{ marginBottom: '0.5rem' }}>
                                                <small style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                                    📅 {new Date(userTrip.startDate).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })} - {new Date(userTrip.endDate).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                    })}
                                                </small><br />
                                                <small style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                                    👥 {userTrip.numberOfTravelers} traveler{userTrip.numberOfTravelers > 1 ? 's' : ''} • 
                                                    📍 {tripDuration} day{tripDuration > 1 ? 's' : ''} • 
                                                    🗂️ {userTrip.status}
                                                </small>
                                            </Card.Text>
                                            <div style={{ 
                                                marginTop: '1rem', 
                                                padding: '0.5rem', 
                                                backgroundColor: '#f8f9fa', 
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <small style={{ color: '#457b9d', fontWeight: 'bold' }}>
                                                    Click to continue planning →
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowTripSelectModal(false)}
                        style={{ marginRight: '1rem' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate("/create-plan")}
                        style={{ background: '#457b9d', border: 'none' }}
                    >
                        ✈️ Create New Trip
                    </Button>
                </Modal.Footer>
            </Modal>

            <main style={mainStyle}>
                <Container className="py-5">
                    {loading ? (
                        <div className="text-center py-5">
                            <h4 style={{ color: '#6c757d' }}>Loading your travel plans...</h4>
                        </div>
                    ) : (
                        <>
                            <section className="text-center mb-5">
                                <h1 style={{ fontWeight: 700, fontSize: '2.5rem', color: '#2d3a4b' }}>
                                    Your Journey to {destination}
                                </h1>
                                <p style={{ fontSize: '1.2rem', color: '#4f5d75' }}>
                                    Plan your daily adventures and make memories that last a lifetime
                                </p>
                                {userTrips.length > 1 && (
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => setShowTripSelectModal(true)}
                                        style={{ borderColor: '#457b9d', color: '#457b9d' }}
                                    >
                                        Switch Trip
                                    </Button>
                                )}
                            </section>
                            <div style={{ 
                                backgroundColor: backgroundImage ? 'rgba(255, 255, 255, 0.95)' : 'white', 
                                padding: "35px", 
                                borderRadius: "15px",
                                backdropFilter: backgroundImage ? 'blur(10px)' : 'none',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}>
                                {days.length > 0 ? days.map((date, idx) => (
                                <div key={date.toISOString()}>
                                    <section className="mb-5">
                                        <h3 style={{ color: '#457b9d', fontWeight: 600 }}>
                                            Day {idx + 1} - {date.toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </h3>
                                        <div className="mt-3">
                                            {/* Show day location if it exists from trip data */}
                                            {trip && trip.dayLocations && trip.dayLocations[idx] && trip.dayLocations[idx].location ? (
                                                <Card className="mb-4 w-100 shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <Card.Body>
                                                        <Card.Title style={{ color: '#457b9d' }}>
                                                            📍 {trip.dayLocations[idx].location}
                                                        </Card.Title>
                                                        <Card.Text>
                                                            {trip.dayLocations[idx].notes || "No additional notes yet."}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            ) : (
                                                /* Show sample places for demonstration */
                                                samplePlaces.map((place, i) => (
                                                    <Card className="mb-4 w-100 shadow-sm border-0 position-relative overflow-hidden" key={i} style={{ maxHeight: 280 }}>
                                                        <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
                                                            <Card.Img
                                                                variant="top"
                                                                src={place.image}
                                                                alt={place.name}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    maxHeight: 220,
                                                                    filter: 'brightness(0.65)'
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    color: 'white',
                                                                    padding: '1.5rem',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'flex-end',
                                                                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%)'
                                                                }}
                                                            >
                                                                <Card.Title style={{ fontSize: 24, fontWeight: 700 }}>{place.name}</Card.Title>
                                                                <Card.Text style={{ fontSize: 16 }}>
                                                                    <strong>Address:</strong> {place.address}<br />
                                                                    <strong>Phone:</strong> {place.phone}<br />
                                                                    <strong>Category:</strong> {place.category}
                                                                </Card.Text>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                    {/* Add button section */}
                                    <section className="mb-5">
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: 180, background: '#f1f8ff', borderRadius: '0.5rem', border: '2px dashed #bcdff1' }}>
                                            <button
                                                style={{
                                                    border: 'none',
                                                    background: '#457b9d',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: 60,
                                                    height: 60,
                                                    fontSize: 36,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 8px rgba(69,123,157,0.15)',
                                                    cursor: 'pointer'
                                                }}
                                                aria-label="Add new travel section"
                                                onClick={() => setModalShow(true)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </section>
                                </div>
                                )) : (
                                    <div className="text-center py-5">
                                        <h4 style={{ color: '#6c757d' }}>Loading your travel plan...</h4>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </Container>
            </main>
        </>
    );
}

export default TravelPlanning;
