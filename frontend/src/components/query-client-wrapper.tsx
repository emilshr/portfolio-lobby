import { AuthActionType, AuthContext } from "@/auth/state";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";

export const QueryClientWrapper = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const {
    dispatch,
    state: { token },
  } = useContext(AuthContext);

  const [queryClient] = useState(
    new QueryClient({
      mutationCache: new MutationCache({
        onSettled(_data, error) {
          if (
            error &&
            error.status === 401 &&
            (error as AxiosError<{ code: string }>).response?.data?.code ===
              "user_not_logged_in"
          ) {
            localStorage.removeItem("token");
            console.warn("dispatching POST log out");
            dispatch({ type: AuthActionType.LOGGED_OUT });
          }
        },
        onError(error) {
          console.error({ error });
        },
      }),
      queryCache: new QueryCache({
        onSettled(_, error) {
          if (
            error &&
            error.status === 401 &&
            (error as AxiosError<{ code: string }>).response?.data?.code ===
              "user_not_logged_in"
          ) {
            localStorage.removeItem("token");
            console.warn("dispatching log out");
            dispatch({ type: AuthActionType.LOGGED_OUT });
          }
        },
        onError(error) {
          console.error({ error });
        },
      }),
    })
  );

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    if (token) {
      axios.defaults.headers["Authorization"] = token;
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
