import type { ImageFile } from "../../types/interfaces/image.interface";

// Helper: Convert remote image → File + fresh blob URL (supports PNG transparency, WebP, etc.)
export const remoteImageToFile = async (art: {
	id: string;
	url: string;
	title: string;
}): Promise<ImageFile> => {
	const response = await fetch(art.url);
	if (!response.ok) throw new Error(`Failed to load image: ${art.url}`);

	const blob = await response.blob();
	const mime = blob.type || "image/jpeg";

	const extMap: Record<string, string> = {
		"image/png": "png",
		"image/jpeg": "jpg",
		"image/webp": "webp",
		"image/gif": "gif",
		"image/svg+xml": "svg",
		"image/avif": "avif",
	};

	// Prefer MIME type, fallback to URL extension
	const extFromMime = extMap[mime];
	const extFromUrl = art.url.split(".").pop()?.split("?")[0].toLowerCase();
	const extension =
		extFromMime || (extFromUrl && extFromUrl in extMap ? extFromUrl : "jpg");

	const cleanName =
		art.title
			.replace(/[^a-z0-9\s-]/gi, "")
			.trim()
			.replace(/\s+/g, "_")
			.substring(0, 50) || "artwork";

	const file = new File([blob], `${cleanName}.${extension}`, { type: mime });

	return {
		id: art.id,
		url: URL.createObjectURL(file),
		file,
	};
};
