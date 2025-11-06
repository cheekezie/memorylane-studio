import { useState, useEffect } from "react";
import { Input } from "antd";

interface OTPAuthProps {
	title?: string;
	subtitle?: string;
	length?: number;
	onChange?: (otp: string) => void;
	onResend?: () => void;
	isLoading?: boolean;
}

function OTPAuth({
	title = "Authentication",
	subtitle = "We just sent an OTP to your phone number. Enter the code to verify your account.",
	length = 6,
	onChange,
	onResend,
	isLoading = false,
}: OTPAuthProps) {
	const [otp, setOtp] = useState("");
	const [countdown, setCountdown] = useState(300);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	// Handlers
	const handleChange = (value: string) => {
		const numericValue = value.replace(/\D/g, "");
		setOtp(numericValue);
		onChange?.(numericValue);
	};

	const handleResend = () => {
		if (countdown === 0 && onResend) {
			setCountdown(300);
			setOtp("");
			onResend();
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<h2 className="text-xl font-bold text-graydark dark:text-foreground mb-2 font-sora">
				{title}
			</h2>
			<p className="text-sm text-bodydark2 dark:text-bodydark mb-6 font-poppins">
				{subtitle}
			</p>

			<div className="flex justify-center mb-6">
				<Input.OTP
					length={length}
					value={otp}
					onChange={handleChange}
					disabled={isLoading}
					size="large"
					className="otp-input"
					formatter={(str) => str.replace(/\D/g, "")}
				/>
			</div>

			{/* Resend Timer */}
			<div className="text-center mb-6">
				{countdown > 0 ? (
					<p className="text-sm text-bodydark2 dark:text-bodydark font-poppins">
						Resend code in{" "}
						<span className="font-semibold text-primary">
							{formatTime(countdown)}
						</span>
					</p>
				) : (
					<button
						onClick={handleResend}
						className="text-sm text-primary font-semibold hover:underline transition-all font-poppins"
						disabled={isLoading}
					>
						Resend code
					</button>
				)}
			</div>
		</div>
	);
}
export default OTPAuth;
