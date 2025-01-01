import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["whoami"],
    refetchOnReconnect: true,
    refetchOnMount: "always",
    queryFn: async () => {
      return await axios.get<unknown, AxiosResponse<{ username: string }>>(
        "/whoami",
        { withCredentials: true }
      );
    },
    refetchInterval: 240000,
  });
};
