import { Container, Form, Row } from "react-bootstrap"
import Header from "../components/Header"
import { DestinationContext } from "../context/DestinationContext";
import { useContext, useState, useRef } from "react";

function CreatePlan() {
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);
    const { fetchSuggestions } = useContext(DestinationContext);
    const debounceTimeout = useRef(null);


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

    const today = new Date().toISOString().split('T')[0];

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
                                        <Form.Control type="text"
                                            value={destination}
                                            onChange={(e) => searchDestinations(e)}
                                            onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                                            id="destination"
                                            placeholder="Where do you want to go?" />
                                        {suggestions.length > 0 && (
                                            <ul className="list-group position-absolute" style={{ zIndex: 1000, width: '100%' }}>
                                                {suggestions.map((suggestion) => (
                                                    <li key={suggestion.place_id} className="list-group-item list-group-item-action" onClick={() => { setDestination(suggestion.description); setSuggestions([]); }}>
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
                                            onCHhnge={e => setNumberOfTravelers(e.target.value)}
                                            className="form-control"
                                            id="travelers"
                                            min="1"
                                        />
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