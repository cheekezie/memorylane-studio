type CredentialData = Record<string, any>;

class CacheService {
	private readonly CREDENTIALS_KEY = "memorylane_credentials";

	storeCredentials(data: CredentialData): void {
		try {
			localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(data));
		} catch (error) {
			console.error("Error storing credentials:", error);
			throw new Error("Failed to store credentials");
		}
	}

	getCredentials(): CredentialData | null {
		try {
			const credentials = localStorage.getItem(this.CREDENTIALS_KEY);
			return credentials ? JSON.parse(credentials) : null;
		} catch (error) {
			console.error("Error parsing credentials:", error);
			return null;
		}
	}

	removeCredentials(): void {
		try {
			localStorage.removeItem(this.CREDENTIALS_KEY);
		} catch (error) {
			console.error("Error removing credentials:", error);
		}
	}

	saveToLocalStorage(key: string, value: any): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error("Error saving to localStorage:", error);
		}
	}

	getFromLocalStorage(key: string): any | null {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.error("Error retrieving from localStorage:", error);
			return null;
		}
	}

	removeFromLocalStorage(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error("Error removing from localStorage:", error);
		}
	}

	clearLocalStorage(): void {
		localStorage.clear();
	}
}

const cacheService = new CacheService();
export default cacheService;
