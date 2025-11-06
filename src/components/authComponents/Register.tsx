import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import TextInput from "../elements/TextInput";
import Button from "../elements/Button";
import OTPAuth from "./OTPAuth";
import Success from "./Success";
import PasswordInput from "../elements/PasswordInputProps";
import { BackButton } from "../BackButton";

type Step = "form" | "otp" | "success";

interface PasswordRequirement {
	label: string;
	met: boolean;
}

interface RegisterProps {
	onBack?: () => void;
}

const Register = ({ onBack }: RegisterProps) => {
	const [step, setStep] = useState<Step>("form");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Password validation requirements
	const [requirements, setRequirements] = useState<PasswordRequirement[]>([
		{ label: "8 Characters", met: false },
		{ label: "1 Lower case", met: false },
		{ label: "1 Upper case", met: false },
		{ label: "1 Number", met: false },
		{ label: "1 Special Character (!@#$&)", met: false },
	]);

	// Validate password in real-time
	useEffect(() => {
		setRequirements([
			{ label: "8 Characters", met: password.length >= 8 },
			{ label: "1 Lower case", met: /[a-z]/.test(password) },
			{ label: "1 Upper case", met: /[A-Z]/.test(password) },
			{ label: "1 Number", met: /\d/.test(password) },
			{ label: "1 Special Character (!@#$&)", met: /[!@#$&]/.test(password) },
		]);
	}, [password]);

	const isPasswordValid = requirements.every((req) => req.met);
	const isFormValid = email && isPasswordValid && agreedToTerms;

	const handleSignUp = async () => {
		if (!isFormValid) return;

		setIsLoading(true);
		//  API call to register user
		setTimeout(() => {
			setIsLoading(false);
			setStep("otp");
		}, 1000);
	};

	const handleOTPChange = (value: string) => {
		setOtp(value);
		if (value.length === 4) {
			handleVerifyOTP(value);
		}
	};

	const handleVerifyOTP = async (otpValue: string) => {
		setIsLoading(true);
		// API call here but then
		console.log(otpValue);
		setTimeout(() => {
			setIsLoading(false);
			setStep("success");
		}, 1000);
	};

	const handleResendOTP = async () => {
		//  resend OTP call
		console.log(email);
	};

	// Step 1: Registration Form
	if (step === "form") {
		return (
			<div className="w-full">
				{onBack && <BackButton onClick={onBack} title="" className="mb-2" />}

				<header className="my-6 text-center">
					<h2 className="pb-2 text-xl md:text-2xl font-semibold tracking-wider">
						Create your Account
					</h2>
					<p className="text-bodydark2 text-sm md:text-base">
						Enter your details to create an account
					</p>
				</header>

				<div className="space-y-4">
					<TextInput
						label="Email"
						type="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<PasswordInput
						label="Password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{password && (
						<div className="mt-3 space-y-2">
							<p className="text-xs text-bodydark2 mb-2">
								Your password must contain the following:
							</p>
							<div className="grid grid-cols-2 gap-2">
								{requirements.map((req, index) => (
									<div key={index} className="flex items-center gap-2">
										<div
											className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
												req.met ? "bg-success" : "bg-gray-300"
											}`}
										>
											{req.met && <Check className="w-3 h-3 text-white" />}
										</div>
										<span
											className={`text-xs transition-colors ${
												req.met ? "text-success font-medium" : "text-bodydark2"
											}`}
										>
											{req.label}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Terms and Conditions */}
					<div className="flex items-center gap-2 mt-4">
						<input
							type="checkbox"
							id="terms"
							checked={agreedToTerms}
							onChange={(e) => setAgreedToTerms(e.target.checked)}
							className="mt-1 w-4 h-4 rounded border-gray-400 text-primary focus:ring-primary cursor-pointer"
						/>
						<label
							htmlFor="terms"
							className="text-xs text-bodydark2 cursor-pointer"
						>
							I agree to the{" "}
							<a
								href="#"
								className="text-warning font-semibold hover:underline"
							>
								Terms of Service
							</a>{" "}
							&{" "}
							<a
								href="#"
								className="text-warning font-semibold hover:underline"
							>
								Privacy Policies
							</a>
						</label>
					</div>

					<Button
						label={isLoading ? "Signing Up..." : "Sign Up"}
						size="md"
						onClick={handleSignUp}
						disabled={!isFormValid || isLoading}
						className={`w-full mt-6 transition-all ${
							!isFormValid ? "opacity-50 cursor-not-allowed" : ""
						}`}
					/>

					<div className="text-center mt-4">
						<p className="text-sm text-bodydark2">
							Already have an account?{" "}
							<button
								onClick={onBack}
								className="text-warning font-semibold hover:underline"
							>
								Login
							</button>
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Step 2: OTP Verification
	if (step === "otp") {
		return (
			<div className="w-full py-6">
				<BackButton
					onClick={() => setStep("form")}
					title="Back"
					className="mb-2"
				/>

				<header className="mb-6 text-center">
					<h2 className="pb-2 text-xl md:text-2xl font-semibold tracking-wider">
						OTP Verification
					</h2>
					<p className="text-bodydark2 text-sm md:text-base">
						Enter the 6 digits sent to {email}
					</p>
				</header>

				<div className="mb-6">
					<OTPAuth
						title=""
						subtitle=""
						length={4}
						onChange={handleOTPChange}
						onResend={handleResendOTP}
						isLoading={isLoading}
					/>
				</div>

				<Button
					label={isLoading ? "Verifying..." : "Sign Up"}
					size="md"
					onClick={() => handleVerifyOTP(otp)}
					disabled={otp.length !== 6 || isLoading}
					className={`w-full mt-6 transition-all ${
						otp.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
					}`}
				/>
			</div>
		);
	}

	// Step 3
	return (
		<Success
			title="Registration Successful!"
			subtitle="We are excited to get you started. Welcome aboard!"
			buttonLabel="Continue"
			onButtonClick={onBack}
			showButton={true}
		/>
	);
};

export default Register;
