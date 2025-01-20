import { useContext, useEffect, useState } from "react";
import { AuthActionType, AuthContext } from "@/auth/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout, useSendMessage } from "./mutations";
import { Message, useGetChats } from "./queries";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useAuthRefresher } from "@/auth/auth-refresher";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AuthForms } from "@/auth/auth-forms";
import { Loader2 } from "lucide-react";

const LobbyNavbar = () => {
  const {
    state: { isLoggedIn, username },
    dispatch,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLogout();

  if (isLoggedIn) {
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
  }

  return (
    <div className="flex flex-col gap-y-2 pb-6">
      <AuthForms />
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
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  isLoading: boolean;
};

const ChatRoom = ({
  messages,
  onNext,
  onPrevious,
  isNextDisabled,
  isPreviousDisabled,
  isLoading,
}: ChatRoomProps) => {
  if (messages.length === 0) {
    return <div className="h-full pt-4">No guests visited yet</div>;
  }

  return (
    <div className="h-full">
      <div>
        {isLoading && (
          <span className="flex gap-x-2 items-center">
            <p>Loading notes</p>
            <Loader2 className="animate-spin" />
          </span>
        )}
        {messages.map(({ id, message, username }) => {
          return (
            <div key={id} className={cn("flex gap-x-2 items-start py-1")}>
              <p className="dark:text-gray-400 text-gray-700">{username}: </p>
              <p>{message}</p>
            </div>
          );
        })}
      </div>
      {messages.length >= 20 && (
        <div className="w-full">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationPrevious
                isActive={!isPreviousDisabled}
                onClick={() => {
                  if (!isPreviousDisabled) {
                    onPrevious();
                  }
                }}
                aria-disabled={!isPreviousDisabled}
              />
              <PaginationNext
                isActive={!isNextDisabled}
                onClick={() => {
                  if (!isNextDisabled) {
                    onNext();
                  }
                }}
                aria-disabled={!isNextDisabled}
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const {
    state: { username = "" },
  } = useContext(AuthContext);
  const [page, setPage] = useState(0);

  const {
    data: { data: messagesResponse } = {},
    isFetched,
    isLoading,
  } = useGetChats(page);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (isFetched) {
      setMessages(messagesResponse?.data ?? []);
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
            sent_at: new Date(),
            username,
          });
          setMessages(updatedMessages);
        }}
      />
      <ChatRoom
        messages={messages}
        onNext={() => {
          setPage(page + 1);
        }}
        onPrevious={() => {
          setPage(page - 1);
        }}
        isNextDisabled={!messagesResponse?.has_more_records}
        isPreviousDisabled={page === 0}
        isLoading={isLoading}
      />
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
