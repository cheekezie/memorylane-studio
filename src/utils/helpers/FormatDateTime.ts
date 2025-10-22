export const formatDatetime = (dateString?: string): string => {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "Invalid date";

	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear().toString().slice(-2);

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

	const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
	const formattedDate = `${day}-${month}-${year}, ${formattedTime}`;

	return formattedDate;
};
