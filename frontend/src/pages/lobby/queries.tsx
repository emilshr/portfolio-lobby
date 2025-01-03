import { useApiQuery } from "@/auth/hooks";

export type Message = {
  id: number;
  username: string;
  message: string;
  sentAt: Date;
};

type GetMessagesResponse = {
  messages: Message[];
};

export const useGetChats = () => {
  return useApiQuery<GetMessagesResponse>({
    queryKey: ["messages"],
    refetchInterval: 5000,
  });
};
