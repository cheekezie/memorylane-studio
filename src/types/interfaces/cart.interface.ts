import type { FrameCustomization } from "./frame.interface";
import type { ImageFile } from "./image.interface";

export interface CartItem {
	id: string;
	image: ImageFile;
	customization: FrameCustomization;
	timestamp: number;
}

export interface ShippingDetails {
	fullName: string;
	email: string;
	phoneNumber: string;
	country: string;
	city: string;
	address: string;
}

export interface DeliveryOption {
	id: string;
	name: string;
	days: string;
	price: number;
}

export interface PaymentOption {
	id: string;
	name: string;
	icon: string;
}
