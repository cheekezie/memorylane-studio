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
	const adjustBrightness = (color: string, percent: number): string => {
		if (!color) return "#ffffff";

		const num = parseInt(color.replace("#", ""), 16);
		const r = Math.min(255, Math.max(0, (num >> 16) + percent));
		const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
		const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));

		return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
	};

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
						<div className="flex gap-2 sm:gap-3 pb-1">
							{/* Frame Type Options */}
							{activeTab === "frameType" &&
								FRAME_TYPES.map((frame) => (
									<button
										key={frame.id}
										onClick={() =>
											onCustomizationUpdate({ frameType: frame.id })
										}
										className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[85px] sm:min-w-[95px] hover:scale-105 ${
											currentCustomization.frameType === frame.id
												? "border-primary bg-blue-50 shadow-lg scale-105"
												: "border-gray-200 hover:border-gray-300 bg-white"
										}`}
									>
										<div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
											{frame.id === "none" ? (
												<div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 border border-gray-300 flex items-center justify-center shadow-sm">
													<div className="w-8 h-8 bg-white" />
												</div>
											) : (
												<div
													className="relative w-11 h-11 sm:w-12 sm:h-12 shadow-lg"
													style={{
														backgroundColor: frame.color || "#e5e7eb",
														borderTop: `2px solid ${adjustBrightness(
															frame.color || "#e5e7eb",
															30,
														)}`,
														borderLeft: `2px solid ${adjustBrightness(
															frame.color || "#e5e7eb",
															30,
														)}`,
														borderBottom: `2px solid ${adjustBrightness(
															frame.color || "#e5e7eb",
															-40,
														)}`,
														borderRight: `2px solid ${adjustBrightness(
															frame.color || "#e5e7eb",
															-20,
														)}`,
													}}
												>
													<div
														className="absolute inset-[5px] bg-white"
														style={{
															boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
														}}
													/>
												</div>
											)}
										</div>
										<span className="text-[10px] sm:text-xs font-semibold text-center text-gray-700">
											{frame.label}
										</span>
									</button>
								))}

							{/* Frame Size Options */}
							{activeTab === "frameSize" &&
								FRAME_SIZES.map((size) => {
									const aspectW = size.ratio > 1 ? 48 : 40;
									const aspectH = size.ratio > 1 ? 48 / size.ratio : 40;

									return (
										<button
											key={size.id}
											onClick={() =>
												onCustomizationUpdate({ frameSize: size.id })
											}
											className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[90px] hover:scale-105 ${
												currentCustomization.frameSize === size.id
													? "border-primary bg-blue-50 shadow-lg scale-105"
													: "border-gray-200 hover:border-gray-300 bg-white"
											}`}
										>
											<div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center">
												<div
													className="border-[3px] border-gray-400 rounded-sm shadow-sm"
													style={{
														width: `${aspectW}px`,
														height: `${aspectH}px`,
													}}
												/>
											</div>
											<div className="text-center">
												<div className="text-[11px] sm:text-xs font-bold text-gray-800">
													{size.label}
												</div>
												<div className="text-[9px] text-gray-500">
													{size.description}
												</div>
											</div>
										</button>
									);
								})}

							{/* Border Options */}
							{activeTab === "border" &&
								BORDERS.map((border) => (
									<button
										key={border.id}
										onClick={() => onCustomizationUpdate({ border: border.id })}
										className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[85px] hover:scale-105 ${
											currentCustomization.border === border.id
												? "border-primary bg-blue-50 shadow-lg scale-105"
												: "border-gray-200 hover:border-gray-300 bg-white"
										}`}
									>
										<div className="w-14 h-14 bg-gray-700 flex items-center justify-center shadow-md">
											<div
												className="bg-white flex items-center justify-center"
												style={{
													width: border.width > 0 ? "44px" : "56px",
													height: border.width > 0 ? "44px" : "56px",
												}}
											>
												<div
													className="bg-gray-300"
													style={{
														width:
															border.width > 0
																? `${44 - border.width * 2}px`
																: "56px",
														height:
															border.width > 0
																? `${44 - border.width * 2}px`
																: "56px",
													}}
												/>
											</div>
										</div>
										<span className="text-[10px] sm:text-xs font-semibold text-gray-700">
											{border.label}
										</span>
									</button>
								))}

							{/* Effect Options */}
							{activeTab === "effects" &&
								EFFECTS.map((effect) => (
									<button
										key={effect.id}
										onClick={() => onCustomizationUpdate({ effect: effect.id })}
										className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[80px] hover:scale-105 ${
											currentCustomization.effect === effect.id
												? "border-primary bg-blue-50 shadow-lg scale-105"
												: "border-gray-200 hover:border-gray-300 bg-white"
										}`}
									>
										<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-md border border-gray-200">
											{effectPreviewUrl ? (
												<img
													src={effectPreviewUrl}
													alt={effect.label}
													className="w-full h-full object-cover"
													style={{
														filter: getEffectFilter(effect.id),
													}}
												/>
											) : (
												<div className="w-full h-full bg-gray-100" />
											)}
										</div>
										<span className="text-[10px] sm:text-xs font-semibold text-gray-700">
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
