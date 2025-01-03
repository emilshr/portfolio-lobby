import { Login } from "./login";
import { Register } from "./register";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthActionType, AuthContext } from "@/auth/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout, useSendMessage } from "./mutations";
import { Message, useGetChats } from "./queries";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";

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
                .finally(() => {
                  dispatch({ type: AuthActionType.FINISHED_LOADING });
                  localStorage.removeItem("token");
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
  }
  return <></>;
};

type ChatInputProps = {
  onSendingMessage: (message: string) => void;
};

const ChatInputs = ({ onSendingMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useSendMessage({
    onSuccess() {},
  });
  return (
    <div className="flex gap-x-2 items-center pt-2">
      <Input
        placeholder="Type your message"
        className="grow"
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
        Send
      </Button>
    </div>
  );
};

type ChatRoomProps = {
  messages: Message[];
  chatWindowRef: React.MutableRefObject<HTMLDivElement | null>;
};

const ChatRoom = ({ messages, chatWindowRef: ref }: ChatRoomProps) => {
  const { state } = useContext(AuthContext);

  return (
    <ScrollArea className="max-h-full" ref={ref}>
      {messages.map(({ id, message, username }) => {
        const isOwnMessage = state.username === username;
        return (
          <div key={id} className={cn("flex gap-x-2 items-start py-1")}>
            <p
              className={cn(
                isOwnMessage
                  ? "dark:bg-slate-600 bg-slate-200 rounded-md px-2"
                  : "bg-none"
              )}
            >
              {username}:{" "}
            </p>
            <p>{message}</p>
          </div>
        );
      })}
    </ScrollArea>
  );
};

const Chat = () => {
  const {
    state: { isLoggedIn, username = "" },
  } = useContext(AuthContext);

  const { data: { data: messagesResponse } = {}, isFetched } = useGetChats();

  const [messages, setMessages] = useState<Message[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetched) {
      setMessages(messagesResponse?.messages ?? []);
    }
  }, [isFetched, messagesResponse]);

  useEffect(() => {
    if (chatWindowRef) {
      const windowElement = chatWindowRef.current?.children.item(1);
      if (windowElement && windowElement.lastElementChild) {
        windowElement.lastElementChild.scrollIntoView(false);
      }
    }
  }, [messages]);

  if (isLoggedIn) {
    return (
      <>
        <ChatRoom messages={messages} chatWindowRef={chatWindowRef} />
        <ChatInputs
          onSendingMessage={(message) => {
            setMessages([
              ...messages,
              { id: Math.random(), message, sentAt: new Date(), username },
            ]);
          }}
        />
      </>
    );
  }
  return <></>;
};

export const Lobby = () => {
  return (
    <>
      <AuthForms />
      <div className="flex flex-col max-h-full py-1 px-1">
        <LobbyNavbar />
        <Chat />
      </div>
    </>
  );
};
