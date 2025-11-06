import { Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderSummary } from "./OrderSummary";
import { useCartStore } from "../../store";
import { FRAME_SIZES } from "../../constants/frameOptions";
import { EmptyCart } from "../../components/EmptyCart";
import Button from "../../components/elements/Button";

const CartPage: React.FC = () => {
	const navigate = useNavigate();
	const { items, removeItem, updateQuantity, quantities } = useCartStore();

	const handleQtyChange = (itemId: string, delta: number) => {
		const current = quantities[itemId] || 1;
		const newQty = current + delta;
		if (newQty >= 1) {
			updateQuantity(itemId, newQty);
		}
	};

	if (items.length === 0) {
		return <EmptyCart onCtaClick={() => navigate("/")} />;
	}

	return (
		<>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart</h1>

			<div className="grid lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-4">
					{items.map((item) => {
						const frameSize = FRAME_SIZES.find(
							(size) => size.id === item.customization.frameSize,
						);
						const quantity = quantities[item.id] || 1;
						const itemTotal = (frameSize?.price || 0) * quantity;

						return (
							<div
								key={item.id}
								className="bg-white rounded-lg border border-gray-200 p-4"
							>
								<div className="flex gap-4">
									<div className="w-24 h-24 rounded-lg overflow-hidden border-4 border-gray-200 flex-shrink-0">
										<img
											src={item.image.url}
											alt="Frame"
											className="w-full h-full object-cover"
											loading="lazy"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start mb-2">
											<div>
												<h3 className="font-semibold text-gray-900">
													{frameSize?.label || "Custom"} Frame
												</h3>
												<p className="text-sm text-gray-500">
													Type:{" "}
													<span className="capitalize">
														{item.customization.frameType}
													</span>{" "}
													• Filter:{" "}
													<span className="capitalize">
														{item.customization.effect}
													</span>
												</p>
											</div>
											<div className="text-right">
												<span className="text-lg font-bold text-gray-900">
													${itemTotal}
												</span>
												{quantity > 1 && (
													<p className="text-xs text-gray-500">
														${frameSize?.price} × {quantity}
													</p>
												)}
											</div>
										</div>

										<div className="flex items-center justify-between mt-4">
											<button
												onClick={() => removeItem(item.id)}
												className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
											>
												<Trash2 className="w-4 h-4" />
												Remove
											</button>

											<div className="flex items-center gap-2 border border-gray-300 rounded-lg">
												<button
													onClick={() => handleQtyChange(item.id, -1)}
													disabled={quantity <= 1}
													className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
													aria-label="Decrease quantity"
												>
													<Minus className="w-4 h-4" />
												</button>
												<span className="px-4 font-medium min-w-[2ch] text-center">
													{quantity}
												</span>
												<button
													onClick={() => handleQtyChange(item.id, 1)}
													className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
													aria-label="Increase quantity"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<OrderSummary
						items={items}
						quantities={quantities}
						showPromoCode={true}
					/>
					<Button
						label="Checkout"
						onClick={() => navigate("/checkout")}
						className="w-full mt-4 bg-graydark py-3 hover:bg-graydark/90 transition-colors"
					/>
				</div>
			</div>
		</>
	);
};

export default CartPage;
