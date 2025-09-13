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
                        <a href="#features" className="btn btn-primary btn-lg mt-3" style={{ background: '#457b9d', border: 'none' }}>Get Started</a>
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
                                    <p className="card-text">Easily build, customize, and share your travel plans with friends and family.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <span style={{ fontSize: '2.5rem', color: '#457b9d' }}>✈️</span>
                                    <h5 className="card-title mt-3">Book & Go</h5>
                                    <p className="card-text">Find the best deals on flights, hotels, and experiences—all in one place.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="text-center mt-5">
                        <h2 style={{ color: '#2d3a4b', fontWeight: 600 }}>Ready to start your journey?</h2>
                        <a href="#" className="btn btn-success btn-lg mt-3" style={{ background: '#1abc9c', border: 'none' }}>Sign Up Now</a>
                    </section>
                </Container>
            </main>
        </>
    );
}
export default Homepage