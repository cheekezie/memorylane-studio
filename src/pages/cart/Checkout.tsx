import { useNavigate } from "react-router-dom";
import type {
	DeliveryOption,
	PaymentOption,
	ShippingDetails,
} from "../../types/interfaces/cart.interface";
import { useCartStore } from "../../store";
import { useState } from "react";
import { LOCATIONS } from "../../db/Location";
import Breadcrumb from "../../components/BreadCrumb";
import TextInput from "../../components/elements/TextInput";
import SelectDropdown from "../../components/elements/SelectDropdown";
import { OrderSummary } from "./OrderSummary";
import { Modal } from "../../components/ui/Modal";
import Button from "../../components/elements/Button";
import { message } from "antd";
import { CheckIcon } from "lucide-react";

const DELIVERY_OPTIONS: DeliveryOption[] = [
	{
		id: "standard",
		name: "Standard Delivery",
		days: "5-7 business days",
		price: 0,
	},
	{
		id: "express",
		name: "Express Delivery",
		days: "3-4 business days",
		price: 10,
	},
];

const PAYMENT_OPTIONS: PaymentOption[] = [
	{ id: "apple", name: "Apple Pay", icon: "🍎" },
	{ id: "card", name: "Card", icon: "💳" },
	{ id: "google", name: "Google Pay", icon: "G" },
]; //Todo - to be replaced with actual icons****

