import { Image, Grid, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LogoImage } from "../assets";

interface SidebarProps {
	isOpen?: boolean;
	activeItem: string;
	onItemSelect: (id: string) => void;
	onClose?: () => void;
}

interface NavItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	link: string;
}

const NAV_ITEMS: NavItem[] = [
	{
		id: "frame-photo",
		label: "Frame Photo",
		link: "/",
		icon: <Image className="w-5 h-5" />,
	},
	{
		id: "gallery-wall",
		label: "Gallery Wall",
		link: "/gallery-wall",
		icon: <Grid className="w-5 h-5" />,
	},
	// {
	// 	id: "my-orders",
	// 	label: "My Orders",
	// 	link: "/orders",
	// 	icon: <ShoppingBag className="w-5 h-5" />,
	// },
	{
		id: "art-collections",
		label: "Art Collections",
		link: "/art-collections",
		icon: <FolderOpen className="w-5 h-5" />,
	},
];

const Sidebar = ({
	isOpen = true,
	activeItem,
	onItemSelect,
	onClose,
}: SidebarProps) => {
	const location = useLocation();

	const handleItemClick = (id: string) => {
		onItemSelect(id);

		if (onClose) {
			onClose();
		}
	};

	const isActive = (item: NavItem) => {
		return location.pathname === item.link || activeItem === item.id;
	};

	return (
		<div className="relative h-full">
			<div
				className={`
					flex flex-col h-full bg-primary text-white rounded-2xl shadow-card transition-all duration-300
					${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
				`}
			>
				<div className="p-6 border-b border-white/10">
					<Link to="/" onClick={() => handleItemClick("frame-photo")}>
						<img src={LogoImage} alt="Logo" className="w-full object-contain" />
					</Link>
				</div>

				<nav className="flex-1 px-4 py-3 space-y-1">
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.id}
							to={item.link}
							onClick={() => handleItemClick(item.id)}
							className={`
								group relative flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-medium
								transition-all duration-300 ease-in-out
								${
									isActive(item)
										? "bg-white/25 text-white shadow-md"
										: "text-white/70 hover:text-white hover:bg-white/10"
								}
							`}
						>
							<span
								className={`transition-transform duration-300 ${
									isActive(item) ? "scale-110" : "group-hover:scale-105"
								}`}
							>
								{item.icon}
							</span>
							<span>{item.label}</span>

							{isActive(item) && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
							)}
						</Link>
					))}
				</nav>

				<div className="p-6 border-t border-white/10">
					<p className="text-xs text-center text-white/60 font-poppins">
						© {new Date().getFullYear()} MemoryLane
					</p>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
