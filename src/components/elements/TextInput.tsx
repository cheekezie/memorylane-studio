import type { HTMLInputTypeAttribute, ReactNode, ChangeEvent } from "react";

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
	type?: HTMLInputTypeAttribute;
	icon?: ReactNode;
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
	id = "myinput",
	value,
	icon,
	onChange,
}: prop) => {
	return (
		<div className="mb-4">
			{label && (
				<label htmlFor={id} className="block mb-2 text-sm text-gray-800">
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
					className={`block w-full border border-gray-600 rounded-[12px] py-3 px-4 pr-10 
						focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
				/>

				{icon && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
						{icon}
					</div>
				)}
			</div>
		</div>
	);
};

export default TextInput;
