import { useApiMutation } from "@/auth/hooks";
import { Comment } from "./queries";

export type AddCommentPayload = {
  comment: string;
  postSlug: string;
};

export const useAddComment = () => {
  return useApiMutation<Comment, AddCommentPayload>({
    method: "POST",
    mutationKey: ["comments"],
    path: ["comments"],
  });
};
