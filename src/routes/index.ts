import { lazy } from "react";
import type { LazyExoticComponent, ComponentType } from "react";

interface RouteConfig {
	path: string;
	element: LazyExoticComponent<ComponentType<Record<string, never>>>;
	preload?: boolean;
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
	{
		path: "/gallery-wall",
		element: lazyLoad(() => import("../pages/gallery/GalleryWall")),
	},
	{
		path: "/cart",
		element: lazyLoad(() => import("../pages/cart/Cart")),
	},
	{
		path: "/checkout",
		element: lazyLoad(() => import("../pages/cart/Checkout")),
	},
];

// Private Routes
export const privateRoutes: RouteConfig[] = [
	{
		path: "/my-orders",
		element: lazyLoad(() => import("../pages/orders/MyOrders")),
	},
];
