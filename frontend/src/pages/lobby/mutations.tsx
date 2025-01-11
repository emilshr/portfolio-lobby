import { useApiMutation } from "@/auth/hooks";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type SendMessagePayload = {
  message: string;
};

type SendMessageHandlers = {
  onSuccess: () => void;
};

export const useSendMessage = ({ onSuccess }: SendMessageHandlers) => {
  return useMutation<void, AxiosError<{ message: string }>, SendMessagePayload>(
    {
      mutationKey: ["message"],
      mutationFn: async ({ message }) => {
        const formData = new FormData();
        formData.set("message", message);
        return axios.post("/messages", formData);
      },
      onSuccess: () => onSuccess(),
    }
  );
};

export const useLogout = () => {
  return useApiMutation<void, void>({
    method: "POST",
    path: ["logout"],
    mutationKey: ["logout"],
  });
};
