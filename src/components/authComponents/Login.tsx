import { useState } from "react";
import TextInput from "../elements/TextInput";
import Button from "../elements/Button";
import { BackButton } from "../BackButton";
import PasswordInput from "../elements/PasswordInputProps";

interface LoginProps {
	onBack: () => void;
}

const Login = ({ onBack }: LoginProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const isFormValid = email && password;

	const handleLogin = async () => {
		if (!isFormValid) return;

		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);

			window.location.href = "/";
		}, 1000);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && isFormValid) {
			handleLogin();
		}
	};

	return (
		<div className="w-full">
			<BackButton onClick={onBack} title="" className="mb-2" />

			<header className="my-6 text-center">
				<h2 className="pb-2 text-xl md:text-2xl font-semibold tracking-wider">
					Login
				</h2>
				<p className="text-bodydark2 text-sm md:text-base">
					Enter your details to login into your account.
				</p>
			</header>

			<div className="space-y-4" onKeyPress={handleKeyPress}>
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

				<div className="flex justify-end">
					<button className="text-sm text-warning font-semibold hover:underline">
						Forgot Password?
					</button>
				</div>

				<Button
					label={isLoading ? "Signing In..." : "Sign Up"}
					size="md"
					onClick={handleLogin}
					disabled={!isFormValid || isLoading}
					className={`w-full mt-6 transition-all ${
						!isFormValid ? "opacity-50 cursor-not-allowed" : ""
					}`}
				/>

				<div className="text-center mt-4">
					<p className="text-sm text-bodydark2">
						New User?{" "}
						<button
							onClick={onBack}
							className="text-warning font-semibold hover:underline"
						>
							Sign Up
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
