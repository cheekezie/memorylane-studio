import { Check } from "lucide-react";
import Button from "../elements/Button";

interface SuccessProps<T = any> {
	title?: string;
	subtitle?: string;
	buttonLabel?: string;
	onButtonClick?: (data?: T) => void;
	showButton?: boolean;
	data?: T;
}

function Success<T = any>({
	title = "Registration Successful!",
	subtitle = "We are excited to get you started as well. See you at the other side.",
	buttonLabel = "Continue",
	onButtonClick,
	showButton = true,
	data,
}: SuccessProps<T>) {
	const handleClick = () => {
		if (onButtonClick) {
			onButtonClick(data);
		}
	};

	return (
		<div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-between min-h-[80vh] py-12 px-4">
			<div className="flex flex-col items-center justify-center flex-1">
				<div className="relative mb-8">
					<div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center animate-bounce-scale">
						<div className="w-20 h-20 rounded-full bg-green flex items-center justify-center">
							<Check className="w-12 h-12 text-white" strokeWidth={3} />
						</div>
					</div>
					<div className="absolute inset-0 w-24 h-24 rounded-full bg-success/20 animate-ping"></div>
				</div>

				<h2 className="text-2xl md:text-3xl font-bold text-graydark dark:text-foreground mb-3 text-center font-sora">
					{title}
				</h2>

				<p className="text-sm md:text-base text-bodydark2 dark:text-bodydark text-center mb-8 font-poppins max-w-sm">
					{subtitle}
				</p>
			</div>

			{showButton && onButtonClick && (
				<div className="w-full flex justify-center mt-16 pb-4">
					<Button
						label={buttonLabel}
						onClick={handleClick}
						className="w-full sm:w-[80%] text-lg lg:w-[60%] py-4 bg-graydark text-white hover:bg-graydark/90"
					/>
				</div>
			)}
		</div>
	);
}
export default Success;
