import type { ReactNode } from "react";

interface prop {
	label: string;
	value: ReactNode;
	labelW?: number;
}

const ListItem = ({ label, value }: prop) => {
	return (
		<div className={`grid grid-cols-[130px_1fr] gap-4 mb-3`}>
			<strong className="pr-4 text-sm">{label}:</strong>
			<p className="text-sm text-gray-500">{value}</p>
		</div>
	);
};

export default ListItem;
