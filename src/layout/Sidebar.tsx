import { X } from "lucide-react";

interface SidebarProps {
	onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
	return (
		<div className="h-full flex flex-col p-4">
			{onClose && (
				<button
					onClick={onClose}
					className="lg:hidden self-end mb-4 p-2 hover:bg-white/10 rounded-lg"
					aria-label="Close menu"
				>
					<X className="w-6 h-6 text-white" />
				</button>
			)}

			<div className="text-white text-xl font-bold mb-8">MEMORYLANE</div>

			<nav className="space-y-2">{/* Your nav items */}</nav>
		</div>
	);
};
export default Sidebar;
