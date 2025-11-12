export interface TableDataResult {
	data: Record<string, unknown>[];
	pagination: {
		page: number;
		pageSize: number;
		totalRows: number;
		totalPages: number;
	};
}

export const getTableData = async (tableName: string | null, page: number = 1): Promise<TableDataResult | null> => {
	if (!tableName) {
		return null;
	}

	const queryParams = new URLSearchParams();
	queryParams.set("page", page.toString());

	try {
		const response = await fetch(`/api/tables/${tableName}/data?${queryParams.toString()}`);
		if (!response.ok) {
			throw new Error("Failed to fetch table data");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching table data:", error);
		throw error;
	}
};
