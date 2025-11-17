import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/interfaces/cart.interface";
import type { FrameCustomization } from "../types/interfaces/frame.interface";
import type { ImageFile } from "../types/interfaces/image.interface";
import { convertBlobToBase64 } from "../utils/imageUtils";

interface CartState {
	items: CartItem[];
	quantities: Record<string, number>;
	addItem: (image: ImageFile, customization: FrameCustomization) => void;
	removeItem: (id: string) => void;
	updateQuantity: (itemId: string, qty: number) => void;
	clearCart: () => void;
	getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			quantities: {},
			addItem: async (image, customization) => {
				// Convert blob URL to base64 before storing
				const persistentUrl = await convertBlobToBase64(image);

				const newItem: CartItem = {
					id: `cart-${Date.now()}-${Math.random()}`,
					image: { id: image.id, url: persistentUrl },
					customization,
					timestamp: Date.now(),
				};

				set((state) => ({
					items: [...state.items, newItem],
					quantities: { ...state.quantities, [newItem.id]: 1 },
				}));
			},
			removeItem: (id) =>
				set((state) => {
					const { [id]: _, ...rest } = state.quantities;
					return {
						items: state.items.filter((i) => i.id !== id),
						quantities: rest,
					};
				}),
			updateQuantity: (itemId, qty) =>
				set((state) => ({
					quantities: { ...state.quantities, [itemId]: Math.max(1, qty) },
				})),
			clearCart: () => set({ items: [], quantities: {} }),
			getItemCount: () => get().items.length,
		}),
		{
			name: "cart-storage",
			partialize: (state) => ({
				items: state.items.map((i) => ({
					...i,
					image: { id: i.image.id, url: i.image.url },
				})),
				quantities: state.quantities,
			}),
		},
	),
);
