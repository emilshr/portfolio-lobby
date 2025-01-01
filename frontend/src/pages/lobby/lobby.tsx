import { Login } from "./login";
import { Register } from "./register";
import { useContext, useState } from "react";
import { AuthActionType, AuthContext } from "@/auth/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout, useSendMessage } from "./mutations";
import { useGetChats } from "./queries";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

const AuthForms = () => {
  const {
    state: { isLoggedIn, loading },
  } = useContext(AuthContext);

  if (loading) {
    return <>Loading ...</>;
  }

  if (isLoggedIn) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <Register />
      <Login />
    </div>
  );
};

const LobbyNavbar = () => {
  const {
    state: { isLoggedIn, loading, username },
    dispatch,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLogout();

  if (loading) {
    return <>Loading ...</>;
  }

  if (isLoggedIn) {
    return (
      <div className="flex flex-col pb-4">
        <div className="flex justify-between">
          <h2 className="text-lg italic">Welcome @{username}</h2>
          <Button
            variant="link"
            onClick={() => {
              dispatch({ type: AuthActionType.START_LOADING });
              mutateAsync()
                .then(() => {
                  dispatch({ type: AuthActionType.LOGGED_OUT });
                  navigate("/");
                })
                .finally(() =>
                  dispatch({ type: AuthActionType.FINISHED_LOADING })
                );
            }}
            disabled={isPending}
          >
            Log out
          </Button>
        </div>
        <hr />
      </div>
    );
  }
  return <></>;
};

const ChatInputs = () => {
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useSendMessage({
    onSuccess() {
      setMessage("");
    },
  });
  return (
    <div className="flex gap-x-2 items-center">
      <Input
        placeholder="Type your message"
        className="grow"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button
        disabled={isPending || message.length === 0}
        onClick={() => {
          mutate({ message });
        }}
      >
        Send
      </Button>
    </div>
  );
};

const ChatRoom = () => {
  const { data = [] } = useGetChats();
  // const context = useContext(AuthContext);
  return (
    <div className="h-full flex flex-col gap-y-2">
      {data.map(({ id, message, sentAt, username }) => (
        <div
          key={id}
          className={cn(
            "flex"
            // context.username === username ? "justify-end" : "justify-start"
          )}
        >
          <p>{new Date(sentAt).toISOString()}</p>
          <p>@{username} - </p>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const {
    state: { isLoggedIn },
  } = useContext(AuthContext);

  if (isLoggedIn) {
    return (
      <div className="grow flex">
        <div className="flex flex-col grow justify-between gap-y-4">
          <ChatRoom />
          <ChatInputs />
        </div>
      </div>
    );
  }
  return <></>;
};

export const Lobby = () => {
  return (
    <div className="flex flex-col grow">
      <LobbyNavbar />
      <AuthForms />
      <Chat />
    </div>
  );
};
