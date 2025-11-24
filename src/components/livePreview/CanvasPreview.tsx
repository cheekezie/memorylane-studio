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
	onReplace?: (url: string, file: File) => void;
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
	onReplace,
	onMount,
	onClick,
	index,
	totalImages = 1,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const borderObj = BORDERS.find((b) => b.id === customization.border);
	const frameObj = FRAME_TYPES.find((f) => f.id === customization.frameType);
	const frameColor = frameObj?.color || "#ffffff";
	const hasFrame = customization.frameType !== "none";

	const frameDimensions =
		FRAME_DIMENSIONS[customization.frameSize] || FRAME_DIMENSIONS["30x20"];

	const displayW = width;
	const displayH = height ?? Math.round(displayW / frameDimensions.ratio);
	const frameThickness = hasFrame ? Math.round(displayW * 0.055) : 0;
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
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);

		const topColor = adjustBrightness(color, 25);
		const bottomColor = adjustBrightness(color, -35);
		const sideColor = adjustBrightness(color, -15);

		ctx.fillStyle = topColor;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w - thickness * 0.6, y + thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + thickness * 0.6);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = topColor;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + thickness * 0.6, y + thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + h - thickness * 0.6);
		ctx.lineTo(x, y + h);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = bottomColor;
		ctx.beginPath();
		ctx.moveTo(x, y + h);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w - thickness * 0.6, y + h - thickness * 0.6);
		ctx.lineTo(x + thickness * 0.6, y + h - thickness * 0.6);
		ctx.closePath();
		ctx.fill();

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

		if (hasFrame && frameThickness > 0) {
			draw3DFrame(ctx, 0, 0, displayW, displayH, frameThickness, frameColor);
		}

		const matX = frameThickness;
		const matY = frameThickness;
		const matW = Math.max(displayW - frameThickness * 2, 1);
		const matH = Math.max(displayH - frameThickness * 2, 1);

		if (matBorderPx > 0) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(matX, matY, matW, matH);
			ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
			ctx.lineWidth = 1;
			ctx.strokeRect(matX + 0.5, matY + 0.5, matW - 1, matH - 1);
		}

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

		const filter = getEffectFilter(customization.effect);
		ctx.filter = filter === "none" ? "none" : filter;

		const fit = fitCover(img.width, img.height, imageW, imageH);

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
		if (onMount) onMount(wrapperRef.current);
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

			{/* Delete Button */}
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

			{/* Replace Image*/}
			{isSelected && (
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

					<label className="relative cursor-pointer z-10">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file && onReplace) {
									const url = URL.createObjectURL(file);
									onReplace(url, file);
								}
							}}
						/>
						<div className="bg-white/95 hover:bg-white rounded-full p-5 shadow-2xl transition-all hover:scale-110">
							<svg
								className="w-6 h-6 text-gray-800"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5.5 5.5 0 1116 6a5.5 5.5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
						<span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity delay-100">
							Replace Image
						</span>
					</label>
				</div>
			)}

			{/* Image counter */}
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
