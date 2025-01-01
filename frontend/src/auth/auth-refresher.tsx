import { useContext, useEffect } from "react";
import { useMeQuery } from "./queries";
import { AuthActionType, AuthContext } from "./state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AuthRefresher = () => {
  const { isLoading } = useMeQuery();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: AuthActionType.START_LOADING });
    } else {
      dispatch({ type: AuthActionType.FINISHED_LOADING });
    }
  }, [isLoading, dispatch]);

  return (
    <Dialog open={isLoading} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign up to join the conversation</DialogTitle>
          <DialogDescription>Spinner here</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
