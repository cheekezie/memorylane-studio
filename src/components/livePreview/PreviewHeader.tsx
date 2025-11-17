import { X } from "lucide-react";

interface PreviewHeaderProps {
	onClose: () => void;
	onSave: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ onClose, onSave }) => {
	return (
		<div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-white/90 backdrop-blur-md border-b border-gray-100 flex-shrink-0 shadow-sm">
			<button
				onClick={onClose}
				className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
				aria-label="Close"
			>
				<X className="w-5 h-5 text-gray-600" />
			</button>
			<h2 className="text-sm font-semibold text-gray-800 hidden sm:block">
				Customize Frames
			</h2>
			<button
				onClick={onSave}
				className="px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all"
			>
				Done
			</button>
		</div>
	);
};
export default PreviewHeader;
