import { Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb";
import { CART_CHECKOUT_STEPS } from "../../constants/cartBreadcrumbSteps";

const CartCheckoutLayout: React.FC = () => {
	const location = useLocation();

	const getCurrentStepId = () => {
		if (location.pathname.includes("/checkout")) {
			return "checkout";
		}
		return "cart";
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
			<div className="max-w-6xl mx-auto">
				<Breadcrumb
					steps={CART_CHECKOUT_STEPS}
					currentStepId={getCurrentStepId()}
				/>
				<Outlet />
			</div>
		</div>
	);
};

export default CartCheckoutLayout;
