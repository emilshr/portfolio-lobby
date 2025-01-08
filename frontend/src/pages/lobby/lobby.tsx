import { Login } from "../../auth/login";
import { Register } from "../../auth/register";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthActionType, AuthContext } from "@/auth/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout, useSendMessage } from "./mutations";
import { Message, useGetChats } from "./queries";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useAuthRefresher } from "@/auth/auth-refresher";
import { Loader2 } from "lucide-react";

const AuthForms = () => {
  return (
    <div className="flex flex-col gap-y-2 pb-6">
      <div className="block space-x-1">
        <Login />
        <p className="inline-block">or</p>
        <Register />
        <p className="inline-block">to leave a message</p>
      </div>
      <hr />
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
    return (
      <div className="flex flex-col gap-y-2 pb-4">
        <div className="flex gap-x-2 items-center">
          <p className="dark:text-neutral-400 text-neutral-500">
            Checking if you are logged in or not
          </p>
          <Loader2 className="animate-spin" size="20" />
        </div>
        <hr />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthForms />;
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="flex justify-between">
        <h2>Welcome @{username}</h2>
        <Button
          variant="link"
          onClick={() => {
            dispatch({ type: AuthActionType.START_LOADING });
            mutateAsync()
              .then(() => {
                dispatch({ type: AuthActionType.LOGGED_OUT });
                navigate("/");
              })
              .finally(() => {
                dispatch({ type: AuthActionType.FINISHED_LOADING });
              });
          }}
          disabled={isPending}
        >
          Log out
        </Button>
      </div>
      <hr />
    </div>
  );
};

type ChatInputProps = {
  onSendingMessage: (message: string) => void;
};

const ChatInputs = ({ onSendingMessage }: ChatInputProps) => {
  const {
    state: { isLoggedIn },
  } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useSendMessage({
    onSuccess() {},
  });

  if (!isLoggedIn) {
    return <></>;
  }

  return (
    <div className="flex gap-x-2 items-center pb-2">
      <Input
        placeholder="Leave a note"
        className="grow text-sm"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyUp={(event) => {
          if (event.key.toLowerCase() === "enter") {
            onSendingMessage(message);
            mutate({ message });
            setMessage("");
          }
        }}
      />
      <Button
        disabled={isPending || message.length === 0}
        onClick={() => {
          onSendingMessage(message);
          mutate({ message });
          setMessage("");
        }}
      >
        Sign
      </Button>
    </div>
  );
};

type ChatRoomProps = {
  messages: Message[];
  chatWindowRef: React.MutableRefObject<HTMLDivElement | null>;
};

const ChatRoom = ({ messages }: ChatRoomProps) => {
  if (messages.length === 0) {
    return <div className="h-full pt-4">No guests visited yet</div>;
  }

  return (
    <div className="h-full">
      {messages.map(({ id, message, username }) => {
        return (
          <div key={id} className={cn("flex gap-x-2 items-start py-1")}>
            <p className="dark:text-gray-400 text-gray-700">{username}: </p>
            <p>{message}</p>
          </div>
        );
      })}
    </div>
  );
};

const Chat = () => {
  const {
    state: { username = "" },
  } = useContext(AuthContext);

  const { data: { data: messagesResponse } = {}, isFetched } = useGetChats();

  const [messages, setMessages] = useState<Message[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetched) {
      setMessages(messagesResponse?.messages ?? []);
    }
  }, [isFetched, messagesResponse]);

  return (
    <>
      <ChatInputs
        onSendingMessage={(message) => {
          const updatedMessages = [...messages];
          updatedMessages.unshift({
            id: Math.random(),
            message,
            sentAt: new Date(),
            username,
          });
          console.log({ updatedMessages, messages });
          setMessages(updatedMessages);
        }}
      />
      <ChatRoom messages={messages} chatWindowRef={chatWindowRef} />
    </>
  );
};

export const Lobby = () => {
  useAuthRefresher();
  return (
    <>
      <div className="flex flex-col max-h-full py-1 px-1">
        <LobbyNavbar />
        <Chat />
      </div>
    </>
  );
};
