import { Container, Form, Button, Alert } from "react-bootstrap";
import Header from "../components/Header";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { signin, loading, error, clearError } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		clearError(); // Clear any previous errors
		
		const result = await signin({ email, password });
		
		if (result.success) {
			// Redirect to homepage or dashboard after successful login
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
						<h1 style={{ fontWeight: 700, fontSize: '2.2rem', color: '#2d3a4b' }}>Welcome Back, Traveler!</h1>
						<p style={{ color: '#4f5d75' }}>Sign in to continue planning your next adventure.</p>
					</section>
					<div className="col-md-6 col-lg-4">
						<div className="card shadow-sm border-0 p-4">
							{error && (
								<Alert variant="danger" className="mb-3">
									{error}
								</Alert>
							)}
							<Form onSubmit={handleSubmit}>
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
								</Form.Group>
								<div className="d-grid gap-2 mt-3">
									<Button 
										variant="primary" 
										type="submit" 
										style={{ background: '#457b9d', border: 'none' }}
										disabled={loading}
									>
										{loading ? 'Signing In...' : 'Sign In'}
									</Button>                                    
								</div>
                                <center>
                                    Don't have an account? <a href="/sign-up" style={{ color: '#457b9d', textDecoration: 'none', display: "inline" }}>Sign Up</a>
                                </center>
							</Form>
						</div>
					</div>
				</Container>
			</main>
		</>
	);
}

export default SignIn;
