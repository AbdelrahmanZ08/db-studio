import { useQuery } from "@tanstack/react-query";

import { getTableCols } from "@/services/get-table-cols.service";

export const useTableCols = (tableName: string) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["table-cols", tableName],
		queryFn: () => getTableCols(tableName),
		staleTime: 0, // 5 minutes
		enabled: !!tableName,
		gcTime: 1000 * 60 * 1, // 10 minutes
		refetchOnMount: true, // refetch on mount
		refetchOnWindowFocus: false, // refetch on window focus
		refetchOnReconnect: true, // refetch on reconnect
	});

	return {
		tableCols: data,
		isLoadingTableCols: isLoading,
		errorTableCols: error,
		refetchTableCols: refetch,
	};
};
