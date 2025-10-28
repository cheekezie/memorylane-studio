import { ShoppingCart, ArrowRight } from "lucide-react";
import Button from "./elements/Button";

interface EmptyCartProps {
	title?: string;
	message?: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({
	title = "Your cart is empty",
	message = "Looks like you haven't added any framed photos yet. Start creating something beautiful!",
	ctaLabel = "Start Shopping",
	onCtaClick,
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
			<div className="relative mb-8">
				<div className="animate-bounce-soft">
					<ShoppingCart className="w-24 h-24 sm:w-32 sm:h-32 text-graydark/20 stroke-current" />
				</div>
				<div className="absolute -top-2 -right-2 w-8 h-8 bg-danger/10 rounded-full flex items-center justify-center animate-pulse">
					<span className="text-xs font-bold text-danger">0</span>
				</div>
			</div>

			<h2 className="text-title-lg sm:text-title-xl font-bold text-graydark mb-3">
				{title}
			</h2>
			<p className="text-sm sm:text-base text-bodydark max-w-md mx-auto mb-8">
				{message}
			</p>

			<Button
				onClick={onCtaClick}
				className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl shadow-card hover:shadow-4 hover:bg-primary/90 transition-all duration-200 transform hover:-translate-y-0.5"
			>
				<span>{ctaLabel}</span>
				<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
			</Button>

			<p className="mt-8 text-xs text-bodydark2">
				Pro tip: Upload up to 5 photos at once
			</p>
		</div>
	);
};
