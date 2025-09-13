import { Container, Form, Button, Alert } from "react-bootstrap";
import Header from "../components/Header";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const { signup, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    function validateForm() {
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return false;
        }
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters long");
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setValidationError("Password must contain at least one lowercase letter, one uppercase letter, and one number");
            return false;
        }
        setValidationError("");
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        clearError(); // Clear any previous errors
        
        if (!validateForm()) {
            return;
        }
        
        const result = await signup({ name, email, password });
        
        if (result.success) {
            // Redirect to homepage or dashboard after successful signup
            navigate('/');
        }
        // Error handling is managed by the auth context
    }

    return (
        <>
            <Header />
            <main style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #fdf6e3 100%)', minHeight: '100vh', padding: 0 }}>
                <Container className="py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <section className="text-center mb-4">
                        <h1 style={{ fontWeight: 700, fontSize: '2.2rem', color: '#2d3a4b' }}>Welcome Traveler!</h1>
                        <p style={{ color: '#4f5d75' }}>Sign up to plan your next adventure.</p>
                    </section>
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-sm border-0 p-4">
                            {(error || validationError) && (
                                <Alert variant="danger" className="mb-3">
                                    {validationError || error}
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter your full name" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        required 
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                        disabled={loading}
                                    />
                                    <Form.Text className="text-muted">
                                        Password must be at least 6 characters with uppercase, lowercase, and number.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        required 
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <div className="d-grid gap-2 mt-3">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        style={{ background: '#457b9d', border: 'none' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Sign Up'}
                                    </Button>
                                    <center>
                                        already have an account? <a href="/sign-in" style={{ color: '#457b9d', textDecoration: 'none' }}>Sign In</a>
                                    </center>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}

export default SignUp;
