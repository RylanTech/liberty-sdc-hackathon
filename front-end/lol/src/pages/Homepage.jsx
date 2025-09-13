import { Container } from "react-bootstrap"
import Header from "../components/Header"

function Homepage() {
    return (
        <>
            <Header />
            <main style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', minHeight: '100vh', padding: '0' }}>
                <Container className="py-5">
                    <section className="text-center mb-5">
                        <h1 style={{ fontWeight: 700, fontSize: '3rem', color: '#2d3a4b' }}>Plan Your Next Adventure</h1>
                        <p style={{ fontSize: '1.25rem', color: '#4f5d75', maxWidth: 600, margin: '1rem auto' }}>
                            Discover, organize, and book your dream trips with Traveler. Your journey starts here—explore destinations, create itineraries, and travel smarter.
                        </p>
                        <div>
                            <a href="/create-plan" className="btn btn-primary btn-lg mt-3 me-3" style={{ background: '#457b9d', border: 'none' }}>Start Planning</a>
                            <a href="#features" className="btn btn-outline-primary btn-lg mt-3" style={{ borderColor: '#457b9d', color: '#457b9d' }}>Learn More</a>
                        </div>
                    </section>
                    
                    {/* Popular Destinations Section */}
                    <section className="mb-5">
                        <h2 className="text-center mb-4" style={{ color: '#2d3a4b', fontWeight: 600 }}>Popular Destinations</h2>
                        <div className="row justify-content-center">
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                                    <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                        <img 
                                            src="/images/asia.jpg" 
                                            alt="Asia Destinations" 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: 'brightness(0.7)'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            color: 'white',
                                            padding: '2rem',
                                            textAlign: 'center'
                                        }}>
                                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Explore Asia</h3>
                                            <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                                                Discover ancient temples, bustling cities, and stunning landscapes across Asia's diverse countries.
                                            </p>
                                            <a href="/create-plan" className="btn btn-light btn-sm">Plan Your Trip</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                                    <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                        <img 
                                            src="/images/north-america.jpg" 
                                            alt="North America Destinations" 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: 'brightness(0.7)'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            color: 'white',
                                            padding: '2rem',
                                            textAlign: 'center'
                                        }}>
                                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>North America Adventures</h3>
                                            <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                                                From vibrant cities to natural wonders, experience the diversity of North America.
                                            </p>
                                            <a href="/create-plan" className="btn btn-light btn-sm">Plan Your Trip</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" className="row justify-content-center">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <span style={{ fontSize: '2.5rem', color: '#457b9d' }}>🌍</span>
                                    <h5 className="card-title mt-3">Explore Destinations</h5>
                                    <p className="card-text">Browse curated guides and discover hidden gems around the world.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <span style={{ fontSize: '2.5rem', color: '#457b9d' }}>🗺️</span>
                                    <h5 className="card-title mt-3">Smart Itineraries</h5>
                                    <p className="card-text">Easily build & customize your travel plans with friends and family.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <span style={{ fontSize: '2.5rem', color: '#457b9d' }}>✈️</span>
                                    <h5 className="card-title mt-3">Plan Ahead</h5>
                                    <p className="card-text">Prepare in advance for your vacations.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="text-center mt-5">
                        <h2 style={{ color: '#2d3a4b', fontWeight: 600 }}>Ready to start your journey?</h2>
                        <a href="/sign-up" className="btn btn-success btn-lg mt-3" style={{ background: '#1abc9c', border: 'none' }}>Sign Up Now</a>
                    </section>
                </Container>
            </main>
        </>
    );
}
export default Homepage