import { ColumnDef } from "@tanstack/react-table";

export type Comment = {
  id: string;
  comment: string;
  sentiment: string;
  conf_score: string;
  isReply: boolean;
};

export const columns: ColumnDef<Comment>[] = [
  {
    accessorKey: "comment",
    header: "Comment",
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
  },
  {
    accessorKey: "conf_score",
    header: "Confidence Score",
  },
  {
    accessorKey: "isReply",
    header: "IsReply",
  },
];
