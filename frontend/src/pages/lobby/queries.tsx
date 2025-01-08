import { useApiQuery } from "@/auth/hooks";
import { PaginatedResponse } from "../common";

export type Message = {
  id: number;
  username: string;
  message: string;
  sentAt: Date;
};

export const useGetChats = (page: number) => {
  return useApiQuery<PaginatedResponse<Message>, { page: number }>({
    path: ["messages"],
    queryKey: ["messages", page],
    params: { page },
    refetchInterval: 5000,
  });
};
