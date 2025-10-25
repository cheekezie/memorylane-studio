import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/Loader";
import RootLayout from "./layout/RootLayout";
import { privateRoutes, publicRoutes } from "./routes";
import { AppInitializer } from "./providers/AppInitializer";
import "@ant-design/v5-patch-for-react-19";

function App() {
	return (
		<AppInitializer>
			<RootLayout>
				<Suspense fallback={<Loader text="Loading..." theme="white" />}>
					<Routes>
						{publicRoutes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={<route.element />}
							/>
						))}

						{privateRoutes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={<route.element />}
							/>
						))}

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Suspense>
			</RootLayout>
		</AppInitializer>
	);
}

export default App;
