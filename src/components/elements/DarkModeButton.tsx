import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeButton = () => {
	const [mounted, setMounted] = useState(false);
	const [theme, setThemeState] = useState<"light" | "dark">("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light";
		const initialTheme = savedTheme || systemTheme;

		setThemeState(initialTheme);
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	if (!mounted) {
		return null;
	}

	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			className="p-3 rounded-full bg-background hover:bg-foreground/5 transition-all duration-300 hover:scale-110 active:scale-95"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
		>
			{isDark ? (
				<Sun className="h-5 w-5 text-primary" aria-hidden="true" />
			) : (
				<Moon className="h-5 w-5 text-secondary" aria-hidden="true" />
			)}
		</button>
	);
};

export default DarkModeButton;