const CheckoutPage: React.FC = () => {
	const navigate = useNavigate();
	const { items, clearCart, quantities } = useCartStore();
	const [showSuccess, setShowSuccess] = useState(false);

	const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
		fullName: "",
		email: "",
		phoneNumber: "",
		country: "",
		city: "",
		address: "",
	});

	const [selectedDelivery, setSelectedDelivery] = useState("standard");
	const [selectedPayment, setSelectedPayment] = useState("card");

	const countryOptions = Object.keys(LOCATIONS).map((country) => ({
		value: country,
		label: country,
	}));

	const cityOptions = shippingDetails.country
		? LOCATIONS[shippingDetails.country as keyof typeof LOCATIONS].cities.map(
				(city) => ({ value: city, label: city }),
		  )
		: [];

	const handleInputChange = (field: keyof ShippingDetails, value: string) => {
		setShippingDetails((prev) => ({ ...prev, [field]: value }));
		if (field === "country") {
			setShippingDetails((prev) => ({ ...prev, city: "" }));
		}
	};

	const handlePlaceOrder = () => {
		const requiredFields = Object.entries(shippingDetails);
		const isValid = requiredFields.every(([_, value]) => value.trim() !== "");

		if (!isValid) {
			message.error("Please fill in all shipping details");
			return;
		}
		setShowSuccess(true);
		clearCart();
	};

	if (items.length === 0 && !showSuccess) {
		navigate("/");
		return null;
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
				<div className="max-w-6xl mx-auto">
					<Breadcrumb currentStep="checkout" />

					<h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

					<div className="grid lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2 space-y-6">
							{/* Shipping Details */}
							<div className="bg-white rounded-lg border border-gray-200 p-6">
								<h2 className="text-lg font-semibold mb-4">
									Shipping Details:
								</h2>
								<div className="grid sm:grid-cols-2 gap-4">
									<TextInput
										label="Full Name"
										placeholder="Enter full name"
										value={shippingDetails.fullName}
										onChange={(e) =>
											handleInputChange("fullName", e.target.value)
										}
									/>
									<TextInput
										label="Email"
										type="email"
										placeholder="Enter email"
										value={shippingDetails.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
									/>
									<TextInput
										label="Phone Number"
										type="tel"
										placeholder="Enter phone number"
										value={shippingDetails.phoneNumber}
										onChange={(e) =>
											handleInputChange("phoneNumber", e.target.value)
										}
									/>
									<SelectDropdown
										label="Country"
										placeholder="Select Country"
										options={countryOptions}
										value={shippingDetails.country}
										onChange={(value) => handleInputChange("country", value)}
									/>
									<SelectDropdown
										label="City"
										placeholder="Select City"
										options={cityOptions}
										value={shippingDetails.city}
										onChange={(value) => handleInputChange("city", value)}
										disabled={!shippingDetails.country}
									/>
									<div className="sm:col-span-2">
										<TextInput
											label="Address"
											placeholder="Enter Address"
											value={shippingDetails.address}
											onChange={(e) =>
												handleInputChange("address", e.target.value)
											}
										/>
									</div>
								</div>
							</div>

							{/* Delivery Option */}
							<div className="bg-white rounded-lg border border-gray-200 p-6">
								<h2 className="text-lg font-semibold mb-4">Delivery Option:</h2>
								<div className="space-y-3">
									{DELIVERY_OPTIONS.map((option) => (
										<label
											key={option.id}
											className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
										>
											<input
												type="radio"
												name="delivery"
												value={option.id}
												checked={selectedDelivery === option.id}
												onChange={(e) => setSelectedDelivery(e.target.value)}
												className="w-4 h-4 text-primary"
											/>
											<div className="flex-1">
												<p className="font-medium text-gray-900">
													{option.name}
												</p>
												<p className="text-sm text-gray-500">{option.days}</p>
											</div>
											{option.price > 0 && (
												<span className="font-semibold text-gray-900">
													+${option.price}
												</span>
											)}
										</label>
									))}
								</div>
							</div>

							{/* Payment Options */}
							<div className="bg-white rounded-lg border border-gray-200 p-6">
								<h2 className="text-lg font-semibold mb-4">Payment Options:</h2>
								<div className="grid grid-cols-2 gap-3">
									{PAYMENT_OPTIONS.map((option) => (
										<label
											key={option.id}
											className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
										>
											<input
												type="radio"
												name="payment"
												value={option.id}
												checked={selectedPayment === option.id}
												onChange={(e) => setSelectedPayment(e.target.value)}
												className="w-4 h-4 text-primary"
											/>
											<span className="text-2xl">{option.icon}</span>
											<span className="font-medium text-gray-900 text-sm">
												{option.name}
											</span>
										</label>
									))}
								</div>
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<OrderSummary
								items={items}
								showPromoCode={false}
								quantities={quantities}
								compact={true}
							/>
							<Button
								label="Pay and Place Order"
								onClick={handlePlaceOrder}
								className="w-full mt-4 bg-graydark py-3 hover:bg-graydark/90"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Success Modal */}
			<Modal isOpen={showSuccess} onClose={() => {}}>
				<div className="text-center py-8 px-4">
					<div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckIcon size={50} className="text-white" />
					</div>

					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Order Placed Successfully.
					</h2>
					<p className="text-gray-600 mb-6">
						Thank you for your order. Your custom frame is now being prepared
						with love and care.
					</p>

					<div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
						<p className="text-sm font-semibold text-orange-800 mb-3">
							What happens next:
						</p>
						<ol className="space-y-2 text-sm text-gray-700">
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-5 h-5 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-xs font-bold">
									1
								</span>
								<span>We'll start printing your photos within 2 hours</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-5 h-5 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-xs font-bold">
									2
								</span>
								<span>
									Your frames will be carefully packaged and shipped within 24
									hours
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex-shrink-0 w-5 h-5 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-xs font-bold">
									3
								</span>
								<span>You'll receive tracking information via email</span>
							</li>
						</ol>
					</div>

					<div className="bg-gray-50 rounded-lg p-4 mb-6">
						<p className="text-sm font-semibold text-gray-700 mb-1">
							Estimated Delivery Time
						</p>
						<p className="text-lg font-bold text-primary">
							Friday, Sep 5, 2025
						</p>
					</div>

					<Button
						label="	Back to Dashboard"
						onClick={() => {
							setShowSuccess(false);
							navigate("/");
						}}
						className="w-full mt-4 bg-graydark py-4 hover:bg-graydark/90"
					/>
				</div>
			</Modal>
		</>
	);
};
export default CheckoutPage;
