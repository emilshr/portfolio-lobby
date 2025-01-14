import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useApiMutation } from "./hooks";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

type LoginMutationResponse = {
  accessToken: string;
  message: string;
  status: boolean;
  username: string;
};

export type LoginMutationPayload = {
  email: string;
  password: string;
};

export const useLoginMutation = () => {
  return useMutation<LoginMutationResponse, unknown, LoginMutationPayload>({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post<
        unknown,
        AxiosResponse<LoginMutationResponse>,
        FormData
      >("/login", formData);
      const { accessToken, username } = response.data;
      axios.defaults.headers["Authorization"] = accessToken;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("username", username);
      return response.data;
    },
  });
};

export type RegisterMutationPayload = {
  email: string;
  password: string;
  username: string;
};

export const useRegisterMutation = () => {
  return useMutation<void, unknown, RegisterMutationPayload>({
    mutationKey: ["register"],
    mutationFn: async ({ email, password, username }) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      await axios.post("/register", formData);
    },
  });
};

export const useGetResetPassword = () => {
  return useApiMutation<void, { email: string }>({
    method: "POST",
    path: ["get-reset-password"],
    mutationKey: ["get-reset-password"],
  });
};
