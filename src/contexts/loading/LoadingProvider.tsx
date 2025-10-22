import type { ReactNode, MouseEvent } from "react";
import { useTransition, useState } from "react";
import type { LinkProps } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
import Loader from "../../components/Loader";

interface LoadingLinkProps extends Omit<LinkProps, "to"> {
	to: string;
	children: ReactNode;
	className?: string;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isPending, startTransition] = useTransition();
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const startLoading = () => {
		startTransition(() => {});
	};

	const stopLoading = () => {
		// No-op: isPending resets automatically
	};

	const setInitialLoading = (isLoading: boolean) => {
		setIsInitialLoading(isLoading);
	};

	const LoadingLink = ({
		to,
		children,
		className,
		...props
	}: LoadingLinkProps) => {
		const navigate = useNavigate();

		const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();
			startTransition(() => {
				navigate(to);
			});
		};

		return (
			<Link to={to} className={className} onClick={handleClick} {...props}>
				{children}
			</Link>
		);
	};

	return (
		<LoadingContext.Provider
			value={{ startLoading, stopLoading, setInitialLoading, LoadingLink }}
		>
			{(isPending || isInitialLoading) && (
				<Loader text="Please wait..." theme="white" />
			)}
			{children}
		</LoadingContext.Provider>
	);
}
