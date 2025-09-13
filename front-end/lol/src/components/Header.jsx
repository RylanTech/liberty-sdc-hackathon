import { Navbar, Container, Nav } from 'react-bootstrap';

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
                        <Nav.Link href="#" style={{ fontWeight: 500 }}>Home</Nav.Link>
                        <Nav.Link href="#features" style={{ fontWeight: 500 }}>Features</Nav.Link>
                        <Nav.Link href="#" style={{ fontWeight: 500 }}>Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Header