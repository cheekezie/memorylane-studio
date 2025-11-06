import { Gallery1, Gallery2 } from "../assets";
import type { GalleryWallTemplate } from "../types/interfaces/gallery.interface";

export const GALLERY_WALLS: GalleryWallTemplate[] = [
	{
		id: "wall-1",
		name: "Classic Grid 6",
		dimensions: "120x120cm",
		price: 25,
		image: Gallery1,
		totalFrames: 6,
		frames: [
			{ id: "f1", size: "30x20", position: { row: 0, col: 0 } },
			{ id: "f2", size: "30x20", position: { row: 0, col: 1 } },
			{ id: "f3", size: "30x20", position: { row: 0, col: 2 } },
			{ id: "f4", size: "30x20", position: { row: 1, col: 0 } },
			{ id: "f5", size: "30x20", position: { row: 1, col: 1 } },
			{ id: "f6", size: "30x20", position: { row: 1, col: 2 } },
		],
	},
	{
		id: "wall-2",
		name: "Mixed Layout 8",
		dimensions: "150x120cm",
		price: 25,
		image: Gallery2,
		totalFrames: 8,
		frames: [
			{ id: "f1", size: "30x20", position: { row: 0, col: 0 } },
			{ id: "f2", size: "20x20", position: { row: 0, col: 1 } },
			{ id: "f3", size: "30x20", position: { row: 0, col: 2 } },
			{ id: "f4", size: "20x20", position: { row: 0, col: 3 } },
			{ id: "f5", size: "30x20", position: { row: 1, col: 0 } },
			{ id: "f6", size: "20x20", position: { row: 1, col: 1 } },
			{ id: "f7", size: "30x20", position: { row: 1, col: 2 } },
			{ id: "f8", size: "20x20", position: { row: 1, col: 3 } },
		],
	},
];
