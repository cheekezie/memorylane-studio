import { useState, useCallback, memo } from "react";
import Button from "../elements/Button";
import { Divider } from "antd";
import Register from "./Register";
import Login from "./Login";

type Step = "layout" | "register" | "login";

const AuthUserLayout = () => {
	const [step, setStep] = useState<Step>("layout");

	const handleShowRegister = useCallback(() => setStep("register"), []);
	const handleShowLogin = useCallback(() => setStep("login"), []);
	const handleBackToLayout = useCallback(() => setStep("layout"), []);

	return (
		<div className="w-full max-w-lg mx-auto p-2">
			{step === "layout" && (
				<section className="flex flex-col items-center">
					<header className="my-10 text-center">
						<h2 className="pb-2 text-xl md:text-2xl font-semibold tracking-wider">
							Create Your Account
						</h2>
						<p className="text-bodydark2 text-sm md:text-base">
							Enter your details to create your account
						</p>
					</header>

					<div className="w-full font-medium tracking-wider">
						<Button
							label="Continue with Google"
							size="md"
							className="px-10 w-full bg-bodydark/90 text-graydark"
						/>

						<Divider>or</Divider>

						<Button
							label="Register with Email"
							size="md"
							className="px-10 w-full"
							onClick={handleShowRegister}
						/>
					</div>

					<div className="my-6">
						<p>
							Already have an account?{" "}
							<button
								onClick={handleShowLogin}
								className="text-warning font-semibold"
							>
								Login
							</button>
						</p>
					</div>
				</section>
			)}

			{step === "register" && <Register onBack={handleBackToLayout} />}

			{step === "login" && <Login onBack={handleBackToLayout} />}
		</div>
	);
};

export default memo(AuthUserLayout);
