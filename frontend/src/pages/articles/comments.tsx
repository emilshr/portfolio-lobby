import { AuthForms } from "@/auth/auth-forms";
import { AuthContext } from "@/auth/state";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Comment, useGetComments } from "./queries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "./mutations";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CommentInputProps = {
  onAddingComment: (addedComment: Comment) => void;
};

const CommentInput = ({ onAddingComment }: CommentInputProps) => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [comment, setComment] = useState("");
  const { mutateAsync, isPending } = useAddComment();

  const { toast } = useToast();

  return (
    <div className="flex gap-x-4 items-end">
      <Textarea
        required
        aria-required
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
        }}
      />
      <Button
        disabled={isPending || comment.length === 0}
        onClick={() =>
          mutateAsync({ comment, postSlug: slug })
            .then((addedComment) => {
              onAddingComment(addedComment.data);
              toast({
                title: "Added comment",
                description: "Your comment has been successfully added",
              });
              setComment("");
            })
            .catch(() => {
              toast({
                variant: "destructive",
                title: "Uh oh",
                description: "Could not add your comment",
              });
            })
        }
      >
        <span className="flex gap-x-2">
          {isPending && <Loader2 className="animate-spin" />}
          Comment
        </span>
      </Button>
    </div>
  );
};

export const Comments = () => {
  const {
    state: { isLoggedIn },
  } = useContext(AuthContext);

  const { data: { data: commentsQuery = [] } = {}, isLoading } =
    useGetComments();

  const [comments, setComments] = useState(commentsQuery);

  return (
    <div className="flex flex-col gap-y-4">
      <span className="flex flex-col gap-y-2">
        <h1 className="text-xl">Comments</h1>
        <hr />
      </span>
      <div>
        {isLoggedIn ? (
          <CommentInput
            onAddingComment={(addedComment) => {
              const updatedComments = [...comments];
              updatedComments.unshift(addedComment);
              setComments(updatedComments);
            }}
          />
        ) : (
          <AuthForms />
        )}
      </div>
      <div className="flex flex-col gap-y-4">
        {isLoading && (
          <span className="flex gap-x-2 items-center">
            <p>Loading comments</p>
            <Loader2 className="animate-spin" />
          </span>
        )}
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map(({ id, username, comment }) => {
            return (
              <span key={id}>
                <div key={id} className="flex gap-x-2 items-start py-1">
                  <p className="dark:text-gray-400 text-gray-700">
                    {username}:{" "}
                  </p>
                  <p>{comment}</p>
                </div>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};
