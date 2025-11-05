import type { Cell, Table } from "@tanstack/react-table";
import { LongTextCell, ShortTextCell } from "./table-grid-cell-variants";

interface DataGridCellProps<TData> {
	cell: Cell<TData, unknown>;
	table: Table<TData>;
}

export function TableGridCell<TData>({ cell, table }: DataGridCellProps<TData>) {
	const meta = table.options.meta;
	const originalRowIndex = cell.row.index;

	const rows = table.getRowModel().rows;
	const displayRowIndex = rows.findIndex((row) => row.original === cell.row.original);
	const rowIndex = displayRowIndex >= 0 ? displayRowIndex : originalRowIndex;
	const columnId = cell.column.id;

	const isFocused = meta?.focusedCell?.rowIndex === rowIndex && meta?.focusedCell?.columnId === columnId;
	const isEditing = meta?.editingCell?.rowIndex === rowIndex && meta?.editingCell?.columnId === columnId;
	const isSelected = meta?.getIsCellSelected?.(rowIndex, columnId) ?? false;

	// const cellOpts = cell.column.columnDef.meta?.cell;
	// const variant = cellOpts?.variant ?? "text";

	// switch (variant) {
	//   case "short-text":

	return (
		// todo: remove the popover and use the textarea directly
		<LongTextCell
			cell={cell}
			table={table}
			rowIndex={rowIndex}
			columnId={columnId}
			isEditing={isEditing}
			isFocused={isFocused}
			isSelected={isSelected}
		/>
	);

	return (
		<ShortTextCell
			cell={cell}
			table={table}
			rowIndex={rowIndex}
			columnId={columnId}
			isEditing={isEditing}
			isFocused={isFocused}
			isSelected={isSelected}
		/>
	);
	// }
}
