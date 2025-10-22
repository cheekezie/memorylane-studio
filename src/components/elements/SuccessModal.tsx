import { InfoCircleOutlined } from "@ant-design/icons";

interface SuccessProps {
	description: string;
}

const SuccessModal = ({ description }: SuccessProps) => {
	return (
		<div>
			{/* #b9e8b9 */}
			<div className="flex flex-wrap ">
				<div className="rounded-[20px] bg-success-100 m-auto text-center px-10 py-10 w-full text-green-500 bg-green-100 text-9xl">
					<InfoCircleOutlined />
				</div>

				<h6 className="mt-3 text-center m-auto">{description}</h6>
			</div>
		</div>
	);
};

export default SuccessModal;
