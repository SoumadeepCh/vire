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

    const userId = session.user._id;

    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (!comment || !user) {
      return NextResponse.json({ error: "Comment or User not found" }, { status: 404 });
    }

    const commentLiked = comment.likes.includes(userId);
    const commentDisliked = comment.dislikes.includes(userId);
    const userLikedComment = user.likedComments.includes(commentId);
    const userDislikedComment = user.dislikedComments.includes(commentId);

    if (action === "like") {
      if (commentLiked) {
        // User is unliking
        comment.likes.pull(userId);
        user.likedComments.pull(commentId);
      } else {
        // User is liking
        comment.likes.addToSet(userId);
        user.likedComments.addToSet(commentId);
        if (commentDisliked) {
          comment.dislikes.pull(userId);
          user.dislikedComments.pull(commentId);
        }
      }
    } else if (action === "dislike") {
      if (commentDisliked) {
        // User is undisliking
        comment.dislikes.pull(userId);
        user.dislikedComments.pull(commentId);
      } else {
        // User is disliking
        comment.dislikes.addToSet(userId);
        user.dislikedComments.addToSet(commentId);
        if (commentLiked) {
          comment.likes.pull(userId);
          user.likedComments.pull(commentId);
        }
      }
    }

    await comment.save();
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking/disliking comment:", error);
    return NextResponse.json(
      { error: "Failed to like/dislike comment" },
      { status: 500 }
    );
  }
}
