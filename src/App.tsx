import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, createElement, isValidElement } from "react";
import Loader from "./components/Loader";
import RootLayout from "./layout/RootLayout";
import { privateRoutes, publicRoutes } from "./routes";
import { AppInitializer } from "./providers/AppInitializer";
import "@ant-design/v5-patch-for-react-19";

function renderElement(el: any) {
	if (isValidElement(el)) return el;
	return createElement(el, null);
}

function App() {
	return (
		<AppInitializer>
			<RootLayout>
				<Suspense fallback={<Loader text="Loading..." theme="white" />}>
					<Routes>
						{publicRoutes.map((route) => {
							if (route.children) {
								return (
									<Route
										key={route.path}
										path={route.path}
										element={renderElement(route.element)}
									>
										{route.children.map((child, idx) => (
											<Route
												key={child.path || `index-${idx}`}
												index={child.index}
												path={child.path}
												element={renderElement(child.element)}
											/>
										))}
									</Route>
								);
							}
							return (
								<Route
									key={route.path}
									path={route.path}
									element={renderElement(route.element)}
								/>
							);
						})}
						{privateRoutes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={renderElement(route.element)}
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
