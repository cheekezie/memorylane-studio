// ArtCollections.tsx
import { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Button from "../../components/elements/Button";
import LivePreview from "../../components/livePreview/LivePreview";
import type { ImageFile } from "../../types/interfaces/image.interface";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import { useCartStore } from "../../store";
import { notification } from "antd";
import { CATEGORIES, NATURE_ART } from "../../db/ArtData";
import { remoteImageToFile } from "../../utils/helpers/ConvertImage";

const ArtCollections: React.FC = () => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [previewImages, setPreviewImages] = useState<ImageFile[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showPreview, setShowPreview] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);
	const { addItem } = useCartStore();

	const MAX = 6;
	const artworks = NATURE_ART;

	const toggleSelection = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((x) => x !== id)
				: prev.length < MAX
				? [...prev, id]
				: prev,
		);

		if (selectedIds.length === MAX && !selectedIds.includes(id)) {
			notification.warning({
				message: "Selection limit reached",
				description: `You can select up to ${MAX} artworks.`,
			});
		}
	};

	const handleContinue = async () => {
		if (selectedIds.length === 0)
			return notification.info({ message: "Select at least one artwork" });

		setIsLoading(true);
		try {
			const images = await Promise.all(
				selectedIds.map((id) => {
					const art = artworks.find((a) => a.id === id);
					if (!art) throw new Error("Art not found");
					return remoteImageToFile(art);
				}),
			);

			setPreviewImages(images);
			setShowPreview(true);
		} catch {
			notification.error({
				message: "Failed to load images. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = (image: ImageFile, customization: FrameCustomization) => {
		addItem(image, customization);
	};

	useEffect(() => {
		if (!showPreview && previewImages.length > 0) {
			previewImages.forEach((img) => URL.revokeObjectURL(img.url));
			setPreviewImages([]);
		}
	}, [showPreview]);

	const scroll = (direction: "left" | "right") => {
		scrollRef.current?.scrollBy({
			left: direction === "left" ? -240 : 240,
			behavior: "smooth",
		});
	};

	if (showPreview) {
		return (
			<LivePreview
				images={previewImages}
				onClose={() => setShowPreview(false)}
				onSave={handleSave}
				mode="art"
			/>
		);
	}

	// Main UI
	return (
		<div className="space-y-8 pb-8">
			<div className="text-center sm:text-left">
				<p className="text-lg text-gray-600">
					Select up to {MAX} artworks to frame
					<span className="ml-2 font-semibold text-primary">
						({selectedIds.length}/{MAX})
					</span>
				</p>
			</div>

			{/* Category */}
			<div className="relative">
				<button
					onClick={() => scroll("left")}
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl hidden sm:block"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<div
					ref={scrollRef}
					className="overflow-x-auto scrollbar-hide scroll-smooth"
				>
					<div className="flex gap-3 px-12">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								onClick={() => {}}
								className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-gray-100 hover:bg-gray-200"
							>
								{cat.label}
							</button>
						))}
					</div>
				</div>
				<button
					onClick={() => scroll("right")}
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl hidden sm:block"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>

			{/* Art Grid */}
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<p className="text-sm text-gray-500 mb-6">
					Click to select (multiple allowed)
				</p>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
					{artworks.map((art) => {
						const isSelected = selectedIds.includes(art.id);
						const order = selectedIds.indexOf(art.id) + 1;

						return (
							<button
								key={art.id}
								onClick={() => toggleSelection(art.id)}
								className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 ${
									isSelected
										? "ring-4 ring-primary shadow-2xl scale-105"
										: "hover:scale-105 hover:shadow-xl"
								}`}
							>
								<img
									src={art.url}
									alt={art.title}
									className="w-full h-full object-cover"
									loading="lazy"
								/>

								{isSelected && (
									<>
										<div className="absolute inset-0 bg-primary/30" />
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl">
												<Check className="w-8 h-8 text-white" strokeWidth={3} />
											</div>
										</div>
										<div className="absolute top-3 right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
											{order}
										</div>
									</>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex justify-end">
				<Button
					label={
						isLoading
							? "Preparing preview..."
							: `Frame ${selectedIds.length} artwork${
									selectedIds.length !== 1 ? "s" : ""
							  }`
					}
					onClick={handleContinue}
					disabled={selectedIds.length === 0 || isLoading}
					className="px-8 py-2 text-lg font-semibold"
				/>
			</div>
		</div>
	);
};

export default ArtCollections;
