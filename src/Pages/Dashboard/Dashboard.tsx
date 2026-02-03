import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col } from "react-bootstrap";
import { authService } from "../../services/authService";
import "./Dashboard.css";

const Dashboard = () => {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const user = authService.getCurrentUser();

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleLogout = () => {
		authService.logout();
		navigate("/login");
	};

	const menuItems = [
		{ label: "Tableau de bord", icon: "📊", path: "/dashboard" },
		{ label: "Produits", icon: "📦", path: "/dashboard/products" },
		{ label: "Achats", icon: "🛒", path: "/dashboard/purchases" },
		{ label: "Statistiques", icon: "📈", path: "/dashboard/statistics" },
	];

	return (
		<div className="dashboard-container">
			{/* Top Navigation Bar */}
			<Navbar className="navbar-dashboard sticky-top shadow-sm">
				<Container fluid className="px-4">
					<Navbar.Brand href="/dashboard" className="fw-bold fs-5">
						<span className="brand-icon">📱</span> GénieLogiciel
					</Navbar.Brand>
					<div className="ms-auto d-flex align-items-center gap-3">
						<span className="user-info d-none d-md-inline">
							👤 {user?.name || "Utilisateur"}
						</span>
						<Button
							variant="outline-danger"
							size="sm"
							onClick={handleLogout}
							className="btn-logout"
						>
							Déconnexion
						</Button>
					</div>
				</Container>
			</Navbar>

			<Container fluid className="p-0">
				<Row className="m-0 h-100">
					{/* Sidebar Navigation */}
					<Col
						md={3}
						lg={2}
						className="sidebar-nav p-0 d-none d-md-block"
					>
						<Nav className="flex-column p-3 gap-2">
							{menuItems.map((item) => (
								<Nav.Link
									key={item.path}
									href={item.path}
									className="nav-item-custom"
									onClick={(e) => {
										e.preventDefault();
										navigate(item.path);
									}}
								>
									<span className="item-icon">{item.icon}</span>
									<span className="item-label">{item.label}</span>
								</Nav.Link>
							))}
						</Nav>
					</Col>

					{/* Main Content */}
					<Col md={9} lg={10} className="main-content p-4">
						<div className="content-wrapper">
							<h1 className="mb-4">Bienvenue, {user?.name || "Utilisateur"}!</h1>
							<p className="text-muted mb-4">
								Sélectionnez un menu pour continuer
							</p>

							{/* Quick Access Cards */}
							<Row className="g-4">
								{menuItems.slice(1).map((item) => (
									<Col key={item.path} md={6} lg={4}>
										<div
											className="quick-card"
											onClick={() => navigate(item.path)}
											role="button"
										>
											<div className="card-icon">{item.icon}</div>
											<h5 className="card-title">{item.label}</h5>
											<p className="card-subtitle">Accéder</p>
										</div>
									</Col>
								))}
							</Row>
						</div>
					</Col>
				</Row>
			</Container>

			{/* Mobile Offcanvas Menu */}
			<div className="d-md-none fixed-bottom mb-3 mx-3">
				<Button
					variant="primary"
					className="w-100 rounded-3"
					onClick={handleShow}
				>
					☰ Menu
				</Button>
			</div>

			<Offcanvas show={show} onHide={handleClose} placement="start">
				<Offcanvas.Header closeButton>
					<Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className="p-0">
					<Nav className="flex-column">
						{menuItems.map((item) => (
							<Nav.Link
								key={item.path}
								href={item.path}
								className="nav-item-offcanvas"
								onClick={(e) => {
									e.preventDefault();
									navigate(item.path);
									handleClose();
								}}
							>
								<span className="item-icon">{item.icon}</span>
								<span>{item.label}</span>
							</Nav.Link>
						))}
						<hr className="my-2" />
						<Nav.Link
							onClick={() => {
								handleLogout();
								handleClose();
							}}
							className="nav-item-offcanvas text-danger"
						>
							<span className="item-icon">🚪</span>
							<span>Déconnexion</span>
						</Nav.Link>
					</Nav>
				</Offcanvas.Body>
			</Offcanvas>
		</div>
	);
};

export default Dashboard;
