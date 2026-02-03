import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Row, Col, Card, Modal, Form, Alert } from "react-bootstrap";
import { productService, type Product } from "../../../services/productService";
import "./Products.css";

const Products = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		price: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Charger les produits au montage
	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = () => {
		const allProducts = productService.getAllProducts();
		setProducts(allProducts);
	};

	const handleAddClick = () => {
		setShowModal(true);
		setError("");
		setFormData({ name: "", price: "", stock: "", category: "Électronique" });
	};

	const handleModalClose = () => {
		setShowModal(false);
		setError("");
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddProduct = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Validation
		if (!formData.name.trim()) {
			setError("Le nom du produit est requis");
			return;
		}

		if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
			setError("Le prix doit être un nombre positif");
			return;
		}

		try {
			productService.addProduct({
				name: formData.name.trim(),
				price: parseFloat(formData.price),
			});

			setSuccess("Produit ajouté avec succès!");
			setFormData({ name: "", price: "" });
			loadProducts();

			// Fermer la modal après 1 seconde
			setTimeout(() => {
				setShowModal(false);
				setSuccess("");
			}, 1000);
		} catch (err) {
			setError("Erreur lors de l'ajout du produit");
		}
	};

	const handleDeleteProduct = (id: string) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
			productService.deleteProduct(id);
			loadProducts();
		}
	};

	const stats = productService.getStats();

	return (
		<div className="page-content">
			<Container fluid className="px-4">
				<Row className="mb-4">
					<Col md={6}>
						<h1 className="page-title">📦 Produits</h1>
					</Col>
					<Col md={6} className="text-end">
						<Button
							variant="outline-secondary"
							size="sm"
							className="me-2"
							onClick={() => navigate("/dashboard")}
						>
							🏠 Accueil
						</Button>
						<Button variant="success" size="lg" onClick={handleAddClick}>
							+ Ajouter un produit
						</Button>
					</Col>
				</Row>

				{/* Stats Cards */}
				<Row className="mb-4 g-3">
					<Col md={6}>
						<Card className="stat-card">
							<Card.Body>
								<div className="stat-icon">📦</div>
								<h6 className="stat-label">Total Produits</h6>
								<p className="stat-value">{stats.totalProducts}</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={6}>
						<Card className="stat-card">
							<Card.Body>
								<div className="stat-icon">💰</div>
								<h6 className="stat-label">Valeur Stock</h6>
								<p className="stat-value">${stats.totalValue.toFixed(2)}</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				{/* Products Table */}
				<Card className="table-card">
					<Card.Body className="p-0">
						{products.length === 0 ? (
							<div className="text-center py-5">
								<p className="text-muted">Aucun produit pour le moment. Ajoutez-en un!</p>
							</div>
						) : (
							<Table hover responsive className="mb-0">
								<thead className="table-header">
									<tr>
										<th>Numéro</th>
										<th>Nom</th>
										<th>Prix</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr key={product.id}>
											<td className="fw-bold">#{product.id}</td>
											<td>{product.name}</td>
											<td className="fw-bold">${product.price.toFixed(2)}</td>
											<td>
												<Button
													variant="danger"
													size="sm"
													onClick={() => handleDeleteProduct(product.id)}
												>
													Supprimer
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					</Card.Body>
				</Card>
			</Container>

			{/* Modal d'ajout de produit */}
			<Modal show={showModal} onHide={handleModalClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>📦 Ajouter un produit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}
					<Form onSubmit={handleAddProduct}>
						<Form.Group className="mb-3">
							<Form.Label>Nom du produit *</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Ex: Téléphone XYZ"
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Prix (€) *</Form.Label>
							<Form.Control
								type="number"
								name="price"
								value={formData.price}
								onChange={handleInputChange}
								placeholder="0.00"
								step="0.01"
								min="0"
								required
							/>
						</Form.Group>

						<div className="d-grid gap-2">
							<Button variant="success" type="submit">
								✅ Ajouter le produit
							</Button>
							<Button variant="secondary" onClick={handleModalClose}>
								Annuler
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default Products;
