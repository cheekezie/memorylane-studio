import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import PreviewHeader from "./PreviewHeader";
import PreviewCarousel from "./PreviewCarousel";
import CustomizationToolbox from "./CustomizationToolbox";
import { notification } from "antd";

interface LivePreviewProps {
	images: ImageFile[];
	onClose: () => void;
	onSave: (image: ImageFile, customization: FrameCustomization) => void;
	mode?: "frame" | "gallery" | "art";
	maxImages?: number;
}

const LivePreview: React.FC<LivePreviewProps> = ({
	images: initialImages,
	onClose,
	onSave,
	mode = "frame",
	maxImages = 5,
}) => {
	const [imageFiles, setImageFiles] = useState<{ file: File; id: string }[]>(
		initialImages.map((img) => ({
			id: img.id,
			file: img.file!,
		})),
	);

	const [imageUrls, setImageUrls] = useState<string[]>([]);

	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<
		"frameType" | "frameSize" | "border" | "effects"
	>("frameType");
	const [imageCustomizations, setImageCustomizations] = useState<
		Record<string, FrameCustomization>
	>({});
	const [globalCustomization, setGlobalCustomization] =
		useState<FrameCustomization>({
			frameType: "black",
			frameSize: "30x20",
			border: "medium",
			effect: "none",
		});
	const [editMode, setEditMode] = useState<"single" | "all">("all");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const imageRefMap = useRef<Map<string, HTMLDivElement>>(new Map());

	useEffect(() => {
		const urls = imageFiles.map(({ file }) => URL.createObjectURL(file));
		setImageUrls(urls);

		return () => {
			urls.forEach(URL.revokeObjectURL);
		};
	}, [imageFiles]);

	const images = useMemo(() => {
		return imageFiles.map((item, i) => ({
			id: item.id,
			url: imageUrls[i] || "",
			file: item.file,
		}));
	}, [imageFiles, imageUrls]);

	const currentCustomization = useMemo(() => {
		if (editMode === "single") {
			const imageId = images[selectedImageIndex]?.id;
			if (imageId && imageCustomizations[imageId]) {
				return imageCustomizations[imageId];
			}
			return globalCustomization;
		}
		return globalCustomization;
	}, [
		editMode,
		selectedImageIndex,
		imageCustomizations,
		globalCustomization,
		images,
	]);

	const scrollToImage = useCallback((imageId: string) => {
		const el = imageRefMap.current.get(imageId);
		if (el && scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const targetCenter = el.offsetLeft + el.offsetWidth / 2;
			const containerCenter = container.clientWidth / 2;
			container.scrollTo({
				left: targetCenter - containerCenter,
				behavior: "smooth",
			});
		}
	}, []);

	useEffect(() => {
		if (editMode === "single" && images[selectedImageIndex]) {
			scrollToImage(images[selectedImageIndex].id);
		}
	}, [selectedImageIndex, editMode, images, scrollToImage]);

	const updateCustomization = (updates: Partial<FrameCustomization>) => {
		if (editMode === "single") {
			const imageId = images[selectedImageIndex]?.id;
			if (!imageId) return;
			setImageCustomizations((prev) => ({
				...prev,
				[imageId]: {
					...(prev[imageId] || globalCustomization),
					...updates,
				},
			}));
		} else {
			setGlobalCustomization((prev) => ({ ...prev, ...updates }));
		}
	};

	const handleEditModeChange = (newMode: "single" | "all") => {
		setEditMode(newMode);
	};

	const handleImageRemove = (imageId: string) => {
		setImageFiles((prev) => prev.filter((img) => img.id !== imageId));
		setImageCustomizations((prev) => {
			const next = { ...prev };
			delete next[imageId];
			return next;
		});
		if (selectedImageIndex >= imageFiles.length - 1) {
			setSelectedImageIndex(Math.max(0, imageFiles.length - 2));
		}
	};

	const handleAddMore = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const remaining = maxImages - imageFiles.length;
		const newFiles = Array.from(files).slice(0, remaining);

		const newImageFiles = newFiles.map((file) => ({
			id: `${Date.now()}-${Math.random()}`,
			file,
		}));

		setImageFiles((prev) => [...prev, ...newImageFiles]);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSave = () => {
		images.forEach((image) => {
			const customization =
				editMode === "single" && imageCustomizations[image.id]
					? imageCustomizations[image.id]
					: globalCustomization;

			onSave(image, customization);
		});

		onClose();

		const count = images.length;
		const isPlural = count > 1;
		const photoText = isPlural ? "photos" : "photo";
		const artText = isPlural ? "artworks" : "artwork";

		notification.success({
			message:
				mode === "gallery"
					? `Gallery wall with ${count} framed ${photoText} added to cart!`
					: mode === "art"
					? `${count} framed ${artText} added to cart!`
					: `${count} framed ${photoText} added to cart!`,
			placement: "top",
			duration: 4,
		});
	};

	const handleImageReplace = (
		oldImageId: string,
		newUrl: string,
		newFile: File,
	) => {
		setImageFiles((prev) => {
			const index = prev.findIndex((img) => img.id === oldImageId);
			if (index === -1) return prev;

			const updated = [...prev];
			updated[index] = {
				id: oldImageId,
				file: newFile,
			};

			const oldUrl = imageUrls[index];
			if (oldUrl) {
				URL.revokeObjectURL(oldUrl);
			}

			return updated;
		});

		// Force re-render
		setImageUrls((prev) => {
			const updated = [...prev];
			updated[prev.findIndex((_, i) => imageFiles[i]?.id === oldImageId)] =
				newUrl;
			return updated;
		});
	};

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-50 flex flex-col">
			<PreviewHeader onClose={onClose} onSave={handleSave} />

			<div className="flex-1 overflow-hidden">
				<PreviewCarousel
					images={images}
					selectedImageIndex={selectedImageIndex}
					editMode={editMode}
					imageCustomizations={imageCustomizations}
					globalCustomization={globalCustomization}
					onImageSelect={setSelectedImageIndex}
					onImageRemove={mode === "frame" ? handleImageRemove : undefined}
					imageRefMap={imageRefMap}
					scrollContainerRef={scrollContainerRef}
					onAddMore={handleAddMore}
					mode={mode}
					onImageReplace={handleImageReplace}
				/>
			</div>

			<CustomizationToolbox
				images={images}
				selectedImageIndex={selectedImageIndex}
				editMode={editMode}
				activeTab={activeTab}
				currentCustomization={currentCustomization}
				maxImages={maxImages}
				mode={mode}
				onEditModeChange={handleEditModeChange}
				onTabChange={setActiveTab}
				onCustomizationUpdate={updateCustomization}
				onAddMore={handleAddMore}
			/>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileChange}
				className="hidden"
			/>
		</div>
	);
};

export default LivePreview;
