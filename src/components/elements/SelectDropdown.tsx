import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
	label?: string;
	placeholder?: string;
	name?: string;
	id?: string;
	className?: string;
	labelClassName?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string; label: string }[];
	disabled?: boolean;
}

const SelectDropdown = ({
	label,
	placeholder = "Select an option",
	name,
	id = "myselect",
	className = "",
	labelClassName = "",
	value,
	onChange,
	options,
	disabled = false,
}: SelectProps) => {
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
				<select
					name={name}
					id={id}
					value={value}
					onChange={onChange}
					disabled={disabled}
					className={`
						block w-full appearance-none
						px-4 py-3 pr-10
						text-sm font-poppins
						bg-white dark:bg-meta-4
						border-2 rounded-xl
						border-bodydark1 dark:border-meta-4
						transition-all duration-300
						cursor-pointer
						hover:border-bodydark2 dark:hover:border-bodydark
						focus:border-primary focus:ring-2 focus:ring-primary/20
						${
							disabled
								? "bg-bodydark1/30 dark:bg-meta-4/30 cursor-not-allowed opacity-60"
								: ""
						}
						text-graydark dark:text-foreground
						focus:outline-none
						placeholder:text-bodydark2 dark:placeholder:text-bodydark
						${className}
					`}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				{/* Custom Dropdown Arrow */}
				<div
					className={`
						absolute right-3 top-1/2 -translate-y-1/2
						pointer-events-none
						transition-colors duration-300
						text-bodydark2 dark:text-bodydark
						${disabled ? "opacity-40" : ""}
					`}
				>
					<ChevronDown className="w-5 h-5" />
				</div>
			</div>
		</div>
	);
};

export default SelectDropdown;
