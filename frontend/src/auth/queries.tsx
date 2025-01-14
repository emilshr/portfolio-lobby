import { useApiQuery } from "./hooks";

export const useMeQuery = (isEnabled = true) => {
  return useApiQuery({
    path: ["whoami"],
    queryKey: ["whoami"],
    refetchOnReconnect: true,
    refetchInterval: 240000,
    enabled: isEnabled,
  });
};
