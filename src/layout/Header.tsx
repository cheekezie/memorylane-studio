import { Menu } from "lucide-react";

interface HeaderProps {
	onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
	return (
		<header className="bg-white border-b px-4 py-3 flex items-center justify-between">
			{/* Menu Button - Only visible on mobile */}
			<button
				onClick={onMenuClick}
				className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
				aria-label="Open menu"
			>
				<Menu className="w-6 h-6" />
			</button>

			{/* Page Title */}
			<h1 className="text-lg font-semibold">Frame Photo</h1>

			{/* Right side icons */}
			<div className="flex items-center gap-3">
				{/* Your notification, cart, login buttons */}
			</div>
		</header>
	);
};
export default Header;
