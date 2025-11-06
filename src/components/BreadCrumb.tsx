import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbStep {
	id: string;
	label: string;
	path?: string | null;
}

interface BreadcrumbProps {
	steps?: BreadcrumbStep[];
	currentStepId: string;
	onStepClick?: (step: BreadcrumbStep) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
	steps = [],
	currentStepId,
	onStepClick,
}) => {
	const navigate = useNavigate();

	const currentIdx = steps.findIndex((s) => s.id === currentStepId);
	const safeIdx = currentIdx >= 0 ? currentIdx : 0;

	const handleStepClick = (step: BreadcrumbStep, idx: number) => {
		if (idx > safeIdx) return;
		if (onStepClick) {
			onStepClick(step);
		} else if (step.path) {
			navigate(step.path);
		}
	};

	return (
		<nav
			aria-label="Breadcrumb"
			className="flex items-center gap-2 text-sm mb-6 flex-wrap"
		>
			{steps.map((step, idx) => {
				const isActive = idx === safeIdx;
				const isCompleted = idx < safeIdx;
				const isClickable = idx <= safeIdx && !!step.path;

				return (
					<div key={step.id} className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => handleStepClick(step, idx)}
							disabled={!isClickable}
							className={`
                transition-colors text-left
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
							<ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
						)}
					</div>
				);
			})}
		</nav>
	);
};

export default Breadcrumb;
