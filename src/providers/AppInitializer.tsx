import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLoading } from "../contexts/loading";
import cacheService from "../services/cache.service";

interface AppInitializerProps {
	children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
	const [isReady, setIsReady] = useState(false);
	const { setInitialLoading } = useLoading();

	useEffect(() => {
		const initializeApp = async () => {
			try {
				const session = localStorage.getItem("memorylane_session");

				if (session) {
					// Optionally validate the session with API
					// await validateSession(session);
				}

				setIsReady(true);
			} catch (error) {
				console.error("App initialization failed:", error);
				cacheService.removeFromLocalStorage("memorylane_session");
				setIsReady(true);
			}
		};

		initializeApp();
	}, []);

	useEffect(() => {
		if (isReady) {
			setInitialLoading(false);
		}
	}, [isReady, setInitialLoading]);

	return <>{children}</>;
}
