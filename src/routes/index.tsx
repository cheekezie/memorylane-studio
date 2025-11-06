import { lazy } from "react";
import type { LazyExoticComponent, ComponentType, ReactElement } from "react";
import CartCheckoutLayout from "../pages/cart/CartLayout";
import GalleryWallLayout from "../pages/gallery/GalleryWallLayout";

interface RouteConfig {
	path?: string;
	element:
		| LazyExoticComponent<ComponentType<Record<string, never>>>
		| ReactElement;
	index?: boolean;
	preload?: boolean;
	children?: RouteConfig[];
}

function lazyLoad<T extends ComponentType<Record<string, never>>>(
	factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
	return lazy(factory);
}

export const publicRoutes: RouteConfig[] = [
	{
		path: "/",
		element: lazyLoad(() => import("../pages/home/Home")),
	},
	{
		path: "/reset-password",
		element: lazyLoad(() => import("../pages/resetPassword/ResetPassword")),
	},
	{
		path: "/art-collections",
		element: lazyLoad(() => import("../pages/art/ArtCollections")),
	},

	// === CART FLOW ===
	{
		path: "/",
		element: <CartCheckoutLayout />,
		children: [
			{
				index: true,
				path: "cart",
				element: lazyLoad(() => import("../pages/cart/Cart")),
			},
			{
				path: "checkout",
				element: lazyLoad(() => import("../pages/cart/Checkout")),
			},
		],
	},

	// === GALLERY WALL FLOW ===
	{
		path: "/",
		element: <GalleryWallLayout />,
		children: [
			{
				index: true,
				path: "gallery-wall",
				element: lazyLoad(() => import("../pages/gallery/GalleryWall")),
			},
			{
				path: "upload",
				element: lazyLoad(
					() => import("../pages/gallery/GalleryWallUploadPage"),
				),
			},
		],
	},
];

// Private Routes
export const privateRoutes: RouteConfig[] = [
	{
		path: "/my-orders",
		element: lazyLoad(() => import("../pages/orders/MyOrders")),
	},
];
