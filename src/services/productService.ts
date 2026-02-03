// Service de gestion des produits avec localStorage

export interface Product {
	id: string;
	name: string;
	price: number;
	createdAt: Date;
}

const PRODUCTS_KEY = 'products';

// Données initiales de démonstration
const initialProducts: Product[] = [];

// Initialiser les données si elles n'existent pas
function initializeProducts() {
	if (!localStorage.getItem(PRODUCTS_KEY)) {
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
	}
}

export const productService = {
	// Récupérer tous les produits
	getAllProducts(): Product[] {
		initializeProducts();
		const data = localStorage.getItem(PRODUCTS_KEY);
		return data ? JSON.parse(data) : [];
	},

	// Ajouter un produit
	addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
		const products = this.getAllProducts();
		const newProduct: Product = {
			...product,
			id: Date.now().toString(),
			createdAt: new Date(),
		};
		products.push(newProduct);
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
		return newProduct;
	},

	// Supprimer un produit
	deleteProduct(id: string): void {
		const products = this.getAllProducts();
		const filtered = products.filter(p => p.id !== id);
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
	},

	// Mettre à jour un produit
	updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
		const products = this.getAllProducts();
		const index = products.findIndex(p => p.id === id);
		if (index === -1) return null;
		
		products[index] = { ...products[index], ...updates };
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
		return products[index];
	},

	// Obtenir les statistiques des produits
	getStats() {
		const products = this.getAllProducts();
		const totalValue = products.reduce((acc, p) => acc + p.price, 0);
		const totalProducts = products.length;

		return {
			totalProducts,
			totalValue,
		};
	},
};
