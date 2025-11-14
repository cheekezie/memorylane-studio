import { lazy } from "react";
import CartCheckoutLayout from "../pages/cart/CartLayout";
import GalleryWallLayout from "../pages/gallery/GalleryWallLayout";

const lazyLoad = (importFunc: () => Promise<any>) => lazy(importFunc);

export const publicRoutes = [
	{ path: "/", element: lazyLoad(() => import("../pages/home/Home")) },
	{
		path: "/reset-password",
		element: lazyLoad(() => import("../pages/resetPassword/ResetPassword")),
	},
	{
		path: "/art-collections",
		element: lazyLoad(() => import("../pages/art/ArtCollections")),
	},

	{
		path: "/cart",
		element: <CartCheckoutLayout />,
		children: [
			{ index: true, element: lazyLoad(() => import("../pages/cart/Cart")) },
			{
				path: "checkout",
				element: lazyLoad(() => import("../pages/cart/Checkout")),
			},
		],
	},

	{
		path: "/gallery-wall",
		element: <GalleryWallLayout />,
		children: [
			{
				index: true,
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

export const privateRoutes = [
	{
		path: "/my-orders",
		element: lazyLoad(() => import("../pages/orders/MyOrders")),
	},
];
