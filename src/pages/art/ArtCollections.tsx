import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Button from "../../components/elements/Button";
import LivePreview from "../../components/livePreview/LivePreview";
import type { ImageFile } from "../../types/interfaces/image.interface";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import { useCartStore } from "../../store";
import { notification } from "antd";
import { CATEGORIES, NATURE_ART } from "../../db/ArtData";

const ArtCollections: React.FC = () => {
	const [activeCategory, setActiveCategory] = useState("nature");
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const categoryScrollRef = useRef<HTMLDivElement>(null);
	const { addItem } = useCartStore();

	const MAX_SELECTION = 6;

	const getArtImages = () => {
		// to expand this later with different images per category
		return NATURE_ART;
	};

	const artImages = getArtImages();

	const handleImageSelect = (imageId: string) => {
		if (selectedImages.includes(imageId)) {
			setSelectedImages((prev) => prev.filter((id) => id !== imageId));
		} else {
			if (selectedImages.length < MAX_SELECTION) {
				setSelectedImages((prev) => [...prev, imageId]);
			} else {
				notification.warning({
					message: `Maximum ${MAX_SELECTION} images allowed`,
					description: "Please deselect an image before selecting another.",
				});
			}
		}
	};

	const handleContinue = () => {
		if (selectedImages.length === 0) {
			notification.info({
				message: "No images selected",
				description: "Please select at least one image to continue.",
			});
			return;
		}
		setShowPreview(true);
	};

	const handleSaveCustomization = (
		image: ImageFile,
		customization: FrameCustomization,
	) => {
		addItem(image, customization);

		const selectedImageFiles = selectedImages.map((id) => {
			const artImage = artImages.find((img) => img.id === id);
			return artImage;
		});

		const isLast =
			selectedImageFiles[selectedImageFiles.length - 1]?.id === image.id;

		if (isLast) {
			notification.success({
				message: `${selectedImages.length} art piece(s) added to cart!`,
			});

			setShowPreview(false);
			setSelectedImages([]);
		}
	};

	const scrollCategories = (direction: "left" | "right") => {
		if (categoryScrollRef.current) {
			const scrollAmount = 200;
			categoryScrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	if (showPreview) {
		const selectedImageFiles: ImageFile[] = selectedImages.map((id) => {
			const artImage = artImages.find((img) => img.id === id);
			return {
				id: artImage!.id,
				url: artImage!.url,
			};
		});

		return (
			<LivePreview
				images={selectedImageFiles}
				onClose={() => setShowPreview(false)}
				onSave={handleSaveCustomization}
				mode="art"
			/>
		);
	}

	return (
		<div className="space-y-6">
			={" "}
			<div>
				<p className="text-gray-600">
					Select up to {MAX_SELECTION} artworks to frame (
					{selectedImages.length}/{MAX_SELECTION} selected)
				</p>
			</div>
			{/* Categories*/}
			<div className="relative">
				<button
					onClick={() => scrollCategories("left")}
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hidden sm:block"
					aria-label="Scroll left"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>

				<div
					ref={categoryScrollRef}
					className="overflow-x-auto scrollbar-hide scroll-smooth"
				>
					<div className="flex gap-2 px-8 sm:px-12">
						{CATEGORIES.map((category) => (
							<button
								key={category.id}
								onClick={() => setActiveCategory(category.id)}
								className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
									activeCategory === category.id
										? "bg-primary text-white shadow-md"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{category.label}
							</button>
						))}
					</div>
				</div>

				<button
					onClick={() => scrollCategories("right")}
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hidden sm:block"
					aria-label="Scroll right"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
			{/* Art Grid */}
			<div className="bg-white rounded-lg p-6 shadow-sm">
				<p className="text-sm text-gray-500 mb-4">
					You can select more than 1 Art
				</p>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{artImages.map((image) => {
						const isSelected = selectedImages.includes(image.id);

						return (
							<div
								key={image.id}
								onClick={() => handleImageSelect(image.id)}
								className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
									isSelected
										? "ring-4 ring-primary shadow-xl scale-105"
										: "hover:scale-105 hover:shadow-lg"
								}`}
							>
								<img
									src={image.url}
									alt={image.title}
									className="w-full h-full object-cover"
									loading="lazy"
								/>

								{isSelected && (
									<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
										<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
											<Check className="w-6 h-6 text-white" strokeWidth={3} />
										</div>
									</div>
								)}

								{isSelected && (
									<div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
										{selectedImages.indexOf(image.id) + 1}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex gap-4 justify-end">
				<Button
					label={`Continue with ${selectedImages.length} image${
						selectedImages.length !== 1 ? "s" : ""
					}`}
					onClick={handleContinue}
					disabled={selectedImages.length === 0}
					className="!px-6 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
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

export default ArtCollections;
