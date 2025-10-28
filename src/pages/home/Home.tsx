import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import LivePreview from "../../components/livePreview/LivePreview";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";
import type { ImageFile } from "../../types/interfaces/image.interface";
import { useCartStore } from "../../store";
import { ImageUpload } from "../../components/ImageUpload";
import { notification } from "antd";
import { ArtImage, UploadImage } from "../../assets";

const Home: React.FC = () => {
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [uploadType, setUploadType] = useState<"pictures" | "artwork" | null>(
		null,
	);
	const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
	const [showPreview, setShowPreview] = useState(false);

	const { addItem } = useCartStore();

	const handleCardClick = (type: "pictures" | "artwork") => {
		setUploadType(type);
		setShowUploadModal(true);
	};

	const handleUpload = (files: ImageFile[]) => {
		setUploadedImages(files);
		setShowPreview(true);
		setShowUploadModal(false);
	};

	const handleSaveCustomization = (
		image: ImageFile,
		customization: FrameCustomization,
	) => {
		addItem(image, customization);

		const isLast = uploadedImages[uploadedImages.length - 1].id === image.id;
		if (isLast) {
			notification.success({
				message: `${uploadedImages.length} item(s) added to cart!`,
			});

			setShowPreview(false);
			setUploadedImages([]);
			setUploadType(null);
		}
	};

	if (showPreview) {
		return (
			<LivePreview
				images={uploadedImages}
				onClose={() => {
					setShowPreview(false);
					setUploadedImages([]);
				}}
				onSave={handleSaveCustomization}
			/>
		);
	}

	/* ───────── Main UI ───── */
	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8 sm:mb-12">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
						What are you Framing Today
					</h1>
					<p className="text-sm sm:text-base text-gray-600">
						Add the image you want to frame.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
					<button
						onClick={() => handleCardClick("pictures")}
						className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
					>
						<div className="flex flex-col items-center gap-4">
							<div className="relative">
								<div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 p-1">
									<div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
										<img src={UploadImage} alt="upload-pictures" />
									</div>
								</div>
							</div>
							<div className="text-center">
								<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
									Pictures
								</h3>
								<p className="text-xs sm:text-sm text-gray-500">
									These are taken by you.
								</p>
							</div>
						</div>
					</button>

					<button
						onClick={() => handleCardClick("artwork")}
						className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
					>
						<div className="flex flex-col items-center gap-4">
							<div className="relative">
								<div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-red-400 to-red-600 p-1">
									<div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
										<img src={ArtImage} alt="upload-artwork" />
									</div>
								</div>
							</div>
							<div className="text-center">
								<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
									Art Work
								</h3>
								<p className="text-xs sm:text-sm text-gray-500">
									These are fancy art pieces.
								</p>
							</div>
						</div>
					</button>
				</div>

				<Modal
					isOpen={showUploadModal}
					onClose={() => {
						setShowUploadModal(false);
						setUploadType(null);
					}}
					title={`Upload ${uploadType === "pictures" ? "Pictures" : "Artwork"}`}
				>
					<ImageUpload
						onUpload={handleUpload}
						onClose={() => setShowUploadModal(false)}
					/>
				</Modal>
			</div>
		</div>
	);
};

export default Home;
