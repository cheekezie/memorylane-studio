import { Trash2, X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import {
	BORDERS,
	EFFECTS,
	FRAME_SIZES,
	FRAME_TYPES,
} from "../../constants/frameOptions";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import Button from "../elements/Button";
import InfoModal from "../InfoModal";

const LivePreview: React.FC<{
	images: ImageFile[];
	onClose: () => void;
	onSave: (image: ImageFile, customization: FrameCustomization) => void;
}> = ({ images: initialImages, onClose, onSave }) => {
	const [images, setImages] = useState(initialImages);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<
		"frameType" | "frameSize" | "border" | "effects"
	>("frameType");
	const [customization, setCustomization] = useState<FrameCustomization>({
		frameType: "black",
		frameSize: "30x20",
		border: "medium",
		effect: "none",
	});

	const fileInputRef = useRef<HTMLInputElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const selectedFrame = FRAME_TYPES.find(
		(f) => f.id === customization.frameType,
	);
	const selectedBorder = BORDERS.find((b) => b.id === customization.border);

	const removeImage = (id: string) => {
		const newImages = images.filter((img) => img.id !== id);
		setImages(newImages);
		if (selectedImageIndex >= newImages.length) {
			setSelectedImageIndex(Math.max(0, newImages.length - 1));
		}
	};

	const handleSave = () => {
		images.forEach((image) => {
			onSave(image, customization);
		});
		onClose();
	};

	const handleAddMoreClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const remainingSlots = 5 - images.length;
		const newImages: ImageFile[] = Array.from(files)
			.filter((file) => file.type.startsWith("image/"))
			.slice(0, remainingSlots)
			.map((file) => ({
				id: `img-${Date.now()}-${Math.random()}`,
				url: URL.createObjectURL(file),
				file,
			}));

		if (newImages.length > 0) {
			setImages((prev) => [...prev, ...newImages]);
		}
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
		}
	};

	const getEffectFilter = () => {
		switch (customization.effect) {
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

	if (images.length === 0) {
		return (
			<InfoModal
				open={true}
				redirectUrl="/"
				icon="🖼️"
				title="All Images Removed"
				message="Your preview gallery is now empty. You can go back to upload or explore more images."
				buttonLabel="Go Back"
			/>
		);
	}

	const tabs = [
		{ key: "frameType", label: "Frame", icon: "🖼️" },
		{ key: "frameSize", label: "Size", icon: "📏" },
		{ key: "border", label: "Border", icon: "⬜" },
		{ key: "effects", label: "Effect", icon: "✨" },
	];

	return (
		<div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-white flex flex-col">
			<div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex-shrink-0">
				<button
					onClick={onClose}
					className="p-2 hover:bg-gray-100 rounded-full transition-all"
					aria-label="Close"
				>
					<X className="w-5 h-5 text-gray-600" />
				</button>
				<h2 className="text-sm sm:text-base font-medium text-gray-700">
					Customize Frame
				</h2>
				<div className="flex items-center gap-2">
					{images.length < 5 && (
						<button
							onClick={handleAddMoreClick}
							className="p-2 hover:bg-gray-100 rounded-full transition-all"
							aria-label="Add more images"
							title="Add more"
						>
							<Plus className="w-5 h-5 text-gray-600" />
						</button>
					)}
					<Button
						label="Done"
						onClick={handleSave}
						size="sm"
						className="!px-4 sm:!px-6 !py-2 !text-sm"
					/>
				</div>
			</div>

			{/* Preview Area */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full relative">
					{images.length > 1 && (
						<>
							<button
								onClick={scrollLeft}
								className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
								aria-label="Scroll left"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								onClick={scrollRight}
								className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
								aria-label="Scroll right"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</>
					)}

					<div
						ref={scrollContainerRef}
						className={`h-full overflow-x-auto overflow-y-hidden scrollbar-hide ${
							images.length === 1
								? "flex items-center justify-center"
								: "flex items-center gap-4 px-16"
						}`}
					>
						{images.map((image, idx) => (
							<div
								key={image.id}
								className="relative group flex-shrink-0 h-full flex items-center"
							>
								<div
									className="relative rounded-lg overflow-hidden shadow-2xl transition-all duration-300 h-full"
									style={{
										padding: selectedBorder ? `${selectedBorder.width}px` : "0",
										backgroundColor: selectedFrame?.color || "#fff",
										width: images.length === 1 ? "auto" : "auto",
										maxWidth: images.length === 1 ? "500px" : "400px",
										maxHeight: "100%",
									}}
								>
									<img
										src={image.url}
										alt={`Preview ${idx + 1}`}
										className="w-full h-full object-contain"
										style={{
											filter: getEffectFilter(),
										}}
									/>
								</div>
								<button
									onClick={() => removeImage(image.id)}
									className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black backdrop-blur-sm"
									aria-label="Remove image"
								>
									<Trash2 className="w-4 h-4" />
								</button>

								{images.length > 1 && (
									<div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
										{idx + 1} / {images.length}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Toolbox */}
			<div className="bg-white border-t border-gray-200 shadow-xl">
				<div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-5">
					<div className="flex items-center justify-center gap-2 sm:gap-3 mb-5">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key as any)}
								className={`flex flex-col items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl transition-all ${
									activeTab === tab.key
										? "bg-primary/90 text-white shadow-lg scale-105"
										: "bg-gray-50 text-gray-600 hover:bg-gray-100"
								}`}
							>
								<span className="text-lg sm:text-xl">{tab.icon}</span>
								<span className="text-[10px] sm:text-xs font-medium">
									{tab.label}
								</span>
							</button>
						))}
					</div>

					<div className="relative">
						<div className="overflow-x-auto scrollbar-hide">
							<div className="flex gap-3 pb-2">
								{activeTab === "frameType" &&
									FRAME_TYPES.map((frame) => (
										<button
											key={frame.id}
											onClick={() =>
												setCustomization((prev) => ({
													...prev,
													frameType: frame.id,
												}))
											}
											className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[80px] ${
												customization.frameType === frame.id
													? "border-primary bg-primary/5 shadow-md"
													: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
											}`}
										>
											<div
												className="w-12 h-12 rounded-md border-4 shadow-sm"
												style={{
													borderColor: frame.color || "#e5e7eb",
													backgroundColor:
														frame.id === "none" ? "#f3f4f6" : "#fff",
												}}
											/>
											<span className="text-xs font-medium text-center text-gray-700">
												{frame.label}
											</span>
										</button>
									))}

								{activeTab === "frameSize" &&
									FRAME_SIZES.map((size) => (
										<button
											key={size.id}
											onClick={() =>
												setCustomization((prev) => ({
													...prev,
													frameSize: size.id,
												}))
											}
											className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[90px] ${
												customization.frameSize === size.id
													? "border-primary bg-primary/5 shadow-md"
													: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
											}`}
										>
											<div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center">
												<div className="w-10 h-10 border-2 border-gray-400" />
											</div>
											<span className="text-xs font-semibold text-gray-700">
												{size.label}
											</span>
											<span className="text-xs text-primary font-bold">
												${size.price}
											</span>
										</button>
									))}

								{activeTab === "border" &&
									BORDERS.map((border) => (
										<button
											key={border.id}
											onClick={() =>
												setCustomization((prev) => ({
													...prev,
													border: border.id,
												}))
											}
											className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[85px] ${
												customization.border === border.id
													? "border-primary bg-primary/5 shadow-md"
													: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
											}`}
										>
											<div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center">
												<div
													className="w-9 h-9 bg-white border-gray-400"
													style={{
														borderWidth: `${Math.max(border.width / 2, 1)}px`,
													}}
												/>
											</div>
											<span className="text-xs font-medium text-gray-700">
												{border.label}
											</span>
										</button>
									))}

								{activeTab === "effects" &&
									EFFECTS.map((effect) => (
										<button
											key={effect.id}
											onClick={() =>
												setCustomization((prev) => ({
													...prev,
													effect: effect.id,
												}))
											}
											className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[85px] ${
												customization.effect === effect.id
													? "border-primary bg-primary/5 shadow-md"
													: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
											}`}
										>
											<div className="w-14 h-14 rounded-md overflow-hidden shadow-sm">
												{images[0] && (
													<img
														src={images[0].url}
														alt={effect.label}
														className="w-full h-full object-cover"
														style={{
															filter:
																effect.id === "warm"
																	? "sepia(0.3) saturate(1.2)"
																	: effect.id === "sepia"
																	? "sepia(1)"
																	: effect.id === "tint"
																	? "hue-rotate(15deg)"
																	: effect.id === "bw"
																	? "grayscale(1)"
																	: effect.id === "maple"
																	? "contrast(1.1) brightness(1.05)"
																	: effect.id === "sedan"
																	? "contrast(0.9) brightness(0.95)"
																	: "none",
														}}
													/>
												)}
											</div>
											<span className="text-xs font-medium text-gray-700">
												{effect.label}
											</span>
										</button>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<style>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
};

export default LivePreview;
