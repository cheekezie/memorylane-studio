export interface GalleryFrame {
	id: string;
	size: string;
	position: { row: number; col: number };
}

export interface GalleryWallTemplate {
	id: string;
	name: string;
	dimensions: string;
	price: number;
	image: string;
	frames: GalleryFrame[];
	totalFrames: number;
}

export interface GalleryImage {
	id: string;
	src: string | null;
	layout: "square" | "portrait" | "landscape";
	top: number;
	left: number;
	width: number;
	height: number;
	frameType: string;
	frameSize: number;
	borderStyle: string | null;
	effectStyle: string | null;
}
