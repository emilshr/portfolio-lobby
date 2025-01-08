import { AuthForms } from "@/auth/auth-forms";
import { AuthContext } from "@/auth/state";
import { useContext } from "react";
import { useParams } from "react-router";

export const Comments = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const {
    state: { isLoggedIn },
  } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-y-4">
      <span className="flex flex-col gap-y-2">
        <h1 className="text-xl">Comments</h1>
        <hr />
      </span>
      <div>{isLoggedIn ? <></> : <AuthForms />}</div>
    </div>
  );
};
