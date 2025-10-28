import { useState } from "react";
import type { CartItem } from "../../types/interfaces/cart.interface";
import { FRAME_SIZES } from "../../constants/frameOptions";
import Button from "../../components/elements/Button";

interface OrderSummaryProps {
	items: CartItem[];
	quantities?: Record<string, number>;
	showPromoCode?: boolean;
	compact?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
	items,
	quantities = {},
	showPromoCode = true,
	compact = false,
}) => {
	const [promoCode, setPromoCode] = useState("");
	const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

	const calculateSubtotal = () => {
		return items.reduce((total, item) => {
			const frameSize = FRAME_SIZES.find(
				(size) => size.id === item.customization.frameSize,
			);
			const qty = quantities[item.id] || 1;
			return total + (frameSize?.price || 0) * qty;
		}, 0);
	};

	const subtotal = calculateSubtotal();
	const shipping = subtotal >= 50 ? 0 : 4;
	const discount = appliedPromo === "WELCOME10" ? subtotal * 0.1 : 0;
	const total = subtotal + shipping - discount;

	const handleApplyPromo = () => {
		if (promoCode.toUpperCase() === "WELCOME10") {
			setAppliedPromo("WELCOME10");
		}
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h3 className="text-lg font-semibold mb-4">Order Summary</h3>

			{!compact && items.length > 0 && (
				<div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
					{items.map((item) => {
						const frameSize = FRAME_SIZES.find(
							(size) => size.id === item.customization.frameSize,
						);
						const qty = quantities[item.id] || 1;
						const itemTotal = (frameSize?.price || 0) * qty;

						return (
							<div key={item.id} className="flex gap-3">
								<div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
									<img
										src={item.image.url}
										alt="Frame"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">
										{frameSize?.label} Frame
									</p>
									<p className="text-xs text-gray-500">
										Type: {item.customization.frameType} • Filter:{" "}
										{item.customization.effect}
									</p>
									{qty > 1 && (
										<p className="text-xs text-gray-500">
											{qty} × ${frameSize?.price}
										</p>
									)}
								</div>
								<div className="text-sm font-semibold text-gray-900">
									${itemTotal}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{showPromoCode && (
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Promo Code
					</label>
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Enter Promo Code"
							value={promoCode}
							onChange={(e) => setPromoCode(e.target.value)}
							className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
						<Button
							onClick={handleApplyPromo}
							label="Apply"
							className="px-4 py-2 bg-graydark hover:bg-graydark/90 transition-colors"
						/>
					</div>
					{appliedPromo && (
						<p className="text-xs text-green-600 mt-1">
							Promo applied! 10% off
						</p>
					)}
					{!appliedPromo && (
						<p className="text-xs text-gray-500 mt-1">Try: WELCOME10</p>
					)}
				</div>
			)}

			<div className="space-y-2 mb-4">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Subtotal:</span>
					<span className="font-medium">${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Shipping:</span>
					<span className="font-medium">
						{shipping === 0 ? "Free" : `$${shipping}`}
					</span>
				</div>
				{discount > 0 && (
					<div className="flex justify-between text-sm text-green-600">
						<span>Discount (10%):</span>
						<span className="font-medium">-${discount.toFixed(2)}</span>
					</div>
				)}
			</div>

			<div className="pt-4 border-t border-gray-200">
				<div className="flex justify-between items-center">
					<span className="text-base font-semibold text-gray-900">Total:</span>
					<span className="text-xl font-bold text-gray-900">
						${total.toFixed(2)}
					</span>
				</div>
			</div>

			<div className="mt-4 space-y-2">
				{subtotal < 50 && (
					<div className="flex items-start gap-2 text-xs text-orange-600">
						<span>Package</span>
						<span>Add ${(50 - subtotal).toFixed(2)} for free shipping</span>
					</div>
				)}
				<div className="flex items-start gap-2 text-xs text-gray-600">
					<span>Checkmark</span>
					<span>Printed and shipped within 24 hours</span>
				</div>
			</div>
		</div>
	);
};
