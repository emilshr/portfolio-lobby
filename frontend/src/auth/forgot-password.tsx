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
import { useState } from "react";
import { useGetResetPassword } from "./mutations";
import { useToast } from "@/hooks/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_REGEX } from "@/lib/constants";

export const ForgotPassword = () => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const { mutateAsync, isPending } = useGetResetPassword();

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<{ email: string }>();

  const onSubmit: SubmitHandler<{ email: string }> = ({ email }) => {
    mutateAsync({ email })
      .then(() => {
        setOpen(false);
        toast({
          title: "Reset password",
          description: "Reset password instructions sent to your inbox",
        });
      })
      .catch(() => {
        toast({
          title: "Uh oh",
          description:
            "An error occurred while generating the reset password link",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={(updatedState) => setOpen(updatedState)}>
      <DialogTrigger asChild>
        <Button variant="link" onClick={() => setOpen(true)}>
          Reset password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Sign in</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
              <span className="flex flex-col gap-y-4">
                <span className="flex flex-col gap-y-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: EMAIL_REGEX,
                        message: "Enter a valid email",
                      },
                    })}
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                </span>
                <Button
                  disabled={isPending || watch("email")?.length === 0}
                  type="submit"
                >
                  Reset password
                </Button>
              </span>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
