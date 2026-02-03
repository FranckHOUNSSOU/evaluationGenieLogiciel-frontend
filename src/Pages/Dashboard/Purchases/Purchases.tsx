import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import type { Purchase, PurchaseStats } from "../../../services/purchaseService";
import { purchaseService } from "../../../services/purchaseService";
import "./Purchases.css";

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<PurchaseStats>({
    totalSpent: 0,
    totalItems: 0,
    topProduct: null,
    topProductCount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPurchases = () => {
    const sorted = purchaseService.getSortedPurchases();
    setPurchases(sorted);
    setStats(purchaseService.getStats());
  };

  useEffect(() => {
    const sorted = purchaseService.getSortedPurchases();
    setPurchases(sorted);
    setStats(purchaseService.getStats());
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      productName: "",
      price: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.productName.trim()) {
      setError("Le nom du produit est obligatoire");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Le prix doit être un nombre positif");
      return;
    }

    if (!formData.purchaseDate) {
      setError("La date d'achat est obligatoire");
      return;
    }

    try {
      purchaseService.addPurchase(
        formData.productName.trim(),
        parseFloat(formData.price),
        formData.purchaseDate
      );
      setSuccess("Achat ajouté avec succès!");
      loadPurchases();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch {
      setError("Une erreur est survenue lors de l'ajout");
    }
  };

  const handleDeletePurchase = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet achat?")) {
      purchaseService.deletePurchase(id);
      loadPurchases();
    }
  };

  return (
    <div className="page-content">
      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col md={8}>
            <h1 className="page-title">🛒 Historique des Achats</h1>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="success" size="lg" onClick={handleShowModal}>
              ➕ Ajouter un achat
            </Button>
          </Col>
        </Row>

        {/* Main Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={6} lg={3}>
            <Card className="stat-card-large">
              <Card.Body>
                <div className="stat-icon-small">💰</div>
                <h6 className="stat-label">Bilan Financier</h6>
                <p className="stat-value-large">
                  ${stats.totalSpent.toFixed(2)}
                </p>
                <p className="stat-subtitle">
                  sur {stats.totalItems} achat{stats.totalItems > 1 ? "s" : ""}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card-large">
              <Card.Body>
                <div className="stat-icon-small">📊</div>
                <h6 className="stat-label">Moyenne par Achat</h6>
                <p className="stat-value-large">
                  ${stats.totalItems > 0 ? (stats.totalSpent / stats.totalItems).toFixed(2) : "0.00"}
                </p>
                <p className="stat-subtitle">coût moyen</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card-large highlight">
              <Card.Body>
                <div className="stat-icon-small">🏆</div>
                <h6 className="stat-label">Top Produit</h6>
                <p className="stat-value-large">
                  {stats.topProduct ? stats.topProduct.substring(0, 15) : "N/A"}
                </p>
                <p className="stat-subtitle">
                  {stats.topProductCount} achat{stats.topProductCount > 1 ? "s" : ""}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="stat-card-large">
              <Card.Body>
                <div className="stat-icon-small">📦</div>
                <h6 className="stat-label">Total Achats</h6>
                <p className="stat-value-large">{stats.totalItems}</p>
                <p className="stat-subtitle">articles achetés</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Purchases Table */}
        <Card className="table-card">
          <Card.Body className="p-0">
            {purchases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h5>Aucun achat enregistré</h5>
                <p className="text-muted">Commencez par ajouter votre premier achat</p>
                <Button variant="primary" onClick={handleShowModal}>
                  ➕ Ajouter un achat
                </Button>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-header">
                  <tr>
                    <th>Date</th>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="fw-bold">
                        {new Date(purchase.purchaseDate).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <span className="product-badge">{purchase.productName}</span>
                      </td>
                      <td className="fw-bold text-success">${purchase.price.toFixed(2)}</td>
                      <td className="text-end">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeletePurchase(purchase.id)}
                          className="btn-delete"
                        >
                          🗑️ Supprimer
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

      {/* Modal d'ajout d'achat */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">➕ Ajouter un nouvel achat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleAddPurchase}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nom du produit *</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                placeholder="Ex: Café, Riz, Pommes..."
                value={formData.productName}
                onChange={handleInputChange}
                className="form-input"
                size="lg"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Prix (en $) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    size="lg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date d'achat *</Form.Label>
                  <Form.Control
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="form-input"
                    size="lg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 mt-4">
              <Button
                variant="success"
                type="submit"
                size="lg"
                className="btn-submit"
              >
                ✅ Ajouter l'achat
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleCloseModal}
                size="lg"
              >
                Annuler
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Purchases;

