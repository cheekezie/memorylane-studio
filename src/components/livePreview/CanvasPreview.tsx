import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { BORDERS, FRAME_TYPES } from "../../constants/frameOptions";
import type { FrameCustomization } from "../../types/interfaces/frame.interface";

interface CanvasPreviewProps {
	imageUrl: string;
	customization: FrameCustomization;
	width?: number;
	height?: number;
	isSelected?: boolean;
	editMode?: "single" | "all";
	onRemove?: () => void;
	onMount?: (el: HTMLDivElement | null) => void;
	onClick?: () => void;
	index?: number;
	totalImages?: number;
	mode?: "frame" | "gallery" | "art";
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
	imageUrl,
	customization,
	width = 280,
	height,
	isSelected = false,
	editMode = "all",
	onRemove,
	onMount,
	onClick,
	index,
	totalImages = 1,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const borderObj = BORDERS.find((b) => b.id === customization.border);
	const borderPx = borderObj ? borderObj.width : 0;

	const frameObj = FRAME_TYPES.find((f) => f.id === customization.frameType);
	const frameColor = frameObj?.color || "#ffffff";

	const getEffectFilter = (effect: string) => {
		switch (effect) {
			case "warm":
				return "sepia(0.3) saturate(1.2)";
			case "sepia":
				return "sepia(1)";
			case "tint":
				return "hue-rotate(15deg)";
			case "bw":
				return "grayscale(1)";
			case "maple":
				return "contrast(1.1) brightness(1.05)";
			case "sedan":
				return "contrast(0.9) brightness(0.95)";
			default:
				return "none";
		}
	};

	const loadImage = (src: string): Promise<HTMLImageElement | null> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => resolve(img);
			img.onerror = () => {
				console.warn("Image failed to load (possibly revoked blob)", src);
				resolve(null);
			};
			img.src = src;
		});
	};

	const fitContain = (
		srcW: number,
		srcH: number,
		dstW: number,
		dstH: number,
	) => {
		const srcRatio = srcW / srcH;
		const dstRatio = dstW / dstH;
		if (srcRatio > dstRatio) {
			return { width: dstW, height: Math.round(dstW / srcRatio) };
		} else {
			return { width: Math.round(dstH * srcRatio), height: dstH };
		}
	};

	const roundRect = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		radius = 8,
		fill = false,
		stroke = false,
	) => {
		const r = Math.min(radius, w / 2, h / 2);
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
		if (fill) ctx.fill();
		if (stroke) ctx.stroke();
	};

	const draw = useCallback(async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const displayW = width;
		const displayH = height ?? Math.round((displayW * 3) / 4);

		canvas.style.width = `${displayW}px`;
		canvas.style.height = `${displayH}px`;
		canvas.width = Math.round(displayW * dpr);
		canvas.height = Math.round(displayH * dpr);

		ctx.save();
		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, displayW, displayH);

		// Frame background
		ctx.fillStyle = frameColor;
		roundRect(ctx, 0, 0, displayW, displayH, 12, true);

		const innerX = borderPx;
		const innerY = borderPx;
		const innerW = Math.max(displayW - borderPx * 2, 1);
		const innerH = Math.max(displayH - borderPx * 2, 1);

		ctx.fillStyle = "#ffffff";
		roundRect(ctx, innerX, innerY, innerW, innerH, 8, true);

		const img = await loadImage(imageUrl);
		if (!img) {
			ctx.fillStyle = "#f3f4f6";
			roundRect(ctx, innerX, innerY, innerW, innerH, 8, true);
			ctx.fillStyle = "#9ca3af";
			ctx.font = "16px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("Image not available", displayW / 2, displayH / 2);
			ctx.restore();
			return;
		}

		const filter = getEffectFilter(customization.effect);
		ctx.filter = filter === "none" ? "none" : filter;

		const fit = fitContain(img.width, img.height, innerW, innerH);
		const dx = innerX + (innerW - fit.width) / 2;
		const dy = innerY + (innerH - fit.height) / 2;

		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			dx,
			dy,
			fit.width,
			fit.height,
		);
		ctx.filter = "none";

		// Border line
		if (borderPx > 0) {
			ctx.strokeStyle = "#e6e6e6";
			ctx.lineWidth = Math.max(1, borderPx / 2);
			roundRect(ctx, innerX, innerY, innerW, innerH, 8, false, true);
		}

		ctx.restore();
	}, [imageUrl, customization, width, height, borderPx, frameColor]);

	useEffect(() => {
		draw();
	}, [draw]);

	useEffect(() => {
		if (onMount) {
			onMount(wrapperRef.current);
		}
	}, [onMount]);

	return (
		<div
			ref={wrapperRef}
			onClick={onClick}
			className={`relative group flex-shrink-0 transition-all duration-500 ease-out cursor-pointer ${
				isSelected && editMode === "single" ? "scale-110 z-10" : "scale-100"
			}`}
			style={{ width: `${width}px` }}
		>
			{isSelected && editMode === "single" && (
				<div className="absolute -inset-2 rounded-2xl blur-lg bg-blue-400/20" />
			)}

			{!isSelected && editMode === "single" && totalImages > 1 && (
				<div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] rounded-xl z-[1] transition-all duration-500" />
			)}

			<div
				className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
					isSelected && editMode === "single"
						? "shadow-2xl ring-2"
						: "hover:shadow-xl hover:scale-[1.02]"
				}`}
				style={{
					width: `${width}px`,
					height: height ? `${height}px` : "auto",
				}}
			>
				<canvas
					ref={canvasRef}
					className="w-full h-full block"
					aria-label="preview-canvas"
				/>
			</div>

			{onRemove && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					className="absolute -top-2 -right-2 p-2.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-xl z-30"
					aria-label="Remove image"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			)}

			{totalImages > 1 && typeof index === "number" && (
				<div
					className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-500 z-30 text-xs font-bold ${
						isSelected && editMode === "single"
							? "bg-blue-500 text-white scale-105"
							: "bg-black/70 text-white"
					}`}
				>
					{index + 1} / {totalImages}
				</div>
			)}
		</div>
	);
};

export default CanvasPreview;
