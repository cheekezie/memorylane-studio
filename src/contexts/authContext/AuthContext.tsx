import { createContext } from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuth: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
export type { AuthContextType };
