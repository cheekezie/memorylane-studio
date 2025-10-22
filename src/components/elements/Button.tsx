import { SearchOutlined } from "@ant-design/icons";
import { tv } from "tailwind-variants";

interface ButtonProps {
	label?: React.ReactNode;
	theme?: "primary" | "secondary";
	size?: "lg" | "sm" | "md";
	full?: boolean;
	className?: string;
	search?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
	disabled?: boolean;
}

const Button = ({
	label,
	className,
	search,
	children,
	theme = "primary",
	size = "md",
	onClick,
	disabled = false,
}: ButtonProps) => {
	const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		if (onClick && !disabled) {
			onClick(event);
		}
	};

	const buttonV = tv({
		base: "flex items-center rounded-md text-sm justify-center transform transition-all duration-300 active:scale-[.98] active:duration-75",
		variants: {
			color: {
				primary: "bg-primary text-white",
				secondary: "bg-secondary text-white",
			},
			size: {
				sm: "py-2 px-8",
				md: "py-4 px-8",
				lg: "py-8 px-8 min-w-[100px]",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed hover:scale-100 pointer-events-none",
				false: "hover:scale-105 cursor-pointer",
			},
		},
		compoundVariants: [
			{
				color: "primary",
				disabled: true,
				className: "bg-primary/50",
			},
			{
				color: "secondary",
				disabled: true,
				className: "bg-secondary/50",
			},
		],
	});

	return (
		<button
			className={buttonV({
				color: theme,
				size,
				disabled,
				className,
			})}
			onClick={onButtonClick}
			disabled={disabled}
			aria-disabled={disabled}
		>
			{search && <SearchOutlined style={{ marginRight: "10px" }} />}
			{label}
			{children}
		</button>
	);
};

export default Button;
