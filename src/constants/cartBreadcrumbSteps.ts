import type { BreadcrumbStep } from "../components/BreadCrumb";

export const CART_CHECKOUT_STEPS: BreadcrumbStep[] = [
	{ id: "cart", label: "My Cart", path: "/cart" },
	{ id: "checkout", label: "Check Out", path: "/checkout" },
];
