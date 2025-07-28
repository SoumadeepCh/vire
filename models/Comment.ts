import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface IComment extends Document {
  _id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	video: Types.ObjectId;
	parent?: Types.ObjectId;
	content: string;
	likes: Types.ObjectId[];
	dislikes: Types.ObjectId[];
	replies: (Types.ObjectId | IComment)[];
	createdAt?: Date;
	updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
		parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
		content: { type: String, required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
		dislikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
		replies: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
	},
	{ timestamps: true }
);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
