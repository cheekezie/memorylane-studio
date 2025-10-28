import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./elements/Button";

interface InfoModalProps {
	open: boolean;
	onClose?: () => void;
	icon?: React.ReactNode;
	title: string;
	message: string;
	buttonLabel?: string;
	buttonClassName?: string;
	redirectUrl?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
	open,
	onClose,
	icon = "🖼️",
	title,
	message,
	buttonLabel = "OK",
	buttonClassName,
	redirectUrl,
}) => {
	if (!open) return null;

	const handleRedirect = () => {
		if (redirectUrl) {
			window.location.href = redirectUrl;
		} else if (onClose) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
					className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm w-full"
				>
					<div className="flex flex-col items-center space-y-4">
						<div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#FF7F50]/10">
							<span className="text-4xl">{icon}</span>
						</div>

						<h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

						<p className="text-gray-500 text-sm leading-relaxed">{message}</p>

						<Button
							onClick={handleRedirect}
							className={`mt-4 w-full ${buttonClassName || ""}`}
						>
							{buttonLabel}
						</Button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default InfoModal;
