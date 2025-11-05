import type { CellPosition, RowHeightValue } from "@/types/data-grid.type";

export function getCellKey(rowIndex: number, columnId: string) {
	return `${rowIndex}:${columnId}`;
}

export function parseCellKey(cellKey: string): Required<CellPosition> {
	const parts = cellKey.split(":");
	const rowIndexStr = parts[0];
	const columnId = parts[1];
	if (rowIndexStr && columnId) {
		const rowIndex = parseInt(rowIndexStr, 10);
		if (!Number.isNaN(rowIndex)) {
			return { rowIndex, columnId };
		}
	}
	return { rowIndex: 0, columnId: "" };
}

export function getRowHeightValue(rowHeight: RowHeightValue): number {
	const rowHeightMap: Record<RowHeightValue, number> = {
		short: 36,
		medium: 56,
		tall: 76,
		"extra-tall": 96,
	};

	return rowHeightMap[rowHeight];
}
