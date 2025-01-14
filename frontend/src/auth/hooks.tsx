import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useContext } from "react";
import { AuthActionType, AuthContext, JwtPayload } from "./state";
import {
  MutationKey,
  QueryKey,
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export const apiClient = <ResponseBody = undefined, RequestBody = undefined>(
  method: Method,
  path: string,
  config?: AxiosRequestConfig<RequestBody>
): Promise<AxiosResponse<ResponseBody>> => {
  const formData = new FormData();
  Object.entries(config?.data || {}).forEach(([key, value]) => {
    formData.set(key, value as Blob);
  });
  return axios.request({
    ...config,
    data: formData,
    headers: { "Content-Type": "application/json", ...config?.headers },
    baseURL: import.meta.env.VITE_API_URL + path,
    withCredentials: true,
    method,
  });
};

type RefreshTokenResponse = {
  token: string;
  username: string;
};

export const useValidateToken = () => {
  const {
    state: { token },
    dispatch,
  } = useContext(AuthContext);
  const validateTokenFunction = async () => {
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token) || {};
      const { exp, username } = decodedToken;

      const parsedExpiry = new Date(exp * 1000);

      if (parsedExpiry < new Date()) {
        try {
          dispatch({ type: AuthActionType.START_LOADING });
          const {
            data: { token, username },
          } = await apiClient<RefreshTokenResponse>("GET", "refresh");
          dispatch({
            type: AuthActionType.LOGGED_IN,
            payload: { token, username },
          });
          axios.defaults.headers["Authorization"] = token;
        } catch (error) {
          console.error(`Error while requesting for refresh token`, error);
          dispatch({ type: AuthActionType.LOGGED_OUT });
        } finally {
          dispatch({ type: AuthActionType.FINISHED_LOADING });
        }
      } else {
        dispatch({
          type: AuthActionType.LOGGED_IN,
          payload: { token, username },
        });
      }
      return true;
    }
    return false;
  };

  const validateToken = useCallback(validateTokenFunction, [dispatch, token]);

  return { validateToken };
};

type ApiQueryOptions<RequestParams = undefined> = {
  queryKey: QueryKey;
  path: string[];
  params?: RequestParams;
};

export const useApiQuery = <
  ResponseBody = undefined,
  RequestParams = undefined
>({
  queryKey,
  params,
  path,
  ...options
}: ApiQueryOptions<RequestParams> &
  UndefinedInitialDataOptions<
    unknown,
    unknown,
    AxiosResponse<ResponseBody>
  >) => {
  const { validateToken } = useValidateToken();
  return useQuery<unknown, unknown, AxiosResponse<ResponseBody>>({
    ...options,
    queryKey,
    queryFn: async () => {
      await validateToken();
      return await apiClient("GET", path.join("/"), { params });
    },
  });
};

type ApiMutationOptions<RequestParams = undefined> = {
  method: Method;
  path: string[];
  params?: RequestParams;
  mutationKey: MutationKey;
};

export const useApiMutation = <
  ResponseBody = undefined,
  RequestBody = undefined,
  RequestParams = undefined
>({
  method,
  path,
  params,
  ...options
}: ApiMutationOptions<RequestParams> &
  UseMutationOptions<
    AxiosResponse<ResponseBody>,
    unknown,
    RequestBody,
    unknown
  >) => {
  const { validateToken } = useValidateToken();

  return useMutation<AxiosResponse<ResponseBody>, unknown, RequestBody>({
    ...options,
    mutationFn: async (data: RequestBody) => {
      await validateToken();
      return apiClient(method, path.join("/"), { data, params });
    },
  });
};
