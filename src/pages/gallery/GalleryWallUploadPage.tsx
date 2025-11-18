import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import type {
	GalleryFrame,
	GalleryWallTemplate,
} from "../../types/interfaces/gallery.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import LivePreview from "../../components/livePreview/LivePreview";
import { useCartStore } from "../../store";

interface FrameUploadSlot extends GalleryFrame {
	image?: {
		id: string;
		file: File;
		url?: string;
	};
}

const GalleryWallUploadPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const selectedWall = location.state?.selectedWall as GalleryWallTemplate;
	const { addItem } = useCartStore();

	const [frameSlots, setFrameSlots] = useState<FrameUploadSlot[]>(
		selectedWall?.frames || [],
	);
	const [showPreview, setShowPreview] = useState(false);

	if (!selectedWall) {
		navigate("/gallery-wall");
		return null;
	}

	const handleImageUpload = (frameId: string, file: File) => {
		const id = `img-${Date.now()}-${Math.random()}`;
		const previewUrl = URL.createObjectURL(file);

		setFrameSlots((prev) =>
			prev.map((slot) =>
				slot.id === frameId
					? { ...slot, image: { id, file, url: previewUrl } }
					: slot,
			),
		);
	};

	const handleRemoveImage = (frameId: string) => {
		setFrameSlots((prev) =>
			prev.map((slot) =>
				slot.id === frameId ? { ...slot, image: undefined } : slot,
			),
		);
	};

	const allImagesUploaded = frameSlots.every((slot) => slot.image?.file);

	const handleContinue = () => {
		setShowPreview(true);
	};

	const handleSaveCustomization = (
		image: ImageFile,
		customization: FrameCustomization,
	) => {
		addItem(image, customization);
	};

	if (showPreview) {
		const imagesForPreview: ImageFile[] = frameSlots
			.filter(
				(
					slot,
				): slot is FrameUploadSlot & {
					image: NonNullable<FrameUploadSlot["image"]>;
				} => !!slot.image?.file,
			)
			.map((slot) => {
				const { id, file } = slot.image!;
				return {
					id,
					file,
					url: URL.createObjectURL(file),
				};
			});

		return (
			<LivePreview
				images={imagesForPreview}
				onClose={() => setShowPreview(false)}
				onSave={handleSaveCustomization}
				mode="gallery"
			/>
		);
	}

	return (
		<>
			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
					{selectedWall.name}
				</h1>
				<p className="text-gray-600">
					Upload photos for each frame (
					{frameSlots.filter((s) => s.image).length}/{selectedWall.totalFrames}{" "}
					completed)
				</p>
			</div>

			<div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
						{frameSlots.map((slot) => (
							<div key={slot.id} className="relative group">
								<div
									className={`aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all ${
										slot.image
											? "border-green-500 shadow-lg"
											: "border-dashed border-gray-300 bg-gray-50"
									}`}
								>
									{slot.image ? (
										<>
											<img
												src={slot.image.url}
												alt={`Frame ${slot.id}`}
												className="w-full h-full object-cover"
											/>
											<button
												onClick={() => handleRemoveImage(slot.id)}
												className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
											>
												<span className="text-lg font-medium">
													Change Photo
												</span>
											</button>
										</>
									) : (
										<label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-gray-100 transition-colors">
											<Upload className="w-10 h-10 text-gray-400 mb-3" />
											<span className="text-sm text-gray-500">{slot.size}</span>
											<span className="text-sm font-medium text-primary mt-1">
												Click to Upload
											</span>
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) handleImageUpload(slot.id, file);
												}}
											/>
										</label>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex gap-4 justify-end">
				<button
					onClick={() => navigate("/gallery-wall")}
					className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
				>
					Back
				</button>
				<button
					onClick={handleContinue}
					disabled={!allImagesUploaded}
					className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Continue to Customize
				</button>
			</div>
		</>
	);
};

export default GalleryWallUploadPage;
