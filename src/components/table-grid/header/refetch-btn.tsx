import { RefreshCcwIcon } from "lucide-react";
import { useCallback } from "react";
import { useTableCols } from "@/hooks/use-table-cols";
import { useTableData } from "@/hooks/use-table-data";
import { useActiveTableStore } from "@/stores/active-table.store";

export const RefetchBtn = () => {
	const { activeTable } = useActiveTableStore();
	const { refetchTableData } = useTableData(activeTable ?? "");
	const { refetchTableCols } = useTableCols(activeTable ?? "");

	const handleRefetch = useCallback(() => {
		Promise.all([refetchTableData(), refetchTableCols()]);
	}, [refetchTableData, refetchTableCols]);

	return (
		<button
			type="button"
			className="aspect-square size-8 border-r border-zinc-800 flex items-center justify-center text-sm font-medium hover:bg-zinc-900 transition-colors text-zinc-400"
			onClick={handleRefetch}
		>
			<RefreshCcwIcon className="size-4" />
		</button>
	);
};
