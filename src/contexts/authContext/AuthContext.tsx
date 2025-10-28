import { createContext } from "react";

export interface AuthContextType {
	isAuthenticated: boolean;
	setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
