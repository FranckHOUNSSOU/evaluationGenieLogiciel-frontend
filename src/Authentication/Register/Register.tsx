import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { authService } from "../../services/authService";
import { mockAuthService } from "../../services/mockAuthService";
import { USE_MOCK_API } from "../../config/env";
import "./Register.css";

// Utiliser le service approprié selon la configuration
const authProvider = USE_MOCK_API ? mockAuthService : authService;

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		// Validation
		if (!name || !email || !password || !confirmPassword) {
			setError("Veuillez remplir tous les champs obligatoires");
			return;
		}
		
		if (name.length < 2 || name.length > 100) {
			setError("Le nom doit contenir entre 2 et 100 caractères");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Veuillez entrer une adresse email valide");
			return;
		}

		if (password.length < 6) {
			setError("Le mot de passe doit contenir au moins 6 caractères");
			return;
		}

		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await authProvider.register({
				name,
				email,
				password,
				phone: phone || undefined,
			});
			console.log("Inscription réussie:", response);
			// Redirection après inscription réussie
			navigate("/dashboard"); // À adapter selon votre app
		} catch (error: unknown) {
			const err = error as { response?: { status: number; data?: { error: string; details?: Record<string, string> } } };
			if (err.response?.status === 409) {
				setError("Cet email est déjà utilisé");
			} else if (err.response?.status === 400) {
				const details = err.response?.data?.details;
				if (details) {
					setError(`Erreur de validation: ${Object.values(details).join(", ")}`);
				} else {
					setError(err.response?.data?.error || "Erreur de validation");
				}
			} else {
				setError(err.response?.data?.error || "Erreur lors de l'inscription. Veuillez réessayer.");
			}
			console.error("Erreur d'inscription:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleLoginClick = () => {
		navigate("/login");
	};

	return (
		<div className="register-container">
			<Container className="d-flex justify-content-center align-items-center min-vh-100">
				<Card className="register-card shadow-lg">
					<Card.Body className="p-5">
						{USE_MOCK_API && (
							<div className="text-center mb-3">
								<Badge bg="warning" text="dark" className="mb-2">
									⚠️ MODE DÉMO
								</Badge>
								<p className="small text-muted">Données d'exemple · Veuillez créer un nouveau compte</p>
							</div>
						)}
						<div className="text-center mb-4">
							<h1 className="register-title fw-bold">S'inscrire</h1>
							<p className="text-muted">Créez votre compte pour commencer</p>
						</div>

						{error && <Alert variant="danger" className="mb-3">{error}</Alert>}

						<Form onSubmit={handleRegister}>
							<Form.Group className="mb-3">
								<Form.Label className="fw-semibold">Nom complet *</Form.Label>
								<Form.Control
									type="text"
									placeholder="Ex: Jean Dupont"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
								<Form.Text className="text-muted">Entre 2 et 100 caractères</Form.Text>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className="fw-semibold">Email *</Form.Label>
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

							<Form.Group className="mb-3">
								<Form.Label className="fw-semibold">Téléphone (optionnel)</Form.Label>
								<Form.Control
									type="tel"
									placeholder="Entrez votre numéro de téléphone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className="fw-semibold">Mot de passe *</Form.Label>
								<Form.Control
									type="password"
									placeholder="Min. 6 caractères (recommandé 8+)"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
							</Form.Group>

							<Form.Group className="mb-4">
								<Form.Label className="fw-semibold">Confirmer le mot de passe *</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirmez votre mot de passe"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="form-input"
									size="lg"
									disabled={loading}
								/>
							</Form.Group>

							<Button
								variant="success"
								type="submit"
								className="w-100 btn-register fw-bold mb-3"
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
										Inscription en cours...
									</>
								) : (
									"S'inscrire"
								)}
							</Button>
						</Form>

						<div className="text-center">
							<p className="text-muted mb-0">
								Vous avez déjà un compte?{" "}
								<Button
									variant="link"
									className="btn-login-link p-0"
									onClick={handleLoginClick}
									disabled={loading}
								>
									Se connecter
								</Button>
							</p>
						</div>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
};

export default Register;