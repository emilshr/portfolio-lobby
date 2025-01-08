import { useContext } from "react";
import { Login } from "./login";
import { Register } from "./register";
import { AuthContext } from "./state";
import { Loader2 } from "lucide-react";

export const AuthForms = () => {
  const {
    state: { loading },
  } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-2 pb-4">
        <div className="flex gap-x-2 items-center">
          <p className="dark:text-neutral-400 text-neutral-500">
            Checking if you are logged in or not
          </p>
          <Loader2 className="animate-spin" size="20" />
        </div>
      </div>
    );
  }

  return (
    <div className="block space-x-1">
      <Login />
      <p className="inline-block">or</p>
      <Register />
      <p className="inline-block">to leave a message</p>
    </div>
  );
};
