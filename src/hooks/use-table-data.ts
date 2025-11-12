import { useQuery } from "@tanstack/react-query";

import { getTableData } from "@/services/get-table-data.service";

export const useTableData = (tableName: string | null, page?: number) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["table-data", tableName, page],
		queryFn: () => getTableData(tableName, page),
		enabled: !!tableName,
		staleTime: 0, // no stale time
		gcTime: 1000 * 60 * 1, // 1 minute
		refetchOnMount: true, // refetch on mount
		refetchOnWindowFocus: false, // refetch on window focus
		refetchOnReconnect: true, // refetch on reconnect
	});

	return {
		tableData: data,
		isLoadingTableData: isLoading,
		errorTableData: error,
		refetchTableData: refetch,
	};
};
