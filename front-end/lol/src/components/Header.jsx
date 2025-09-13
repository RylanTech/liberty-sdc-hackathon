import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <Navbar bg="light" expand="md" className="shadow-sm" style={{ minHeight: '64px' }}>
            <Container>
                <Navbar.Brand href="#" style={{ fontWeight: 700, fontSize: '1.7rem', color: '#457b9d' }}>
                    <span role="img" aria-label="globe">🌍</span> Traveler
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to={"/"} style={{ fontWeight: 500 }}>Home</Link>
                        <Link to={"/create-plan"} style={{ fontWeight: 500 }}>Create a plan</Link>
                        <Link href="#" style={{ fontWeight: 500 }}>Sign Up</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Header