// Actions

import { createContext, Dispatch, Reducer } from "react";

export enum AuthActionType {
  START_LOADING = "START_LOADING",
  FINISHED_LOADING = "FINISHED_LOADING",
  LOGGED_IN = "LOGGED_IN",
  LOGGED_OUT = "LOGGED_OUT",
  LOGIN_FAILED = "LOGIN_FAILED",
}

export type StartAuthLoadingAction = {
  type: AuthActionType.START_LOADING;
};

export type FinishAuthLoadingAction = {
  type: AuthActionType.FINISHED_LOADING;
};

export type LoggedInAction = {
  type: AuthActionType.LOGGED_IN;
  payload: {
    username: string;
    token: string;
  };
};

export type LoggedOutAction = {
  type: AuthActionType.LOGGED_OUT;
};

export type LoginFailedAction = {
  type: AuthActionType.LOGIN_FAILED;
};

export type AuthActions =
  | LoggedInAction
  | LoggedOutAction
  | LoginFailedAction
  | StartAuthLoadingAction
  | FinishAuthLoadingAction;

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  loading: true,
  token: localStorage.getItem("token") ?? undefined,
};

// Context

export type AuthContextType = {
  state: AuthState;
  dispatch: Dispatch<AuthActions>;
};

export const AuthContext = createContext<AuthContextType>({
  dispatch: () => null,
  state: initialAuthState,
});

// Reducer

export type AuthState = {
  token?: string;
  username?: string;
  isLoggedIn: boolean;
  loading: boolean;
};

export const authReducer: Reducer<AuthState, AuthActions> = (state, action) => {
  const { type } = action;
  switch (type) {
    case AuthActionType.LOGGED_IN: {
      const { token, username } = action.payload;
      localStorage.setItem("token", token);
      return {
        ...state,
        isLoggedIn: true,
        token,
        username,
        loading: false,
      };
    }
    case AuthActionType.LOGIN_FAILED:
    case AuthActionType.LOGGED_OUT: {
      localStorage.removeItem("token");
      return {
        ...state,
        isLoggedIn: false,
        token: undefined,
        username: undefined,
      };
    }

    case AuthActionType.START_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }

    case AuthActionType.FINISHED_LOADING: {
      return {
        ...state,
        loading: false,
      };
    }

    default:
      return state;
  }
};

// jwt state

export type JwtPayload = {
  exp: number;
  userId: number;
  username: string;
};
