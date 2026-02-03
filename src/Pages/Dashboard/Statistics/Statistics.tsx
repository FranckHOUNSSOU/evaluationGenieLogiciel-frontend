import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import "./Statistics.css";

const Statistics = () => {
	const stats = {
		totalSales: 12500,
		totalPurchases: 8750,
		profit: 3750,
		customers: 245,
		products: 125,
		avgOrderValue: 51.02,
	};

	const topProducts = [
		{ name: "Produit A", sales: 450 },
		{ name: "Produit B", sales: 380 },
		{ name: "Produit C", sales: 290 },
		{ name: "Produit D", sales: 210 },
	];

	const maxSales = Math.max(...topProducts.map((p) => p.sales));

	return (
		<div className="page-content">
			<Container fluid className="px-4">
				<h1 className="page-title mb-4">📈 Statistiques</h1>

				{/* Main Stats Cards */}
				<Row className="mb-4 g-3">
					<Col md={6} lg={4}>
						<Card className="stat-card-large">
							<Card.Body>
								<div className="stat-header">
									<div className="stat-icon-large" style={{ backgroundColor: "#e7f5ff" }}>
										💰
									</div>
									<h6 className="stat-label">Ventes Totales</h6>
								</div>
								<p className="stat-value-large">${stats.totalSales.toFixed(2)}</p>
								<p className="stat-trend">+12.5% ce mois</p>
							</Card.Body>
						</Card>
					</Col>

					<Col md={6} lg={4}>
						<Card className="stat-card-large">
							<Card.Body>
								<div className="stat-header">
									<div className="stat-icon-large" style={{ backgroundColor: "#fff3e0" }}>
										📊
									</div>
									<h6 className="stat-label">Achats</h6>
								</div>
								<p className="stat-value-large">${stats.totalPurchases.toFixed(2)}</p>
								<p className="stat-trend">-5.2% ce mois</p>
							</Card.Body>
						</Card>
					</Col>

					<Col md={6} lg={4}>
						<Card className="stat-card-large">
							<Card.Body>
								<div className="stat-header">
									<div className="stat-icon-large" style={{ backgroundColor: "#f0f9ff" }}>
										📈
									</div>
									<h6 className="stat-label">Profit</h6>
								</div>
								<p className="stat-value-large">${stats.profit.toFixed(2)}</p>
								<p className="stat-trend">+30% ce mois</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				{/* Secondary Stats */}
				<Row className="mb-4 g-3">
					<Col md={6} lg={3}>
						<Card className="stat-card-small">
							<Card.Body className="text-center">
								<p className="stat-icon-small">👥</p>
								<h6 className="stat-label">Clients</h6>
								<p className="stat-value">{stats.customers}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col md={6} lg={3}>
						<Card className="stat-card-small">
							<Card.Body className="text-center">
								<p className="stat-icon-small">📦</p>
								<h6 className="stat-label">Produits</h6>
								<p className="stat-value">{stats.products}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col md={6} lg={3}>
						<Card className="stat-card-small">
							<Card.Body className="text-center">
								<p className="stat-icon-small">🧮</p>
								<h6 className="stat-label">Valeur Moy. Commande</h6>
								<p className="stat-value">${stats.avgOrderValue.toFixed(2)}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col md={6} lg={3}>
						<Card className="stat-card-small">
							<Card.Body className="text-center">
								<p className="stat-icon-small">📉</p>
								<h6 className="stat-label">Marge Brute</h6>
								<p className="stat-value">30%</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				{/* Top Products */}
				<Row className="mb-4">
					<Col lg={8}>
						<Card className="chart-card">
							<Card.Header className="bg-transparent border-bottom">
								<h6 className="mb-0 fw-bold">Top Produits</h6>
							</Card.Header>
							<Card.Body>
								{topProducts.map((product, index) => (
									<div key={index} className="mb-3">
										<div className="d-flex justify-content-between mb-2">
											<span className="fw-500">{product.name}</span>
											<span className="fw-bold">{product.sales} ventes</span>
										</div>
										<ProgressBar
											now={(product.sales / maxSales) * 100}
											className="product-progress"
										/>
									</div>
								))}
							</Card.Body>
						</Card>
					</Col>

					<Col lg={4}>
						<Card className="chart-card">
							<Card.Header className="bg-transparent border-bottom">
								<h6 className="mb-0 fw-bold">Distribution</h6>
							</Card.Header>
							<Card.Body className="text-center">
								<div className="pie-chart">
									<div className="pie-segment ventes">68%</div>
									<div className="pie-segment achats">32%</div>
								</div>
								<div className="mt-3">
									<p className="mb-1">
										<span className="dot ventes"></span> Ventes: 68%
									</p>
									<p>
										<span className="dot achats"></span> Achats: 32%
									</p>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Statistics;
