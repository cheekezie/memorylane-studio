import { ImageIcon, Upload } from "lucide-react";
import type { ImageFile } from "../types/interfaces/image.interface";
import { useState } from "react";
import { fileToBase64 } from "../utils/helpers/ToBase64";

export const ImageUpload: React.FC<{
	onUpload: (files: ImageFile[]) => void;
	onClose: () => void;
}> = ({ onUpload, onClose }) => {
	const [dragActive, setDragActive] = useState(false);

	const handleFiles = async (files: FileList | null) => {
		if (!files) return;

		const imageFiles: ImageFile[] = await Promise.all(
			Array.from(files)
				.filter((file) => file.type.startsWith("image/"))
				.map(async (file) => {
					const base64 = await fileToBase64(file);
					return {
						id: `img-${Date.now()}-${Math.random()}`,
						url: base64,
						file,
					};
				}),
		);

		if (imageFiles.length > 0) {
			onUpload(imageFiles);
			onClose();
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		handleFiles(e.dataTransfer.files);
	};

	return (
		<div className="p-6">
			<div
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
					dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
				}`}
			>
				<div className="flex flex-col items-center gap-4">
					<div className="p-4 bg-gray-100 rounded-full">
						<Upload className="w-8 h-8 text-gray-600" />
					</div>
					<div>
						<label className="cursor-pointer">
							<span className="text-blue-600 font-semibold hover:underline">
								Click to upload photos
							</span>
							<input
								type="file"
								multiple
								accept="image/*"
								className="hidden"
								onChange={(e) => handleFiles(e.target.files)}
							/>
						</label>
					</div>
					<p className="text-sm text-gray-500">
						You can upload one or more, (just select them together).
					</p>
					<p className="text-xs text-gray-400">Supported formats: JPG, PNG</p>
				</div>
			</div>

			<button className="w-full mt-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
				<ImageIcon className="w-5 h-5" />
				<span>Import from Google Photos</span>
			</button>
		</div>
	);
};
