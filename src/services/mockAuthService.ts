import type { LoginResponse, RegisterResponse, LoginCredentials, RegisterData } from './authService';

// Délai de simulation réseau
const DELAY = 800;

// Utilisateurs de démo
const demoUsers = [
	{
		id: "1",
		name: "Jean Dupont",
		email: "jean@example.com",
		password: "password123",
		role: "user",
	},
	{
		id: "2",
		name: "Marie Martin",
		email: "marie@example.com",
		password: "password123",
		role: "user",
	},
];

export const mockAuthService = {
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		await new Promise((resolve) => setTimeout(resolve, DELAY));

		const user = demoUsers.find((u) => u.email === credentials.email);

		if (!user) {
			throw {
				response: {
					status: 401,
					data: { error: "Email ou mot de passe incorrect" },
				},
			};
		}

		if (user.password !== credentials.password) {
			throw {
				response: {
					status: 401,
					data: { error: "Email ou mot de passe incorrect" },
				},
			};
		}

		const token = `mock_token_${Date.now()}`;
		const response: LoginResponse = {
			message: "Authenticated",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		};

		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(response.user));

		return response;
	},

	register: async (data: RegisterData): Promise<RegisterResponse> => {
		await new Promise((resolve) => setTimeout(resolve, DELAY));

		// Vérifier si l'email existe déjà
		if (demoUsers.some((u) => u.email === data.email)) {
			throw {
				response: {
					status: 409,
					data: { error: "Email already exists" },
				},
			};
		}

		// Validation
		if (!data.name || data.name.length < 2 || data.name.length > 100) {
			throw {
				response: {
					status: 400,
					data: {
						error: "Validation error",
						details: { name: "Name must be between 2 and 100 characters" },
					},
				},
			};
		}

		if (!data.password || data.password.length < 6) {
			throw {
				response: {
					status: 400,
					data: {
						error: "Validation error",
						details: { password: "Password must be at least 6 characters" },
					},
				},
			};
		}

		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			name: data.name,
			email: data.email,
			password: data.password,
			role: "user",
		};

		demoUsers.push(newUser);

		const token = `mock_token_${Date.now()}`;
		const response: RegisterResponse = {
			message: "User created",
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			},
			token,
		};

		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(response.user));

		return response;
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	getCurrentUser: () => {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : null;
	},

	getToken: () => {
		return localStorage.getItem("token");
	},
};
