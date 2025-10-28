"use client";

import { Fragment } from "react";
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";

interface Option {
	value: string;
	label: string;
}

interface SelectDropdownProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	placeholder?: string;
	disabled?: boolean;
}

export default function SelectDropdown({
	label,
	value,
	onChange,
	options,
	placeholder = "Select an option",
	disabled = false,
}: SelectDropdownProps) {
	return (
		<div className="w-full mb-5">
			{label && (
				<label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
					{label}
				</label>
			)}

			<Listbox value={value} onChange={onChange} disabled={disabled}>
				<div className="relative">
					<ListboxButton
						className={`
              relative w-full cursor-pointer rounded-[12px] bg-white dark:bg-[#1E1E1E]
              border border-gray-300 dark:border-gray-700
              py-[15px] pl-4 pr-10 text-left text-sm font-medium text-gray-800 dark:text-gray-100
              shadow-sm transition-all duration-300
              hover:border-gray-400 dark:hover:border-gray-500
              focus:outline-none focus:ring-1 focus:ring-primary/90
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
					>
						<span className="block truncate">
							{value
								? options.find((opt) => opt.value === value)?.label
								: placeholder}
						</span>
						<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
							<ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
						</span>
					</ListboxButton>

					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<ListboxOptions
							className="
                absolute z-10 mt-2 w-full rounded-xl bg-white dark:bg-[#1E1E1E]
                border border-gray-200 dark:border-gray-700 shadow-lg
                max-h-60 overflow-auto focus:outline-none
              "
						>
							{options.map((option) => (
								<ListboxOption
									key={option.value}
									value={option.value}
									className={({ active }) =>
										`relative cursor-pointer select-none py-3 pl-4 pr-10 text-sm transition-all
                    ${
											active
												? "bg-primary/10 text-primary dark:bg-primary/20"
												: "text-gray-800 dark:text-gray-100"
										}`
									}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected ? "font-semibold" : "font-normal"
												}`}
											>
												{option.label}
											</span>
											{selected && (
												<span className="absolute inset-y-0 right-3 flex items-center text-primary">
													<Check className="h-4 w-4" />
												</span>
											)}
										</>
									)}
								</ListboxOption>
							))}
						</ListboxOptions>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
}
