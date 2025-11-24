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

// Frame size aspect ratios
const FRAME_DIMENSIONS: Record<string, { ratio: number }> = {
	"20x20": { ratio: 1 },
	"30x20": { ratio: 3 / 2 },
	"40x30": { ratio: 4 / 3 },
	"50x40": { ratio: 5 / 4 },
	"60x40": { ratio: 3 / 2 },
};

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
	const frameObj = FRAME_TYPES.find((f) => f.id === customization.frameType);
	const frameColor = frameObj?.color || "#ffffff";
	const hasFrame = customization.frameType !== "none";

	// Get frame dimensions based on selected size
	const frameDimensions =
		FRAME_DIMENSIONS[customization.frameSize] || FRAME_DIMENSIONS["30x20"];

	// Calculate actual display dimensions
	const displayW = width;
	const displayH = height ?? Math.round(displayW / frameDimensions.ratio);

	// Frame thickness - realistic depth (12-18px based on size)
	const frameThickness = hasFrame ? Math.round(displayW * 0.055) : 0;

	// Mat border - only applied when border option is selected
	const matBorderPx = borderObj?.width || 0;

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

	const fitCover = (srcW: number, srcH: number, dstW: number, dstH: number) => {
		const srcRatio = srcW / srcH;
		const dstRatio = dstW / dstH;

		if (srcRatio > dstRatio) {
			const scaledHeight = dstH;
			const scaledWidth = scaledHeight * srcRatio;
			return {
				width: scaledWidth,
				height: scaledHeight,
				offsetX: -(scaledWidth - dstW) / 2,
				offsetY: 0,
			};
		} else {
			const scaledWidth = dstW;
			const scaledHeight = scaledWidth / srcRatio;
			return {
				width: scaledWidth,
				height: scaledHeight,
				offsetX: 0,
				offsetY: -(scaledHeight - dstH) / 2,
			};
		}
	};

	const draw3DFrame = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		thickness: number,
		color: string,
	) => {
		// Outer frame rectangle
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);

		// Create 3D beveled effect - lighter top/left edges
		const topColor = adjustBrightness(color, 25);
		const bottomColor = adjustBrightness(color, -35);
		const sideColor = adjustBrightness(color, -15);

		// Top bevel (highlight)
		ctx.fillStyle = topColor;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w - thickness * 0.6, y + thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + thickness * 0.6);
		ctx.closePath();
		ctx.fill();

		// Left bevel (highlight)
		ctx.fillStyle = topColor;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + thickness * 0.6, y + thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + h - thickness * 0.6);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		ctx.fill();

		// Bottom bevel (shadow)
		ctx.fillStyle = bottomColor;
		ctx.beginPath();
		ctx.moveTo(x, y + h);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w - thickness * 0.6, y + h - thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + h - thickness * 0.6);
		ctx.closePath();
		ctx.fill();

		// Right bevel (shadow)
		ctx.fillStyle = sideColor;
		ctx.beginPath();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w - thickness * 0.6, y + h - thickness * 0.6);
		ctx.lineTo(x + w - thickness * 0.6, y + thickness * 0.6);
		ctx.closePath();
		ctx.fill();
	};

	const adjustBrightness = (color: string, percent: number): string => {
		if (!color) return "#ffffff";

		const num = parseInt(color.replace("#", ""), 16);
		const r = Math.min(255, Math.max(0, (num >> 16) + percent));
		const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
		const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));

		return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
	};

	const draw = useCallback(async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;

		canvas.style.width = `${displayW}px`;
		canvas.style.height = `${displayH}px`;
		canvas.width = Math.round(displayW * dpr);
		canvas.height = Math.round(displayH * dpr);

		ctx.save();
		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, displayW, displayH);

		// Draw 3D frame if frame type is selected
		if (hasFrame && frameThickness > 0) {
			draw3DFrame(ctx, 0, 0, displayW, displayH, frameThickness, frameColor);
		}

		// Mat area (inner white border) - only if border is selected
		const matX = frameThickness;
		const matY = frameThickness;
		const matW = Math.max(displayW - frameThickness * 2, 1);
		const matH = Math.max(displayH - frameThickness * 2, 1);

		// Draw mat border if selected
		if (matBorderPx > 0) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(matX, matY, matW, matH);

			// Subtle inner shadow on mat
			ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
			ctx.lineWidth = 1;
			ctx.strokeRect(matX + 0.5, matY + 0.5, matW - 1, matH - 1);
		}

		// Image area
		const imageX = matX + matBorderPx;
		const imageY = matY + matBorderPx;
		const imageW = Math.max(matW - matBorderPx * 2, 1);
		const imageH = Math.max(matH - matBorderPx * 2, 1);

		const img = await loadImage(imageUrl);
		if (!img) {
			ctx.fillStyle = "#f3f4f6";
			ctx.fillRect(imageX, imageY, imageW, imageH);
			ctx.fillStyle = "#9ca3af";
			ctx.font = "14px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("Image not available", displayW / 2, displayH / 2);
			ctx.restore();
			return;
		}

		// Apply effect filter
		const filter = getEffectFilter(customization.effect);
		ctx.filter = filter === "none" ? "none" : filter;

		// Use cover fit for tight image wrapping
		const fit = fitCover(img.width, img.height, imageW, imageH);

		// Clip to image area
		ctx.save();
		ctx.beginPath();
		ctx.rect(imageX, imageY, imageW, imageH);
		ctx.clip();

		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			imageX + fit.offsetX,
			imageY + fit.offsetY,
			fit.width,
			fit.height,
		);

		ctx.restore();
		ctx.filter = "none";

		// Inner shadow for depth (on the frame opening)
		if (hasFrame) {
			const gradient = ctx.createLinearGradient(
				matX,
				matY,
				matX + 20,
				matY + 20,
			);
			gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
			gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

			ctx.strokeStyle = gradient;
			ctx.lineWidth = 3;
			ctx.strokeRect(matX + 1, matY + 1, matW - 2, matH - 2);
		}

		ctx.restore();
	}, [
		imageUrl,
		customization,
		displayW,
		displayH,
		frameThickness,
		matBorderPx,
		frameColor,
		hasFrame,
	]);

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
			style={{ width: `${displayW}px` }}
		>
			{isSelected && editMode === "single" && (
				<div className="absolute -inset-4 rounded-[1px] blur-xl bg-blue-400/30 animate-pulse" />
			)}

			{!isSelected && editMode === "single" && totalImages > 1 && (
				<div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[3px] z-[1] transition-all duration-500" />
			)}

			<div
				className={`relative overflow-hidden transition-all duration-500 ${
					isSelected && editMode === "single"
						? "shadow-2xl"
						: "hover:shadow-xl hover:scale-[1.02]"
				}`}
				style={{
					width: `${displayW}px`,
					height: `${displayH}px`,
					boxShadow:
						isSelected && editMode === "single"
							? "0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)"
							: "0 15px 35px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
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
