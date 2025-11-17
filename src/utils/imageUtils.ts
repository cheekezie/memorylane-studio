import type { ImageFile } from "../types/interfaces/image.interface";

/**
 * Converts a blob URL to base64 for persistent storage
 */
export const convertBlobToBase64 = async (
	imageFile: ImageFile,
): Promise<string> => {
	if (!imageFile.url.startsWith("blob:")) {
		return imageFile.url;
	}

	// Convert blob URL to base64 using File object if available
	if (imageFile.file) {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsDataURL(imageFile.file!);
		});
	}

	try {
		const response = await fetch(imageFile.url);
		const blob = await response.blob();
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to convert blob"));
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error("Failed to convert blob URL:", error);
		return imageFile.url;
	}
};

/**
 * Converts a File object to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
};

/**
 * Checks if a URL is a blob URL
 */
export const isBlobUrl = (url: string): boolean => {
	return url.startsWith("blob:");
};

/**
 * Checks if a URL is a base64 data URL
 */
export const isBase64Url = (url: string): boolean => {
	return url.startsWith("data:");
};
