import React from "react";
import { Container, Table, Button, Row, Col, Card } from "react-bootstrap";
import "./Products.css";

const Products = () => {
	const [products] = React.useState([
		{ id: 1, name: "Produit 1", price: 49.99, stock: 100, category: "Électronique" },
		{ id: 2, name: "Produit 2", price: 29.99, stock: 50, category: "Accessoires" },
		{ id: 3, name: "Produit 3", price: 99.99, stock: 25, category: "Électronique" },
	]);

	return (
		<div className="page-content">
			<Container fluid className="px-4">
				<Row className="mb-4">
					<Col md={8}>
						<h1 className="page-title">📦 Produits</h1>
					</Col>
					<Col md={4} className="text-end">
						<Button variant="success" size="lg">
							+ Ajouter un produit
						</Button>
					</Col>
				</Row>

				{/* Stats Cards */}
				<Row className="mb-4 g-3">
					<Col md={4}>
						<Card className="stat-card">
							<Card.Body>
								<div className="stat-icon">📦</div>
								<h6 className="stat-label">Total Produits</h6>
								<p className="stat-value">{products.length}</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="stat-card">
							<Card.Body>
								<div className="stat-icon">📊</div>
								<h6 className="stat-label">En Stock</h6>
								<p className="stat-value">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="stat-card">
							<Card.Body>
								<div className="stat-icon">💰</div>
								<h6 className="stat-label">Valeur Stock</h6>
								<p className="stat-value">
									${(products.reduce((acc, p) => acc + p.price * p.stock, 0)).toFixed(2)}
								</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				{/* Products Table */}
				<Card className="table-card">
					<Card.Body className="p-0">
						<Table hover responsive className="mb-0">
							<thead className="table-header">
								<tr>
									<th>ID</th>
									<th>Nom</th>
									<th>Catégorie</th>
									<th>Prix</th>
									<th>Stock</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product) => (
									<tr key={product.id}>
										<td className="fw-bold">#{product.id}</td>
										<td>{product.name}</td>
										<td>
											<span className="badge bg-info">{product.category}</span>
										</td>
										<td className="fw-bold">${product.price.toFixed(2)}</td>
										<td>
											<span
												className={`badge ${
													product.stock > 20 ? "bg-success" : "bg-warning"
												}`}
											>
												{product.stock} unités
											</span>
										</td>
										<td>
											<Button variant="sm" size="sm" className="me-2">
												Modifier
											</Button>
											<Button variant="danger" size="sm">
												Supprimer
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
};

export default Products;
