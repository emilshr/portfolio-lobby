import { RegisterMutationPayload, useRegisterMutation } from "@/auth/mutations";
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
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInput = RegisterMutationPayload & {
  confirmPassword: string;
};

export const Register = () => {
  const { mutateAsync, isPending } = useRegisterMutation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: "Registration done",
          description: "Please check your email inbox for a confirmation link",
        });
        setOpen(false);
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Failed to register",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={(updatedState) => setOpen(updatedState)}>
      <DialogTrigger asChild>
        <p className="inline-block hover:underline cursor-pointer">Register</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Sign up</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
              <span className="flex flex-col gap-y-4">
                <span className="flex flex-col gap-y-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    {...register("email", { required: true })}
                    defaultValue="test@gmail.com"
                  />
                  <Input
                    placeholder="Your name"
                    type="text"
                    {...register("username", { required: true })}
                    defaultValue="test"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    {...register("password", {
                      required: true,
                      minLength: { value: 8, message: "Password is too short" },
                    })}
                    error={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    {...register("confirmPassword", {
                      required: true,
                      validate: (val) => {
                        if (watch("password") !== val) {
                          return "Your password do not match";
                        }
                      },
                    })}
                    error={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                </span>
                <Button disabled={isPending} type="submit">
                  Sign up
                </Button>
              </span>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
