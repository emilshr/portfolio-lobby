import { useLoginMutation } from "@/auth/mutations";
import { AuthActionType, AuthContext } from "@/auth/state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { ForgotPassword } from "./forgot-password";

export const Login = () => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("pass");
  const { mutateAsync, isPending } = useLoginMutation();
  const { dispatch } = useContext(AuthContext);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <p className="inline-block hover:underline cursor-pointer">Sign in</p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-4">Sign in</DialogTitle>
            <DialogDescription>
              <span className="flex flex-col gap-y-4">
                <span className="flex flex-col gap-y-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </span>
                <span className="flex flex-col gap-y-2">
                  <ForgotPassword />
                  <Button
                    disabled={isPending}
                    onClick={() => {
                      dispatch({ type: AuthActionType.START_LOADING });
                      mutateAsync({ email, password })
                        .then(({ accessToken, username }) =>
                          dispatch({
                            type: AuthActionType.LOGGED_IN,
                            payload: {
                              token: accessToken,
                              username,
                            },
                          })
                        )
                        .catch(() =>
                          dispatch({ type: AuthActionType.LOGIN_FAILED })
                        )
                        .finally(() => {
                          dispatch({ type: AuthActionType.FINISHED_LOADING });
                        });
                    }}
                  >
                    Login
                  </Button>
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
