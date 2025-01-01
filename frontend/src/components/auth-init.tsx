import { AuthContext, authReducer, initialAuthState } from "@/auth/state";
import { PropsWithChildren, useReducer } from "react";

export const AuthInit = ({ children }: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthContext.Provider value={{ dispatch, state }}>
      {children}
    </AuthContext.Provider>
  );
};
