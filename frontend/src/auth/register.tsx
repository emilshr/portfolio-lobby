import { useRegisterMutation } from "@/auth/mutations";
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

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useRegisterMutation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(updatedState) => setOpen(updatedState)}>
      <DialogTrigger asChild>
        <p className="inline-block hover:underline cursor-pointer">Register</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Sign up</DialogTitle>
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
                  placeholder="Your name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </span>
              <Button
                disabled={isPending}
                onClick={() => {
                  mutateAsync({ email, password, username: name })
                    .then(() => {
                      toast({
                        title: "Registration done",
                        description:
                          "Please check your email inbox for a confirmation link",
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
                }}
              >
                Sign up
              </Button>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
