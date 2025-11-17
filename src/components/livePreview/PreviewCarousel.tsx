import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import CanvasPreview from "./CanvasPreview";
import type { RefObject } from "react";

interface PreviewCarouselProps {
	images: ImageFile[];
	selectedImageIndex: number;
	editMode: "single" | "all";
	imageCustomizations: Record<string, FrameCustomization>;
	globalCustomization: FrameCustomization;
	onImageSelect: (index: number) => void;
	onImageRemove?: (id: string) => void;
	imageRefMap: RefObject<Map<string, HTMLDivElement>>;
	scrollContainerRef: RefObject<HTMLDivElement | null>;
	onAddMore?: () => void;
	mode?: "frame" | "gallery" | "art";
}

const PreviewCarousel: React.FC<PreviewCarouselProps> = ({
	images,
	selectedImageIndex,
	editMode,
	imageCustomizations,
	globalCustomization,
	onImageSelect,
	onImageRemove,
	imageRefMap,
	scrollContainerRef,
	onAddMore,
	mode = "gallery",
}) => {
	const scrollLeft = () => {
		scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
	};

	const getImageCustomization = (imageId: string) => {
		return editMode === "single" && imageCustomizations[imageId]
			? imageCustomizations[imageId]
			: globalCustomization;
	};

	return (
		<div className="h-full relative flex items-center justify-center">
			{images.length > 1 && (
				<>
					<button
						onClick={scrollLeft}
						className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 rounded-full shadow-xl hover:shadow-2xl transition-all backdrop-blur-sm hover:scale-110 hover:bg-white border border-gray-200"
						aria-label="Scroll left"
					>
						<ChevronLeft className="w-6 h-6 text-gray-700" />
					</button>

					<button
						onClick={scrollRight}
						className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 rounded-full shadow-xl hover:shadow-2xl transition-all backdrop-blur-sm hover:scale-110 hover:bg-white border border-gray-200"
						aria-label="Scroll right"
					>
						<ChevronRight className="w-6 h-6 text-gray-700" />
					</button>
				</>
			)}

			<div
				ref={scrollContainerRef}
				className="overflow-x-auto overflow-y-hidden scrollbar-hide h-[50vh] w-full flex items-center justify-start px-4 sm:px-6 lg:px-8"
			>
				{images.length === 0 ? (
					<div className="text-center py-20 mx-auto">
						<div
							onClick={onAddMore}
							className="group inline-flex flex-col items-center justify-center w-80 h-96 bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
						>
							<div className="p-8 bg-white rounded-full shadow-lg mb-8">
								<Plus className="w-16 h-16 text-gray-500 group-hover:text-gray-700" />
							</div>
							<h3 className="text-lg lg:text-2xl font-semibold text-gray-700 mb-2">
								Add Your First Image
							</h3>
						</div>
					</div>
				) : (
					// Normal image grid
					<div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
						{images.map((image, idx) => {
							const isSelected = selectedImageIndex === idx;
							const imgCustomization = getImageCustomization(image.id);
							return (
								<div
									key={image.id}
									ref={(el) => {
										if (el && imageRefMap.current) {
											imageRefMap.current.set(image.id, el);
										} else if (imageRefMap.current) {
											imageRefMap.current.delete(image.id);
										}
									}}
									className="flex-shrink-0"
								>
									<CanvasPreview
										imageUrl={image.url}
										customization={imgCustomization}
										width={280}
										isSelected={isSelected}
										editMode={editMode}
										onRemove={
											onImageRemove ? () => onImageRemove(image.id) : undefined
										}
										onClick={() => onImageSelect(idx)}
										index={idx}
										totalImages={images.length}
										mode={mode}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewCarousel;
