/// <reference types="vite-plugin-pwa/client" />

import { precacheAndRoute } from "workbox-precaching";

declare global {
	interface Window {
		__WB_MANIFEST: any;
	}
}

precacheAndRoute(self.__WB_MANIFEST);
