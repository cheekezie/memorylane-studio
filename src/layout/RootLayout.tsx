import type { ReactNode } from "react";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface RootLayoutProps {
	children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeMenuItem, setActiveMenuItem] = useState("frame-photo");

	return (
		<div className="flex h-screen bg-gray-50 overflow-hidden">
			{/* Desktop */}
			<aside className="hidden lg:block lg:w-64 m-4">
				<Sidebar
					isOpen
					activeItem={activeMenuItem}
					onItemSelect={setActiveMenuItem}
				/>
			</aside>

			{/* Mobile overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/40 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 lg:hidden ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<Sidebar
					isOpen={sidebarOpen}
					activeItem={activeMenuItem}
					onItemSelect={setActiveMenuItem}
					onClose={() => setSidebarOpen(false)}
				/>
			</aside>

			<div className="flex flex-col flex-1 overflow-hidden">
				<div className="m-4">
					<Header
						onMenuClick={() => setSidebarOpen(true)}
						activeMenuItem={activeMenuItem}
					/>
				</div>

				<main className="flex-1 overflow-y-auto px-4 pb-6">{children}</main>
			</div>
		</div>
	);
};

export default RootLayout;
