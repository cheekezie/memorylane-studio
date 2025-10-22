import { useRef, useState, useEffect } from "react";

interface MenuOptionList {
	label: string;
	action: () => void;
}

interface DynamicMenuProps {
	options: MenuOptionList[];
}

export default function MenuOption({ options }: DynamicMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={menuRef} className="relative inline-block text-left">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="inline-flex w-10 h-10 items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
			>
				<svg
					className="w-5 h-5 text-gray-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4 6h16M4 12h16m-7 6h7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
					<div className="py-1 z-[10]">
						{options.map((option, index) => (
							<button
								key={index}
								onClick={option.action}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
