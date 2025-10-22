import { LogoIcon } from "../assets";

const Loader = ({
	text = "Loading...",
	transparent = false,
	theme = "black",
}) => {
	return (
		<div
			className={`fixed inset-0 z-[1000] ${
				theme === "white" ? "bg-white text-black" : "bg-black text-white"
			} ${
				transparent ? "bg-opacity-50" : "bg-opacity-100"
			} flex flex-col items-center justify-center z-50`}
		>
			<div className="relative animate-bounce-scale">
				<img
					src={LogoIcon}
					alt="L-2"
					loading="lazy"
					className="w-16 h-16 object-contain"
				/>
			</div>
			<p className="mt-6 text-sm font-semibold">{text}</p>
		</div>
	);
};

export default Loader;
