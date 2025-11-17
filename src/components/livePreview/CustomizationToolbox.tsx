import { Plus } from "lucide-react";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import { tabs } from "../../db/PreviewData";
import {
	BORDERS,
	EFFECTS,
	FRAME_SIZES,
	FRAME_TYPES,
} from "../../constants/frameOptions";

interface CustomizationToolboxProps {
	images: ImageFile[];
	selectedImageIndex: number;
	editMode: "single" | "all";
	activeTab: "frameType" | "frameSize" | "border" | "effects";
	currentCustomization: FrameCustomization;
	maxImages: number;
	mode: "frame" | "gallery" | "art";
	onEditModeChange: (mode: "single" | "all") => void;
	onTabChange: (tab: "frameType" | "frameSize" | "border" | "effects") => void;
	onCustomizationUpdate: (updates: Partial<FrameCustomization>) => void;
	onAddMore: () => void;
}

const CustomizationToolbox: React.FC<CustomizationToolboxProps> = ({
	images,
	selectedImageIndex,
	editMode,
	activeTab,
	currentCustomization,
	maxImages,
	mode,
	onEditModeChange,
	onTabChange,
	onCustomizationUpdate,
	onAddMore,
}) => {
	const getEffectFilter = (effect: string) => {
		switch (effect) {
			case "warm":
				return "sepia(0.3) saturate(1.2)";
			case "sepia":
				return "sepia(1)";
			case "tint":
				return "hue-rotate(15deg)";
			case "bw":
				return "grayscale(1)";
			case "maple":
				return "contrast(1.1) brightness(1.05)";
			case "sedan":
				return "contrast(0.9) brightness(0.95)";
			default:
				return "none";
		}
	};

	const effectPreviewUrl =
		editMode === "single" && images[selectedImageIndex]
			? images[selectedImageIndex].url
			: images[0]?.url;

	return (
		<div className="bg-white border-t border-gray-200 shadow-2xl flex-shrink-0">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
				<div className="flex items-center justify-between mb-3 gap-2">
					{images.length > 1 && (
						<div className="flex bg-gray-100 rounded-lg p-0.5">
							<button
								onClick={() => onEditModeChange("all")}
								className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
									editMode === "all"
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Edit All
							</button>
							<button
								onClick={() => onEditModeChange("single")}
								className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
									editMode === "single"
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Selected
							</button>
						</div>
					)}

					<div className="flex-1" />

					{mode === "frame" &&
						images.length > 0 &&
						images.length < maxImages && (
							<button
								onClick={onAddMore}
								className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-all text-xs font-semibold"
							>
								<Plus className="w-6 h-6" />
								<span className="hidden sm:inline">Add More</span>
								<span className="text-[10px] sm:text-xs">
									({images.length}/{maxImages})
								</span>
							</button>
						)}
				</div>

				<div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.key}
								onClick={() => onTabChange(tab.key as any)}
								className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all ${
									activeTab === tab.key
										? "bg-primary text-white shadow-md scale-105"
										: "bg-gray-50 text-gray-600 hover:bg-gray-100"
								}`}
							>
								<Icon className="w-5 h-5 sm:w-6 sm:h-6" />
								<span className="text-[9px] sm:text-[10px] font-medium">
									{tab.label}
								</span>
							</button>
						);
					})}
				</div>

				<div className="relative">
					<div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
						<div className="flex gap-2 pb-1">
							{activeTab === "frameType" &&
								FRAME_TYPES.map((frame) => (
									<button
										key={frame.id}
										onClick={() =>
											onCustomizationUpdate({ frameType: frame.id })
										}
										className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-lg border-2 transition-all min-w-[65px] sm:min-w-[70px] ${
											currentCustomization.frameType === frame.id
												? "border-primary/80 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div
											className="w-6 h-6 rounded border-[3px] shadow-sm"
											style={{
												borderColor: frame.color || "#e5e7eb",
												backgroundColor:
													frame.id === "none" ? "#f3f4f6" : "#fff",
											}}
										/>
										<span className="text-[9px] sm:text-[10px] font-medium text-center text-gray-700">
											{frame.label}
										</span>
									</button>
								))}

							{activeTab === "frameSize" &&
								FRAME_SIZES.map((size) => (
									<button
										key={size.id}
										onClick={() =>
											onCustomizationUpdate({ frameSize: size.id })
										}
										className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-lg border-2 transition-all min-w-[70px] sm:min-w-[75px] ${
											currentCustomization.frameSize === size.id
												? "border-primary/80 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-50 rounded flex items-center justify-center">
											<div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-400" />
										</div>
										<span className="text-[9px] sm:text-[10px] font-semibold text-gray-700">
											{size.label}
										</span>
									</button>
								))}

							{activeTab === "border" &&
								BORDERS.map((border) => (
									<button
										key={border.id}
										onClick={() => onCustomizationUpdate({ border: border.id })}
										className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-lg border-2 transition-all min-w-[70px] ${
											currentCustomization.border === border.id
												? "border-primary/80 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-50 rounded flex items-center justify-center">
											<div
												className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-gray-400"
												style={{
													borderWidth: `${Math.max(border.width / 2, 1)}px`,
												}}
											/>
										</div>
										<span className="text-[9px] sm:text-[10px] font-medium text-gray-700">
											{border.label}
										</span>
									</button>
								))}

							{activeTab === "effects" &&
								EFFECTS.map((effect) => (
									<button
										key={effect.id}
										onClick={() => onCustomizationUpdate({ effect: effect.id })}
										className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-2.5 rounded-lg border-2 transition-all min-w-[70px] ${
											currentCustomization.effect === effect.id
												? "border-primary/80 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="w-10 h-10 sm:w-11 sm:h-11 rounded overflow-hidden shadow-sm">
											{effectPreviewUrl && (
												<img
													src={effectPreviewUrl}
													alt={effect.label}
													className="w-full h-full object-cover"
													style={{
														filter: getEffectFilter(effect.id),
													}}
												/>
											)}
										</div>
										<span className="text-[9px] sm:text-[10px] font-medium text-gray-700">
											{effect.label}
										</span>
									</button>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CustomizationToolbox;
