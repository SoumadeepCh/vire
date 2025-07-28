import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose"; // ✅ Add this

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { commentId, action } = await req.json();

	if (!commentId || !action) {
		return NextResponse.json(
			{ error: "Comment ID and action are required" },
			{ status: 400 }
		);
	}

	try {
		await connectToDatabase();

		const userIdStr = session.user.id;

		// ✅ Convert to ObjectId
		const userId = new Types.ObjectId(userIdStr);
		const commentObjId = new Types.ObjectId(commentId);

		const comment = await Comment.findById(commentObjId);
		const user = await User.findById(userId);

		if (!comment || !user) {
			return NextResponse.json(
				{ error: "Comment or User not found" },
				{ status: 404 }
			);
		}

		const commentLiked = comment.likes.some((id: any) => id.equals(userId));
		const commentDisliked = comment.dislikes.some((id: any) =>
			id.equals(userId)
		);

		if (action === "like") {
			if (commentLiked) {
				await Comment.updateOne(
					{ _id: commentObjId },
					{ $pull: { likes: userId } }
				);
				await User.updateOne(
					{ _id: userId },
					{ $pull: { likedComments: commentObjId } }
				);
			} else {
				await Comment.updateOne(
					{ _id: commentObjId },
					{ $addToSet: { likes: userId } }
				);
				await User.updateOne(
					{ _id: userId },
					{ $addToSet: { likedComments: commentObjId } }
				);
				if (commentDisliked) {
					await Comment.updateOne(
						{ _id: commentObjId },
						{ $pull: { dislikes: userId } }
					);
					await User.updateOne(
						{ _id: userId },
						{ $pull: { dislikedComments: commentObjId } }
					);
				}
			}
		} else if (action === "dislike") {
			if (commentDisliked) {
				await Comment.updateOne(
					{ _id: commentObjId },
					{ $pull: { dislikes: userId } }
				);
				await User.updateOne(
					{ _id: userId },
					{ $pull: { dislikedComments: commentObjId } }
				);
			} else {
				await Comment.updateOne(
					{ _id: commentObjId },
					{ $addToSet: { dislikes: userId } }
				);
				await User.updateOne(
					{ _id: userId },
					{ $addToSet: { dislikedComments: commentObjId } }
				);
				if (commentLiked) {
					await Comment.updateOne(
						{ _id: commentObjId },
						{ $pull: { likes: userId } }
					);
					await User.updateOne(
						{ _id: userId },
						{ $pull: { likedComments: commentObjId } }
					);
				}
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error liking/disliking comment:", error);
		return NextResponse.json(
			{ error: "Failed to like/dislike comment" },
			{ status: 500 }
		);
	}
}
