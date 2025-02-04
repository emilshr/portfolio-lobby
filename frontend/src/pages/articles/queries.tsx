import { useApiQuery } from "@/auth/hooks";

export type Comment = {
  id: number;
  comment: string;
  username: number;
  created_at: Date;
};

type GetCommentsRequest = {
  slug: string;
};

export const useGetComments = ({ slug }: GetCommentsRequest) => {
  return useApiQuery<Comment[]>({
    path: ["comments", slug],
    queryKey: ["comments", slug],
    refetchInterval: 10000,
  });
};
