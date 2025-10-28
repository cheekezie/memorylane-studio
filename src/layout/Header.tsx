import { Menu, Bell, ShoppingCart, User } from "lucide-react";
import { Badge, Button as AntButton } from "antd";
import Button from "../components/elements/Button";
import { useCartStore } from "../store";
import { useLoading } from "../contexts/loading";

interface HeaderProps {
	onMenuClick: () => void;
	activeMenuItem: string;
}

const MENU_TITLES: Record<string, string> = {
	"frame-photo": "Frame Photo",
	"gallery-wall": "Gallery Wall",
	"my-orders": "My Orders",
	"art-collections": "Art Collections",
};

const Header = ({ onMenuClick, activeMenuItem }: HeaderProps) => {
	const title = MENU_TITLES[activeMenuItem] || "Frame Photo";
	const cartCount = useCartStore((state) => state.getItemCount());
	const { startLoading } = useLoading();

	const handleCartNavigate = () => {
		startLoading();
		window.location.href = "/cart";
	};

	return (
		<header className="flex items-center justify-between bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 rounded-xl shadow-card transition-all duration-300">
			<div className="flex items-center gap-2 sm:gap-3 min-w-0">
				<button
					onClick={onMenuClick}
					className="lg:hidden p-2 hover:bg-white rounded-xl border border-gray-200 transition-all duration-300 flex-shrink-0"
					aria-label="Open Menu"
				>
					<Menu className="w-5 h-5 text-graydark" />
				</button>

				<h1 className="text-sm sm:text-base font-semibold text-graydark truncate">
					{title}
				</h1>
			</div>

			<div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
				<Badge dot status="error" offset={[-10, 4]}>
					<AntButton
						type="text"
						icon={<Bell className="w-4 h-4 sm:w-5 sm:h-5 text-graydark" />}
						className="hover:bg-white rounded-xl transition-all duration-300 !p-1.5 sm:!p-2"
						aria-label="Notifications"
					/>
				</Badge>

				<Badge
					onClick={handleCartNavigate}
					count={cartCount}
					showZero
					color="#D34053"
					offset={[-6, 4]}
				>
					<AntButton
						type="text"
						icon={
							<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-graydark" />
						}
						className="hover:bg-white rounded-xl transition-all duration-300 !p-1.5 sm:!p-2"
						aria-label="Cart"
					/>
				</Badge>

				<Button
					theme="primary"
					size="sm"
					className="!py-2 !px-2 sm:!px-4 bg-[whitesmoke] ml-4 border border-bodydark text-black"
				>
					<User className="w-4 h-4 flex-shrink-0" />
					<span className="hidden sm:inline text-sm font-medium ml-2">
						Register / Login
					</span>
				</Button>
			</div>
		</header>
	);
};

export default Header;
