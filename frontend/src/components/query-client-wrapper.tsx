import { AuthActionType, AuthContext } from "@/auth/state";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

type RefreshTokenResponse = {
  token: string;
  username: string;
};

export const QueryClientWrapper = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const {
    dispatch,
    state: { token },
  } = useContext(AuthContext);

  const makeRefreshTokenCall = async () => {
    const { data } = await axios.get<
      unknown,
      AxiosResponse<RefreshTokenResponse>
    >("/refresh");
    return data;
  };

  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          if (
            error.status === 401 &&
            (error as AxiosError<{ code: string }>).response?.data?.code ===
              "access_token_expired"
          ) {
            dispatch({ type: AuthActionType.START_LOADING });
            makeRefreshTokenCall()
              .then(({ username, token }) => {
                dispatch({
                  type: AuthActionType.LOGGED_IN,
                  payload: { isLoggedIn: true, username, token },
                });
              })
              .catch(() => {
                dispatch({
                  type: AuthActionType.LOGGED_OUT,
                });
              })
              .finally(() =>
                dispatch({ type: AuthActionType.FINISHED_LOADING })
              );
          }
        },
      }),
    })
  );

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers["Authorization"] = token;
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
