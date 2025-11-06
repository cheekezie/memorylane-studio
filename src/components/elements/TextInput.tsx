import type { HTMLInputTypeAttribute, ChangeEvent } from "react";

interface prop {
	label?: string;
	placeholder?: string;
	name?: string;
	max?: number;
	min?: number;
	maxLength?: number;
	disabled?: boolean;
	id?: string;
	className?: string;
	labelClassName?: string;
	type?: HTMLInputTypeAttribute;
	icon?: React.ReactNode;
	mode?:
		| "none"
		| "text"
		| "tel"
		| "url"
		| "email"
		| "numeric"
		| "decimal"
		| "search"
		| undefined;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({
	label,
	type = "text",
	max,
	name,
	min,
	maxLength,
	mode,
	placeholder,
	className,
	labelClassName = "",
	id = "myinput",
	value,
	icon,
	disabled = false,
	onChange,
}: prop) => {
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
					name={name}
					id={id}
					inputMode={mode}
					min={min}
					max={max}
					maxLength={maxLength}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					disabled={disabled}
					className={`
						block w-full 
						border rounded-[12px]
						px-4 ${icon ? "py-4 pr-12" : "py-4"}
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
				{icon && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 text-bodydark2 dark:text-bodydark transition-colors">
						{icon}
					</div>
				)}
			</div>
		</div>
	);
};

export default TextInput;
