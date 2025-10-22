import { Upload, message } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { Upload as UploadIcon } from "lucide-react";
import type { RcFile } from "antd/es/upload/interface";
import { useState } from "react";
import "../styles/FileUpload.css";

const { Dragger } = Upload;

interface FileUploadProps {
	label?: string;
	id?: string;
	className?: string;
	labelClassName?: string;
	accept?: string;
	maxSize?: number;
	maxSizePerFile?: number;
	multiple?: boolean;
	disabled?: boolean;
	onChange?: (file: RcFile | null, fileList: RcFile[]) => void;
	onFileListChange?: (fileList: UploadFile[]) => void;
	value?: UploadFile[];
	allowedFormats?: string[];
}

const FileUpload = ({
	label,
	id = "file-upload",
	className = "",
	labelClassName = "",
	accept = ".jpg,.jpeg,.png,.pdf",
	maxSize = 5,
	maxSizePerFile = 5,
	multiple = false,
	disabled = false,
	onChange,
	onFileListChange,
	value = [],
	allowedFormats = ["JPG", "PNG", "PDF"],
}: FileUploadProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>(value);

	const getTotalSize = (files: UploadFile[]): number => {
		return files.reduce((total, file) => {
			return total + (file.size || 0);
		}, 0);
	};

	const beforeUpload = (file: File, fileListToAdd: File[]) => {
		// Check individual file size
		const fileSizeMB = file.size / 1024 / 1024;
		const isLtMaxSizePerFile = fileSizeMB < maxSizePerFile;

		if (!isLtMaxSizePerFile) {
			message.error(`Each file must be smaller than ${maxSizePerFile}MB!`);
			return Upload.LIST_IGNORE;
		}

		// Check file type
		const fileExtension = file.name.split(".").pop()?.toUpperCase() || "";
		const isValidFormat = allowedFormats.some(
			(format) => format.toUpperCase() === fileExtension,
		);

		if (!isValidFormat) {
			message.error(`Only ${allowedFormats.join(", ")} files are allowed!`);
			return Upload.LIST_IGNORE;
		}

		// Check total size of all files
		const currentTotalSize = getTotalSize(fileList);
		const newFilesSize = fileListToAdd.reduce((sum, f) => sum + f.size, 0);
		const totalSizeMB = (currentTotalSize + newFilesSize) / 1024 / 1024;

		if (totalSizeMB > maxSize) {
			message.error(`Total size of all uploads must not exceed ${maxSize}MB!`);
			return Upload.LIST_IGNORE;
		}

		return false;
	};

	const handleChange: UploadProps["onChange"] = (info) => {
		let newFileList = [...info.fileList];

		// Limit to single file if not multiple
		if (!multiple) {
			newFileList = newFileList.slice(-1);
		}

		// Filter out files that were rejected
		newFileList = newFileList.filter((file) => file.status !== "error");

		setFileList(newFileList);

		// Call the onChange callback with the actual File object
		if (onChange) {
			const latestFile =
				newFileList[newFileList.length - 1]?.originFileObj || null;
			const allFiles = newFileList
				.map((f) => f.originFileObj)
				.filter((f): f is RcFile => f !== undefined && f !== null);
			onChange(latestFile, allFiles);
		}

		// Call the fileList change callback
		if (onFileListChange) {
			onFileListChange(newFileList);
		}
	};

	const handleRemove = (file: UploadFile) => {
		const newFileList = fileList.filter((f) => f.uid !== file.uid);
		setFileList(newFileList);

		if (onChange) {
			const allFiles = newFileList
				.map((f) => f.originFileObj)
				.filter((f): f is RcFile => f !== undefined && f !== null);
			onChange(null, allFiles);
		}

		if (onFileListChange) {
			onFileListChange(newFileList);
		}
	};

	const draggerProps: UploadProps = {
		name: "file",
		multiple,
		fileList,
		beforeUpload,
		onChange: handleChange,
		onRemove: handleRemove,
		accept,
		disabled,
		showUploadList: {
			showPreviewIcon: true,
			showRemoveIcon: true,
		},
		capture: undefined,
	};

	return (
		<div className={`mb-4 ${className}`}>
			{label && (
				<label
					htmlFor={id}
					className={`block mb-2 text-sm font-medium text-graydark dark:text-foreground ${labelClassName}`}
				>
					{label}
				</label>
			)}

			<Dragger {...draggerProps} className="file-upload-dragger">
				<div className="p-6">
					<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 mx-auto">
						<UploadIcon className="w-6 h-6 text-gray-600" />
					</div>
					<p className="text-sm text-gray-700 mb-1">
						<span className="text-primary font-medium">Click to choose</span>{" "}
						your file for upload
					</p>
					<p className="text-xs text-gray-500">
						{allowedFormats.join(", ")} or{" "}
						{allowedFormats[allowedFormats.length - 1]}
					</p>
				</div>
			</Dragger>

			{fileList.length > 0 && (
				<div className="mt-2 text-xs text-gray-500">
					Total size: {(getTotalSize(fileList) / 1024 / 1024).toFixed(2)}MB /{" "}
					{maxSize}MB
				</div>
			)}
		</div>
	);
};

export default FileUpload;
