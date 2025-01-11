import { useApiQuery } from "@/auth/hooks";

export type Comment = {
  id: number;
  comment: string;
  username: number;
  created_at: Date;
};

export const useGetComments = () => {
  return useApiQuery<Comment[]>({
    path: ["comments"],
    queryKey: ["comments"],
    refetchInterval: 10000,
  });
};
