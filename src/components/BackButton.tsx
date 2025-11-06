import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
	title?: string;
	subtitle?: string;
	href?: string;
	onClick?: () => void;
	className?: string;
	titleClassName?: string;
	subtitleClassName?: string;
	showIcon?: boolean;
	iconClassName?: string;
}

export function BackButton({
	title,
	subtitle,
	href,
	onClick,
	className = "",
	titleClassName = "",
	subtitleClassName = "",
	showIcon = true,
	iconClassName = "",
}: BackButtonProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (onClick) onClick();
		else if (href) navigate(href);
		else navigate(-1);
	};

	return (
		<div className={`my-2 ${className}`}>
			<button
				onClick={handleClick}
				className="flex items-center gap-2 text-bodydark2 hover:text-graydark transition-colors duration-300"
			>
				{showIcon && <ChevronLeft className={`w-5 h-5 ${iconClassName}`} />}
				{title && (
					<span className={`font-medium ${titleClassName}`}>{title}</span>
				)}
			</button>

			{subtitle && (
				<p className={`mt-2 text-sm text-bodydark2 ${subtitleClassName}`}>
					{subtitle}
				</p>
			)}
		</div>
	);
}
