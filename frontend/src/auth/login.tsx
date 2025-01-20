import { LoginMutationPayload, useLoginMutation } from "@/auth/mutations";
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
import { useContext } from "react";
import { ForgotPassword } from "./forgot-password";
import { SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_REGEX } from "@/lib/constants";

export const Login = () => {
  const { mutateAsync, isPending } = useLoginMutation();
  const { dispatch } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMutationPayload>();

  const onSubmit: SubmitHandler<LoginMutationPayload> = (data) => {
    mutateAsync(data)
      .then(({ accessToken, username }) =>
        dispatch({
          type: AuthActionType.LOGGED_IN,
          payload: {
            token: accessToken,
            username,
          },
        })
      )
      .catch(() => dispatch({ type: AuthActionType.LOGIN_FAILED }))
      .finally(() => {
        dispatch({ type: AuthActionType.FINISHED_LOADING });
      });
  };

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <span className="flex flex-col gap-y-4">
                  <span className="flex flex-col gap-y-2">
                    <Input
                      {...register("email", {
                        pattern: {
                          value: EMAIL_REGEX,
                          message: "Enter a valid email",
                        },
                        required: true,
                      })}
                      placeholder="Email"
                      type="email"
                      error={!!errors.email}
                      errorMessage={errors.email?.message}
                    />
                    <Input
                      {...register("password", {
                        required: true,
                        minLength: {
                          value: 8,
                          message: "Password is too short",
                        },
                      })}
                      placeholder="Password"
                      type="password"
                      error={!!errors.password}
                      errorMessage={errors.password?.message}
                    />
                  </span>
                  <span className="flex flex-col gap-y-2">
                    <ForgotPassword />
                    <Button disabled={isPending} type="submit">
                      Login
                    </Button>
                  </span>
                </span>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
