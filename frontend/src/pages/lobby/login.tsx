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

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isPending } = useLoginMutation();
  const { dispatch } = useContext(AuthContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="default">
          Already a user? Sign in
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign up to join the conversation</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-y-2">
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
              <Button
                disabled={isPending}
                onClick={() => {
                  dispatch({ type: AuthActionType.START_LOADING });
                  mutateAsync({ email, password })
                    .then(({ accessToken, username }) =>
                      dispatch({
                        type: AuthActionType.LOGGED_IN,
                        payload: {
                          isLoggedIn: true,
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
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
