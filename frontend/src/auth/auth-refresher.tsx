import { useContext, useEffect } from "react";
import { useMeQuery } from "./queries";
import { AuthActionType, AuthContext } from "./state";

export const useAuthRefresher = () => {
  const { isLoading } = useMeQuery();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: AuthActionType.START_LOADING });
    } else {
      dispatch({ type: AuthActionType.FINISHED_LOADING });
    }
  }, [isLoading, dispatch]);
};
