import { useApiQuery } from "./hooks";

export const useMeQuery = () => {
  return useApiQuery({
    queryKey: ["whoami"],
    refetchOnReconnect: true,
    refetchInterval: 240000,
  });
};
