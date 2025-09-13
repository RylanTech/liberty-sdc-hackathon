import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { user, isAuthenticated, signout } = useAuth();

    const handleSignOut = () => {
        signout();
    };

    return (
        <Navbar bg="light" expand="md" className="shadow-sm" style={{ minHeight: '64px' }}>
            <Container>
                <Navbar.Brand href="/" style={{ fontWeight: 700, fontSize: '1.7rem', color: '#457b9d' }}>
                    <span role="img" aria-label="globe">🌍</span> Traveler
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to={"/"} style={{ fontWeight: 500 }}>Home</Link>
                        <Link to={"/create-plan"} style={{ fontWeight: 500 }}>Create a plan</Link>
                        
                        {isAuthenticated ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    variant="outline-primary" 
                                    id="dropdown-basic"
                                    style={{ 
                                        fontWeight: 500, 
                                        borderColor: '#457b9d', 
                                        color: '#457b9d' 
                                    }}
                                >
                                    {user?.name || 'Account'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item disabled>
                                        Signed in as {user?.email}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleSignOut}>
                                        Sign Out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Link to={"/sign-in"} style={{ fontWeight: 500 }}>Sign In</Link>
                                <Link to={"/sign-up"} style={{ fontWeight: 500 }}>Sign Up</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Header