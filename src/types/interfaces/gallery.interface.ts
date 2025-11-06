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
