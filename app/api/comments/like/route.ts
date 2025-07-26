import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const userId = session.user.id;

    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (!comment || !user) {
      return NextResponse.json({ error: "Comment or User not found" }, { status: 404 });
    }

    const commentLiked = comment.likes.includes(userId);
    const commentDisliked = comment.dislikes.includes(userId);

    if (action === "like") {
      if (commentLiked) {
        // User is unliking
        await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
        await User.updateOne({ _id: userId }, { $pull: { likedComments: commentId } });
      } else {
        // User is liking
        await Comment.updateOne({ _id: commentId }, { $addToSet: { likes: userId } });
        await User.updateOne({ _id: userId }, { $addToSet: { likedComments: commentId } });
        if (commentDisliked) {
          await Comment.updateOne({ _id: commentId }, { $pull: { dislikes: userId } });
          await User.updateOne({ _id: userId }, { $pull: { dislikedComments: commentId } });
        }
      }
    } else if (action === "dislike") {
      if (commentDisliked) {
        // User is undisliking
        await Comment.updateOne({ _id: commentId }, { $pull: { dislikes: userId } });
        await User.updateOne({ _id: userId }, { $pull: { dislikedComments: commentId } });
      } else {
        // User is disliking
        await Comment.updateOne({ _id: commentId }, { $addToSet: { dislikes: userId } });
        await User.updateOne({ _id: userId }, { $addToSet: { dislikedComments: commentId } });
        if (commentLiked) {
          await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
          await User.updateOne({ _id: userId }, { $pull: { likedComments: commentId } });
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
