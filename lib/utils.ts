import { IComment } from "@/models/Comment";

export const isIComment = (item: any): item is IComment => {
  return item && typeof item === 'object' && 'content' in item && '_id' in item;
};