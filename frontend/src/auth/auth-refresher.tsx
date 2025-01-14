import { useContext, useEffect } from "react";
import { useMeQuery } from "./queries";
import { AuthActionType, AuthContext, TokenState } from "./state";
import axios from "axios";

export const useAuthRefresher = () => {
  const {
    dispatch,
    state: { tokenState },
  } = useContext(AuthContext);
  const { isLoading, error } = useMeQuery(
    tokenState !== TokenState.NOT_LOGGED_IN
  );

  useEffect(() => {
    if (axios.isAxiosError<{ code: TokenState }>(error)) {
      if (error.response?.data.code === TokenState.NOT_LOGGED_IN) {
        dispatch({ type: AuthActionType.LOGGED_OUT });
      }
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: AuthActionType.START_LOADING });
    } else {
      dispatch({ type: AuthActionType.FINISHED_LOADING });
    }
  }, [isLoading, dispatch]);
};
