import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
	currentStep: "cart" | "checkout";
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentStep }) => {
	const navigate = useNavigate();

	const steps = [
		{ id: "cart", label: "My Cart", path: "/cart" },
		{ id: "checkout", label: "Check Out", path: "/checkout" },
	] as const;

	const currentIdx = steps.findIndex((s) => s.id === currentStep);
	const safeIdx = currentIdx >= 0 ? currentIdx : 0;

	const goTo = (path: string, idx: number) => {
		if (idx <= safeIdx) {
			navigate(path);
		}
	};

	return (
		<nav
			aria-label="Breadcrumb"
			className="flex items-center gap-2 text-sm mb-6"
		>
			{steps.map((step, idx) => {
				const isActive = idx === safeIdx;
				const isCompleted = idx < safeIdx;
				const isClickable = idx <= safeIdx;

				return (
					<div key={step.id} className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => goTo(step.path, idx)}
							disabled={!isClickable}
							className={`
                transition-colors
                ${isActive ? "text-primary font-medium" : ""}
                ${isCompleted ? "text-primary/70 hover:text-primary" : ""}
                ${
									!isClickable
										? "text-gray-400 cursor-default"
										: "cursor-pointer hover:underline"
								}
              `}
							aria-current={isActive ? "step" : undefined}
						>
							{step.label}
						</button>

						{idx < steps.length - 1 && (
							<ChevronRight className="w-4 h-4 text-gray-400" />
						)}
					</div>
				);
			})}
		</nav>
	);
};

export default Breadcrumb;
