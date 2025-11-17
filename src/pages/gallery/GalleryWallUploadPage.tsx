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
import { notification } from "antd";

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
				slot.id === frameId
					? {
							...slot,
							image: undefined,
					  }
					: slot,
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

		const uploadedCount = frameSlots.filter((s) => s.image).length;
		notification.success({
			message: `Frame ${uploadedCount} customized and added!`,
		});

		if (uploadedCount === frameSlots.length) {
			notification.success({
				message: `Gallery wall with ${uploadedCount} frames added to cart!`,
			});
			navigate("/gallery-wall");
		}
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

				const url = URL.createObjectURL(file);

				return {
					id,
					file,
					url,
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
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{frameSlots.map((slot) => (
							<div key={slot.id} className="relative">
								<div
									className={`aspect-[3/4] rounded-lg border-2 overflow-hidden ${
										slot.image
											? "border-green-500"
											: "border-dashed border-gray-300"
									} bg-gray-50 flex flex-col items-center justify-center relative group`}
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
												className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
											>
												<span className="text-sm font-medium">Change</span>
											</button>
										</>
									) : (
										<label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
											<Upload className="w-8 h-8 text-gray-400 mb-2" />
											<span className="text-xs text-gray-500 mb-1">
												{slot.size}
											</span>
											<span className="text-xs text-primary font-medium">
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
					className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
				>
					Back
				</button>
				<button
					onClick={handleContinue}
					disabled={!allImagesUploaded}
					className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Continue to Customize
				</button>
			</div>
		</>
	);
};

export default GalleryWallUploadPage;
