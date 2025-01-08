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

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const { mutateAsync, isPending } = useGetResetPassword();

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
            <span className="flex flex-col gap-y-4">
              <span className="flex flex-col gap-y-2">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </span>
              <Button
                disabled={isPending || email.length === 0}
                onClick={() => {
                  mutateAsync({ email })
                    .then(() => {
                      setOpen(false);
                      toast({
                        title: "Reset password",
                        description:
                          "Reset password instructions sent to your inbox",
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
                }}
              >
                Reset password
              </Button>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
