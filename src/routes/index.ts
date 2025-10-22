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

// Public Routes
export const publicRoutes: RouteConfig[] = [
	{
		path: "/login",
		element: lazyLoad(() => import("../pages/login/Login")),
	},
	{
		path: "/reset-password",
		element: lazyLoad(() => import("../pages/resetPassword/ResetPassword")),
	},
	{
		path: "/signup",
		element: lazyLoad(() => import("../pages/signUp/SignUp")),
	},
];

// Private Routes
export const privateRoutes: RouteConfig[] = [
	{
		path: "/",
		element: lazyLoad(() => import("../pages/home/Home")),
		preload: true,
	},
	{
		path: "/frame-picture",
		element: lazyLoad(() => import("../pages/frames/FramePhoto")),
	},
];
