import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { authService } from "../../services/authService";
import { mockAuthService } from "../../services/mockAuthService";
import { USE_MOCK_API } from "../../config/env";
import "./Login.css";

// Utiliser le service approprié selon la configuration
const authProvider = USE_MOCK_API ? mockAuthService : authService;

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		// Validation simple
		if (!email || !password) {
			setError("Veuillez remplir tous les champs");
			return;
		}
		
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Veuillez entrer une adresse email valide");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await authProvider.login({ email, password });
			console.log("Connexion réussie:", response);
			// Redirection après connexion réussie
			navigate("/dashboard"); // À adapter selon votre app
		} catch (error: unknown) {
			const err = error as { response?: { status: number; data?: { error: string } } };
			if (err.response?.status === 401) {
				setError("Email ou mot de passe incorrect");
			} else if (err.response?.status === 400) {
				setError("Veuillez remplir tous les champs correctement");
			} else {
				setError(err.response?.data?.error || "Erreur lors de la connexion. Veuillez réessayer.");
			}
			console.error("Erreur de connexion:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRegisterClick = () => {
		navigate("/register");
	};

	return (
		<div className="login-container">
			<Container className="d-flex justify-content-center align-items-center min-vh-100">
				<Card className="login-card shadow-lg">
					<Card.Body className="p-5">
						<div className="text-center mb-4">
							<h1 className="login-title fw-bold">Bienvenue</h1>
							<p className="text-muted">Connectez-vous à votre compte</p>
						</div>

						{error && <Alert variant="danger" className="mb-3">{error}</Alert>}

						<Form onSubmit={handleLogin}>
							<Form.Group className="mb-3">
								<Form.Label className="fw-semibold">Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Entrez votre email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
							</Form.Group>

							<Form.Group className="mb-4">
								<Form.Label className="fw-semibold">Mot de passe</Form.Label>
								<Form.Control
									type="password"
									placeholder="Entrez votre mot de passe"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
							</Form.Group>

							<Button
								variant="primary"
								type="submit"
								className="w-100 btn-login fw-bold mb-3"
								size="lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
											className="me-2"
										/>
										Connexion en cours...
									</>
								) : (
									"Se connecter"
								)}
							</Button>
						</Form>

						<div className="text-center">
							<p className="text-muted mb-0">
								Vous n'avez pas de compte?{" "}
								<Button
									variant="link"
									className="btn-register p-0"
									onClick={handleRegisterClick}
									disabled={loading}
								>
									S'inscrire
								</Button>
							</p>
						</div>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
};

export default Login;