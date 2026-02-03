// Configuration de l'environnement
// Basculez cette valeur pour passer du mode réel au mode démo

export const USE_MOCK_API = true; // Mettez à false une fois le backend prêt!
export const API_BASE_URL = 'http://localhost:3000/api';

// Message d'information
if (USE_MOCK_API) {
	console.warn(
		'⚠️ MODE DÉMO ACTIVÉ - Les données sont stockées en local et réinitialisées au rechargement'
	);
} else {
	console.log('✅ Mode API réelle activé - Connecté à', API_BASE_URL);
}
