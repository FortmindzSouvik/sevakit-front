import { fetchData } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";

export const useFetchData = (
  endpoint: string,
  queryKey: readonly unknown[] = [],
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKey.length ? queryKey : [endpoint],
    queryFn: () => fetchData(endpoint),
    enabled,
    refetchOnWindowFocus: false,
  });
};
