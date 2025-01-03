import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

type LoginMutationResponse = {
  accessToken: string;
  message: string;
  status: boolean;
  username: string;
};

type LoginMutationPayload = {
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

type RegisterMutationPayload = {
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
