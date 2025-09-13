import { useContext, useRef, useState, useEffect } from 'react';
import { Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { DestinationContext } from '../context/DestinationContext';

function AddLocationModal(props) {
    const [suggestions, setSuggestions] = useState([])
    const [destination, setDestination] = useState(props.defaultDestination || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [yelpLocationsList, setYelpLocationsList] = useState([])
    const [query, setQuery] = useState("")
    const debounceTimeout = useRef(null);

    const { fetchSuggestions, yelpLocations } = useContext(DestinationContext)

    // Update destination when props change
    useEffect(() => {
        if (props.defaultDestination) {
            setDestination(props.defaultDestination);
        }
    }, [props.defaultDestination]);

    function searchDestinations(e) {
        const value = e.target.value;
        setDestination(value);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
            if (value.trim()) {
                let desti = await fetchSuggestions(value);
                console.log(desti)
                setSuggestions(desti.data.predictions || []);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);
    }

    async function searchYelpLocations() {
        console.log("test")
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
            let locations = await yelpLocations(destination, query)
            setYelpLocationsList(locations.data.results)
            console.log(locations.data)
        }, 500);

    }

    // Handle destination selection
    const handleDestinationSelect = (suggestion) => {
        setDestination(suggestion.description);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    function addToTrip(location) {
        
    }

    return (
        <Modal {...props} size='lg' aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Location
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        <div className='col-12 col-sm-6'>
                            Location
                            <Form.Control type="text"
                                value={destination}
                                onChange={(e) => searchDestinations(e)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onFocus={() => {
                                    if (suggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                id="destination"
                                className='mb-3'
                                placeholder="Where do you want to go?" />
                            {suggestions.length > 0 && showSuggestions && (
                                <ul className="list-group position-absolute" style={{ zIndex: 1000, width: '100%' }}>
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.place_id}
                                            className="list-group-item list-group-item-action"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input blur
                                                handleDestinationSelect(suggestion);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {suggestion.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='col-12 col-sm-6'>
                            Query
                            <Form.Control onChange={(e) => setQuery(e.target.value)} placeholder='What are you looking for?' className='mb-3' />
                        </div>

                        <div className='col-12'>
                            <Button onClick={() => searchYelpLocations()} className='col-12 mb-3'>
                                Search
                            </Button>
                        </div>

                        {yelpLocationsList.length > 0 && (
                            <div className="col-12">
                                <h5>Locations</h5>
                                <ul className="list-group mb-3">
                                    {yelpLocationsList.map((loc) => (
                                        <li key={loc.bizId} className="list-group-item">
                                            <Row>
                                                <div className="d-flex align-items-start col-10">
                                                    {loc.images && loc.images[0] && (
                                                        <img
                                                            src={loc.images[0]}
                                                            alt={loc.name}
                                                            style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16, borderRadius: 8 }}
                                                        />
                                                    )}
                                                    <div>
                                                        <h6 className="mb-1">{loc.name}</h6>
                                                        <div>
                                                            <span>{loc.rating} ⭐</span>
                                                            <span className="mx-2">({loc.reviewCount} reviews)</span>
                                                            {loc.priceRange && <span>{loc.priceRange}</span>}
                                                        </div>
                                                        <div>
                                                            <small>
                                                                {loc.categories && loc.categories.join(', ')}
                                                            </small>
                                                        </div>
                                                        {loc.website && (
                                                            <div>
                                                                <a href={loc.website} target="_blank" rel="noopener noreferrer">
                                                                    Website
                                                                </a>
                                                            </div>
                                                        )}
                                                        {loc.phone && (
                                                            <div>
                                                                <small>{loc.phone}</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='col-2'>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={(loc) => {
                                                            addToTrip(loc)
                                                        }}
                                                    >
                                                        Add to Trip
                                                    </Button>
                                                </div>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddLocationModal