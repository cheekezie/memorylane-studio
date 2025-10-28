import type { CartItem } from "./cart.interface";
import type { FrameCustomization } from "./frame.interface";
import type { ImageFile } from "./image.interface";

export interface CartStore {
	items: CartItem[];
	removeItem: (id: string) => void;
	clearCart: () => void;
	getItemCount: () => number;
	addItem: (image: ImageFile, customization: FrameCustomization) => void;
}
