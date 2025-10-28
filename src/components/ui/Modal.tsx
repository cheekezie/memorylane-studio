import { CloseOutlined } from "@ant-design/icons";
import { tv } from "tailwind-variants";
import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	title?: string;
	onClose: () => void;
	children: React.ReactNode;
	size?: "xsm" | "sm" | "md" | "lg" | "xl";
	fullHeight?: boolean;
}

export function Modal({
	isOpen,
	title,
	onClose,
	children,
	size = "md",
	fullHeight,
}: ModalProps) {
	const modalV = tv({
		base: "modal bg-white rounded-md transition-all duration-300 ease-in-out transform w-full mx-auto flex flex-col",
		variants: {
			size: {
				xsm: "md:max-w-[400px]",
				sm: "md:max-w-[550px]",
				md: "md:max-w-[760px]",
				lg: "md:max-w-[900px]",
				xl: "md:max-w-[1200px]",
			},
			height: {
				full: "h-[100vh]",
				contain: "h-[initial]",
			},
		},
	});

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	const closeModal = () => {
		onClose();
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />

			<div
				className={modalV({ size, height: fullHeight ? "full" : "contain" })}
			>
				<div className="flex items-center justify-between p-4 border-b">
					{title && <h6 className="text-[24px] font-bold truncate">{title}</h6>}
					<button
						onClick={closeModal}
						aria-label="Close modal"
						className="text-red-500 hover:text-red-700 transition-colors"
					>
						<CloseOutlined className="text-2xl" />
					</button>
				</div>

				<div
					className={`modal-content p-4 overflow-y-auto ${
						fullHeight ? "h-[calc(100vh-80px)]" : "max-h-[70vh]"
					}`}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
