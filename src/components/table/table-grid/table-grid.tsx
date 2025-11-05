import { flexRender } from "@tanstack/react-table";
import { type KeyboardEvent, type MouseEvent, useCallback } from "react";
import type { useTableGrid } from "@/hooks/use-table-grid";
import { cn } from "@/utils/cn";
import { TableGridRow } from "./table-grid-row";

interface TableGridProps<TData> extends ReturnType<typeof useTableGrid<TData>>, React.ComponentProps<"div"> {}

export function TableGrid<TData>({
	dataGridRef,
	headerRef,
	rowMapRef,
	// footerRef,
	table,
	rowVirtualizer,
	// searchState,
	columnSizeVars,
	onRowAdd,
	className,
	...props
}: TableGridProps<TData>) {
	const rows = table.getRowModel().rows;
	const columns = table.getAllColumns();

	const meta = table.options.meta;
	const rowHeight = meta?.rowHeight ?? "short";
	const focusedCell = meta?.focusedCell ?? null;

	const onGridContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
	}, []);

	const _onAddRowKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (!onRowAdd) return;

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				onRowAdd();
			}
		},
		[onRowAdd],
	);

	return (
		<div data-slot="grid-wrapper" className={cn("relative flex w-full h-full flex-col", className)} {...props}>
			<div
				role="grid"
				aria-label="Data grid"
				aria-rowcount={rows.length + (onRowAdd ? 1 : 0)}
				aria-colcount={columns.length}
				data-slot="grid"
				tabIndex={0}
				ref={dataGridRef}
				className="relative grid select-none overflow-auto rounded-md focus:outline-none h-full"
				style={{
					...columnSizeVars,
				}}
				onContextMenu={onGridContextMenu}
			>
				<div
					role="rowgroup"
					data-slot="grid-header"
					ref={headerRef}
					className="sticky top-0 z-10 grid border-b bg-background"
				>
					{table.getHeaderGroups().map((headerGroup, rowIndex) => (
						<div
							key={headerGroup.id}
							role="row"
							aria-rowindex={rowIndex + 1}
							data-slot="grid-header-row"
							tabIndex={-1}
							className="flex w-full"
						>
							{headerGroup.headers.map((header, colIndex) => {
								const sorting = table.getState().sorting;
								const currentSort = sorting.find((sort) => sort.id === header.column.id);
								const isSortable = header.column.getCanSort();

								return (
									<div
										key={header.id}
										role="columnheader"
										aria-colindex={colIndex + 1}
										aria-sort={
											currentSort?.desc === false
												? "ascending"
												: currentSort?.desc === true
													? "descending"
													: isSortable
														? "none"
														: undefined
										}
										data-slot="grid-header-cell"
										tabIndex={-1}
										className={cn("relative", {
											"border-r": header.column.id !== "select",
										})}
										style={{
											// ...getCommonPinningStyles({ column: header.column }),
											width: `calc(var(--header-${header.id}-size) * 1px)`,
										}}
									>
										{header.isPlaceholder ? null : typeof header.column.columnDef.header === "function" ? (
											<div className="size-full px-3 py-1.5">
												{flexRender(header.column.columnDef.header, header.getContext())}
											</div>
										) : null}
										{/* <DataGridColumnHeader header={header} table={table} /> */}
									</div>
								);
							})}
						</div>
					))}
				</div>

				<div
					role="rowgroup"
					data-slot="grid-body"
					className="relative grid"
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
					}}
				>
					{rowVirtualizer.getVirtualIndexes().map((virtualRowIndex) => {
						const row = rows[virtualRowIndex];
						if (!row) return null;

						return (
							<TableGridRow
								key={row.id}
								row={row}
								rowMapRef={rowMapRef}
								virtualRowIndex={virtualRowIndex}
								rowVirtualizer={rowVirtualizer}
								rowHeight={rowHeight}
								focusedCell={focusedCell}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
