import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTableGrid } from "@/hooks/use-table-grid";
import { getTableColumns, getTableData, type TableData } from "@/services/api.service";
import { TableGrid } from "./table-grid";

export const Table = ({ activeTable }: { activeTable: string }) => {
	const {
		data: tableColumns,
		isLoading: isLoadingTableColumns,
		error: errorTableColumns,
	} = useQuery({
		queryKey: ["table", activeTable],
		queryFn: () => getTableColumns(activeTable),
		enabled: !!activeTable,
	});

	const {
		data: tableData,
		isLoading: isLoadingTableData,
		error: errorTableData,
	} = useQuery({
		queryKey: ["table", activeTable, "data"],
		queryFn: () => getTableData(activeTable),
		enabled: !!activeTable,
	});

	// Generate columns from the table schema
	const columns = useMemo<ColumnDef<TableData>[]>(() => {
		return (
			tableColumns?.map((col) => ({
				id: col.name,
				accessorKey: col.name,
				header: col.name,
				cell: ({ getValue }) => {
					const value = getValue();
					return value === null || value === undefined ? "" : String(value);
				},
			})) ?? []
		);
	}, [tableColumns]);

	const tableGrid = useTableGrid({
		columns,
		data: tableData ?? [],
	});

	if (isLoadingTableColumns || isLoadingTableData) {
		return <div className="flex items-center justify-center p-8">Loading...</div>;
	}

	if (errorTableColumns) {
		return (
			<div className="flex items-center justify-center p-8 text-red-500">
				Error loading table schema: {errorTableColumns.message}
			</div>
		);
	}

	if (errorTableData) {
		return (
			<div className="flex items-center justify-center p-8 text-red-500">
				Error loading table data: {errorTableData.message}
			</div>
		);
	}

	if (!tableColumns || !tableData) {
		return <div className="flex items-center justify-center p-8">No table data found</div>;
	}

	return <TableGrid {...tableGrid} table={tableGrid.table} />;
};
