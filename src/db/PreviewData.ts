import { Frame, Ruler, SquareStack, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = {
	key: "frameType" | "frameSize" | "border" | "effects";
	label: string;
	icon: LucideIcon;
};

export const tabs: Tab[] = [
	{
		key: "frameType",
		label: "Frame",
		icon: Frame,
	},
	{
		key: "frameSize",
		label: "Size",
		icon: Ruler,
	},
	{
		key: "border",
		label: "Border",
		icon: SquareStack,
	},
	{
		key: "effects",
		label: "Effect",
		icon: Sparkles,
	},
];
