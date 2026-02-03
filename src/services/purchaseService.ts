export interface Purchase {
  id: string;
  productName: string;
  price: number;
  purchaseDate: string;
  createdAt: string;
}

export interface PurchaseStats {
  totalSpent: number;
  totalItems: number;
  topProduct: string | null;
  topProductCount: number;
}

const STORAGE_KEY = "purchases";

export const purchaseService = {
  // Obtenir tous les achats
  getAllPurchases: (): Purchase[] => {
    const purchases = localStorage.getItem(STORAGE_KEY);
    return purchases ? JSON.parse(purchases) : [];
  },

  // Ajouter un achat
  addPurchase: (productName: string, price: number, purchaseDate: string): Purchase => {
    const purchases = purchaseService.getAllPurchases();
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      productName,
      price,
      purchaseDate,
      createdAt: new Date().toISOString(),
    };
    purchases.push(newPurchase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
    return newPurchase;
  },

  // Supprimer un achat
  deletePurchase: (id: string): void => {
    const purchases = purchaseService.getAllPurchases();
    const filtered = purchases.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Obtenir les achats triés par date (récent au plus ancien)
  getSortedPurchases: (): Purchase[] => {
    const purchases = purchaseService.getAllPurchases();
    return purchases.sort(
      (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );
  },

  // Calculer les statistiques
  getStats: (): PurchaseStats => {
    const purchases = purchaseService.getAllPurchases();

    const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);
    const totalItems = purchases.length;

    // Top produit par occurrence
    const productCounts = purchases.reduce(
      (acc, p) => {
        acc[p.productName] = (acc[p.productName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    let topProduct: string | null = null;
    let topProductCount = 0;

    for (const [product, count] of Object.entries(productCounts)) {
      if (count > topProductCount) {
        topProductCount = count;
        topProduct = product;
      }
    }

    return {
      totalSpent,
      totalItems,
      topProduct,
      topProductCount,
    };
  },

  // Obtenir les statistiques des produits
  getProductStats: (): Array<{ name: string; count: number; totalSpent: number }> => {
    const purchases = purchaseService.getAllPurchases();
    const stats = purchases.reduce(
      (acc, p) => {
        const existing = acc.find((s) => s.name === p.productName);
        if (existing) {
          existing.count += 1;
          existing.totalSpent += p.price;
        } else {
          acc.push({
            name: p.productName,
            count: 1,
            totalSpent: p.price,
          });
        }
        return acc;
      },
      [] as Array<{ name: string; count: number; totalSpent: number }>
    );
    return stats.sort((a, b) => b.count - a.count);
  },
};
