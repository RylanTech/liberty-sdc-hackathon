import { Container, Card, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    const [modalShow, setModalShow] = useState(false);
    const [trip, setTrip] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [destination, setDestination] = useState("");
    const [backgroundImage, setBackgroundImage] = useState("");
    
    useEffect(() => {
        if (location.state) {
            const { trip: tripData, startDate: start, endDate: end, destination: dest, backgroundImage: bgImg } = location.state;
            setTrip(tripData);
            setStartDate(start || "2025-09-20");
            setEndDate(end || "2025-09-22");
            setDestination(dest || "Unknown Destination");
            setBackgroundImage(bgImg || "");
            console.log('Trip data received:', tripData);
        }
    }, [location.state]);

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
            <main style={mainStyle}>
                <Container className="py-5">
                    <section className="text-center mb-5">
                        <h1 style={{ fontWeight: 700, fontSize: '2.5rem', color: '#2d3a4b' }}>
                            Your Journey to {destination}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#4f5d75' }}>
                            Plan your daily adventures and make memories that last a lifetime
                        </p>
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
                </Container>
            </main>
        </>
    );
}

export default TravelPlanning;
