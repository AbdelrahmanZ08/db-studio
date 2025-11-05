import { useActiveTableStore } from "@/store/active-table.store";
import { TableHeader } from "./header/table-header";
import { TableGrid } from "./table-grid";

export const TableTab = () => {
	const { activeTable } = useActiveTableStore();

	if (!activeTable) {
		return (
			<div className="flex flex-col h-full">
				<main className="flex-1 flex items-center justify-center">Select a table to view</main>
			</div>
		);
	}

	return (
		<>
			<TableHeader />
			<TableGrid activeTable={activeTable} />
		</>
	);
};
