import { Container } from "react-bootstrap"
import Header from "../components/Header"

function CreatePlan() {
    return (
        <>
            <Header />
            <main style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #e0eafc 100%)', minHeight: '100vh', padding: 0 }}>
                <Container className="py-5">
                    <section className="text-center mb-5">
                        <h1 style={{ fontWeight: 700, fontSize: '2.5rem', color: '#2d3a4b' }}>Create Your Dream Journey</h1>
                        <p style={{ fontSize: '1.2rem', color: '#4f5d75', maxWidth: 600, margin: '1rem auto' }}>
                            Every adventure begins with a single step. Start planning your next unforgettable trip—whether it's a solo escape, a family holiday, or a friends' getaway. Let your imagination soar and turn your travel dreams into reality!
                        </p>
                    </section>
                    <section className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0 p-4">
                                <h3 className="mb-4 text-center" style={{ color: '#457b9d' }}>Plan Details</h3>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="destination" className="form-label">Destination</label>
                                        <input type="text" className="form-control" id="destination" placeholder="Where do you want to go?" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dates" className="form-label">Travel Dates</label>
                                        <input type="text" className="form-control" id="dates" placeholder="e.g. 2025-09-20 to 2025-09-27" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="travelers" className="form-label">Number of Travelers</label>
                                        <input type="number" className="form-control" id="travelers" min="1" placeholder="1" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="interests" className="form-label">Interests & Activities</label>
                                        <input type="text" className="form-control" id="interests" placeholder="e.g. hiking, museums, food tours" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="notes" className="form-label">Special Notes</label>
                                        <textarea className="form-control" id="notes" rows="2" placeholder="Anything else?" />
                                    </div>
                                    <div className="d-grid gap-2 mt-4">
                                        <button type="submit" className="btn btn-primary btn-lg" style={{ background: '#457b9d', border: 'none' }}>
                                            Start Planning ✈️
                                        </button>
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