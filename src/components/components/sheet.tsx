import type { ReactNode } from "react";
import type { SheetName } from "@/stores/sheet.store";
import { useSheetStore } from "@/stores/sheet.store";
import { cn } from "@/utils/cn";

export const Sheet = ({
	children,
	className,
	title,
	name,
}: {
	children: ReactNode;
	className?: string;
	title?: string;
	name: SheetName;
}) => {
	const { closeSheet, activeSheet } = useSheetStore();
	const isOpen = activeSheet === name;

	return (
		<>
			{/* Background Overlay */}
			<div
				className={cn(
					"fixed inset-0 bg-black/70 z-50 transition-opacity duration-300",
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
				onClick={closeSheet}
				tabIndex={0} // Use 0 so the overlay is in tab order and can be focused
				aria-label="Close sheet overlay"
				role="button"
			/>

			{/* Sheet Container */}
			<aside
				className={cn(
					"fixed right-0 top-0 bg-black border-l border-zinc-800 z-50 min-h-dvh",
					"transition-transform duration-300 ease-out size-[440px] shadow-lg transform-gpu",
					isOpen ? "translate-x-0" : "translate-x-full",
					className,
				)}
			>
				<div className="flex items-center justify-between border-b border-zinc-800 p-3">
					<h2 className="text-sm font-medium">{title}</h2>
				</div>

				<div className="p-4">{children}</div>
			</aside>
		</>
	);
};
