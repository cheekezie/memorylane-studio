import type { ReactNode } from "react";
import { createContext } from "react";

interface LoadingLinkProps {
	to: string;
	children: ReactNode;
	className?: string;
}

export interface LoadingContextType {
	startLoading: () => void;
	stopLoading: () => void;
	setInitialLoading: (isLoading: boolean) => void;
	LoadingLink: React.FC<LoadingLinkProps>;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
	undefined,
);
