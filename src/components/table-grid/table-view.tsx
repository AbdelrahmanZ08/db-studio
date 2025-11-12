import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataGrid } from "@/components/data-grid/data-grid";
// import { DataGridKeyboardShortcuts } from "@/components/data-grid/data-grid-keyboard-shortcuts";
import { useDataGrid } from "@/hooks/use-data-grid";
import { useTableCols } from "@/hooks/use-table-cols";
import { useTableData } from "@/hooks/use-table-data";
import { useActiveTableStore } from "@/stores/active-table.store";
import { TableHeader } from "./header/table-header";



export function TableView() {
	const { activeTable } = useActiveTableStore();
	const { tableCols, isLoadingTableCols } = useTableCols(activeTable);
	const { tableData, isLoadingTableData } = useTableData(activeTable);

	const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
		return (
			tableCols?.map((col) => ({
				id: col.columnName,
				accessorKey: col.columnName,
				header: col.columnName,
				meta: {
					cell: {
						variant: "long-text",
					},
				},
				minSize: 150,
			})) ?? []
		);
	}, [tableCols]);

	// const columns = useMemo<ColumnDef<SkateTrick>[]>(
	// 	() => [
	// 		{
	// 			id: "trickName",
	// 			accessorKey: "trickName",
	// 			header: "Trick name",
	// 			meta: {
	// 				cell: {
	// 					variant: "short-text",
	// 				},
	// 			},
	// 			minSize: 180,
	// 		},
	// 		{
	// 			id: "skaterName",
	// 			accessorKey: "skaterName",
	// 			header: "Skater",
	// 			meta: {
	// 				cell: {
	// 					variant: "short-text",
	// 				},
	// 			},
	// 			minSize: 150,
	// 		},
	// 		{
	// 			id: "difficulty",
	// 			accessorKey: "difficulty",
	// 			header: "Difficulty",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: [
	// 						{ label: "Beginner", value: "beginner" },
	// 						{ label: "Intermediate", value: "intermediate" },
	// 						{ label: "Advanced", value: "advanced" },
	// 						{ label: "Expert", value: "expert" },
	// 					],
	// 				},
	// 			},
	// 			minSize: 120,
	// 		},
	// 		{
	// 			id: "variant",
	// 			accessorKey: "variant",
	// 			header: "Category",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: [
	// 						{ label: "Flip", value: "flip" },
	// 						{ label: "Grind", value: "grind" },
	// 						{ label: "Grab", value: "grab" },
	// 						{ label: "Transition", value: "transition" },
	// 						{ label: "Manual", value: "manual" },
	// 						{ label: "Slide", value: "slide" },
	// 					],
	// 				},
	// 			},
	// 			minSize: 120,
	// 		},
	// 		{
	// 			id: "landed",
	// 			accessorKey: "landed",
	// 			header: "Landed",
	// 			meta: {
	// 				cell: {
	// 					variant: "boolean",
	// 				},
	// 			},
	// 			minSize: 100,
	// 		},
	// 		{
	// 			id: "attempts",
	// 			accessorKey: "attempts",
	// 			header: "Attempts",
	// 			meta: {
	// 				cell: {
	// 					variant: "number",
	// 					min: 1,
	// 					max: 100,
	// 				},
	// 			},
	// 			minSize: 100,
	// 		},
	// 		{
	// 			id: "bestScore",
	// 			accessorKey: "bestScore",
	// 			header: "Score",
	// 			meta: {
	// 				cell: {
	// 					variant: "number",
	// 					min: 1,
	// 					max: 10,
	// 				},
	// 			},
	// 			minSize: 110,
	// 		},
	// 		{
	// 			id: "location",
	// 			accessorKey: "location",
	// 			header: "Location",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: skateSpots.map((spot) => ({ label: spot, value: spot })),
	// 				},
	// 			},
	// 			minSize: 180,
	// 		},
	// 		{
	// 			id: "dateAttempted",
	// 			accessorKey: "dateAttempted",
	// 			header: "Attempted at",
	// 			meta: {
	// 				cell: {
	// 					variant: "long-text",
	// 				},
	// 			},
	// 			minSize: 130,
	// 		},
	// 	],
	// 	[],
	// );

	// const onRowAdd = useCallback(() => {
	// 	setData((prev) => [...prev, { id: faker.string.nanoid() }]);

	// 	return {
	// 		rowIndex: data.length,
	// 		columnId: "trickName",
	// 	};
	// }, [data.length]);

	const { table, ...dataGridProps } = useDataGrid({
		columns,
		data: tableData?.data ?? [],
		// onDataChange: setData,
		// onRowAdd,
		enableSearch: true,
	});

	if (!activeTable) {
		return <main className="flex-1 flex items-center justify-center">Select a table to view</main>;
	}

	if (isLoadingTableCols || isLoadingTableData) {
		return <main className="flex-1 flex items-center justify-center">Loading...</main>;
	}

	// Check if table has no data
	const hasNoData = !tableData?.data || tableData.data.length === 0;

	if (hasNoData) {
		return (
			<div className="flex flex-col flex-1 h-full overflow-hidden">
				<TableHeader />

				<div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="opacity-50"
					>
						<title>No data</title>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						<path d="M3 9h18" />
						<path d="M9 21V9" />
					</svg>
					<div className="text-center">
						<p className="text-sm font-medium">No data in this table</p>
						<p className="text-xs text-zinc-500 mt-1">This table exists but contains no rows</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 h-full overflow-hidden">
			<TableHeader />
			{/* // onRowAdd={onRowAdd} */}
			{/* x */}
			{/* <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} /> */}
			<DataGrid {...dataGridProps} table={table} className="h-full" />
		</div>
	);
}
