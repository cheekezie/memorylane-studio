export const getInitials = (name: string): string => {
	const nameParts = name.split(" ");
	return nameParts
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join("");
};
