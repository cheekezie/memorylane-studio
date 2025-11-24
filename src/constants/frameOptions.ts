export const FRAME_TYPES = [
	{ id: "none", label: "Frameless", color: null },
	{ id: "black", label: "Black", color: "#2b2b2b" },
	{ id: "white", label: "White", color: "#f5f5f5" },
	{ id: "natural", label: "Natural", color: "#c8a882" },
	{ id: "walnut", label: "Walnut", color: "#6b4423" },
	{ id: "oak", label: "Oak", color: "#b8956a" },
	{ id: "darkwood", label: "Dark Wood", color: "#4a3428" },
];

export const FRAME_SIZES = [
	{
		id: "20x20",
		label: "20×20 cm",
		width: 20,
		height: 20,
		ratio: 1,
		description: "Square",
		price: 34,
	},
	{
		id: "30x20",
		label: "30×20 cm",
		width: 30,
		height: 20,
		ratio: 1.5,
		description: "Standard",
		price: 44,
	},
	{
		id: "40x30",
		label: "40×30 cm",
		width: 40,
		height: 30,
		ratio: 1.33,
		description: "Medium",
		price: 64,
	},
	{
		id: "50x40",
		label: "50×40 cm",
		width: 50,
		height: 40,
		ratio: 1.25,
		description: "Large",
		price: 84,
	},
	{
		id: "60x40",
		label: "60×40 cm",
		width: 60,
		height: 40,
		ratio: 1.5,
		description: "XL",
		price: 99,
	},
] as const;

export const BORDERS = [
	{ id: "none", label: "No Mat", width: 0 },
	{ id: "thin", label: "Thin Mat", width: 6 },
	{ id: "medium", label: "Medium Mat", width: 12 },
	{ id: "thick", label: "Thick Mat", width: 18 },
];

export const EFFECTS = [
	{ id: "none", label: "Original" },
	{ id: "warm", label: "Warm" },
	{ id: "sepia", label: "Sepia" },
	{ id: "bw", label: "B&W" },
	{ id: "tint", label: "Tint" },
	{ id: "maple", label: "Maple" },
	{ id: "sedan", label: "Sedan" },
];
