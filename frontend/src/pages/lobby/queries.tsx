import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Message = {
  id: number;
  username: string;
  message: string;
  sentAt: Date;
};

type GetMessagesResponse = {
  messages: Message[];
};

export const useGetChats = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await axios.get<GetMessagesResponse>("/messages");
      return data?.messages ?? [];
    },
  });
};
