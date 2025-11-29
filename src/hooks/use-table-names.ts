import { useQuery } from "@tanstack/react-query";
import { getTableNames } from "@/services/get-table-names.service";
import { CACHE_KEYS } from "@/utils/constants/constans";

export const useTableNames = () => {
	const { data: tableNames, isLoading: isLoadingTableNames } = useQuery({
		queryKey: [CACHE_KEYS.TABLE_NAMES],
		queryFn: () => getTableNames(),
		staleTime: 1000 * 60 * 5, // 15 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
		refetchOnMount: true, // refetch on mount
		refetchOnWindowFocus: false, // refetch on window focus
		refetchOnReconnect: true, // refetch on reconnect
	});

	return { tableNames, isLoadingTableNames };
};
