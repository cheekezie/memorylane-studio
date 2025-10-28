import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",

			manifest: {
				name: "MemoryLane",
				short_name: "MemoryLane",
				description: "Create, Organize, and Frame your cherished memories",
				theme_color: "#5F6652",
				background_color: "#ffffff",
				display: "standalone",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/maskable_icon.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/apple-touch-icon.png",
						sizes: "180x180",
						type: "image/png",
					},
				],
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,woff2,png,jpg,svg}"],
			},
		}),
	],
});
