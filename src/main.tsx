import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { LoadingProvider } from "./contexts/loading/LoadingProvider.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Router>
			<AuthProvider>
				<LoadingProvider>
					<App />
				</LoadingProvider>
			</AuthProvider>
		</Router>
	</StrictMode>,
);
