import type { ReactNode } from "react";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface RootLayoutProps {
	children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden">
			<aside className="hidden lg:block lg:w-64 bg-primary flex-shrink-0">
				<Sidebar />
			</aside>

			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<aside
				className={`fixed top-0 left-0 h-full w-64 bg-primary z-50 transform transition-transform duration-300 lg:hidden ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<Sidebar onClose={() => setSidebarOpen(false)} />
			</aside>

			<div className="flex-1 flex flex-col overflow-hidden">
				<Header onMenuClick={() => setSidebarOpen(true)} />

				<main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
			</div>
		</div>
	);
};

export default RootLayout;
