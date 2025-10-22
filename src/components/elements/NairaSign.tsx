interface NairaSignProps {
	amount: number | string;
	className?: string;
}

export default function NairaSign({ amount, className }: NairaSignProps) {
	// Format the amount using Intl.NumberFormat for Nigerian currency
	const formattedAmount = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 2,
	}).format(Number(amount));

	return <span className={className}>{formattedAmount}</span>;
}
