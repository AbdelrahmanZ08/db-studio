export type DataType = "short-text" | "long-text" | "BOOLEAN" | "number" | "ARRAY";

export interface ColumnInfo {
	columnName: string;
	dataType: DataType;
	isNullable: boolean;
	columnDefault: string | null;
	isPrimaryKey: boolean;
}

export const getTableCols = async (tableName: string): Promise<ColumnInfo[]> => {
	const response = await fetch(`/api/tables/${tableName}/columns`);
	if (!response.ok) {
		throw new Error("Failed to fetch table columns");
	}
	return response.json();
};
