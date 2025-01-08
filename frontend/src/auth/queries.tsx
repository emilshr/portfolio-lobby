import { useApiQuery } from "./hooks";

export const useMeQuery = () => {
  return useApiQuery({
    path: ["whoami"],
    queryKey: ["whoami"],
    refetchOnReconnect: true,
    refetchInterval: 240000,
  });
};
