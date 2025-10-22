import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
	label?: string;
	placeholder?: string;
	id?: string;
	className?: string;
	labelClassName?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	name?: string;
}

const PasswordInput = ({
	label = "Password",
	placeholder = "••••••••",
	id = "password",
	className = "",
	labelClassName = "",
	value,
	onChange,
	disabled = false,
	name,
}: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="mb-4">
			{label && (
				<label
					htmlFor={id}
					className={`block mb-2 text-sm font-medium text-graydark dark:text-foreground transition-colors ${labelClassName}`}
				>
					{label}
				</label>
			)}
			<div className="relative">
				<input
					id={id}
					name={name}
					type={showPassword ? "text" : "password"}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					disabled={disabled}
					className={`
						block w-full 
						border rounded-[12px]
						px-4 py-4 pr-12
						text-sm font-poppins
						bg-white dark:bg-meta-4
						border-bodydark1 dark:border-meta-4
						text-graydark dark:text-foreground
						placeholder:text-bodydark2 dark:placeholder:text-bodydark
						transition-all duration-300
						hover:border-bodydark2 dark:hover:border-bodydark
						focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
						${
							disabled
								? "bg-bodydark1/30 dark:bg-meta-4/30 cursor-not-allowed opacity-60"
								: ""
						}
						${className}
					`}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					disabled={disabled}
					className={`
						absolute right-3 top-1/2 -translate-y-1/2 
						text-bodydark2 hover:text-graydark 
						dark:text-bodydark dark:hover:text-foreground 
						transition-colors
						${disabled ? "opacity-60 cursor-not-allowed" : ""}
					`}
					tabIndex={-1}
				>
					{showPassword ? (
						<EyeOff className="w-5 h-5" />
					) : (
						<Eye className="w-5 h-5" />
					)}
				</button>
			</div>
		</div>
	);
};

export default PasswordInput;
