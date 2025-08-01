import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId, action } = await req.json();

  if (!videoId || !action) {
    return NextResponse.json(
      { error: "Video ID and action are required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const userId = session.user.id;

    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    if (!video || !user) {
      return NextResponse.json({ error: "Video or User not found" }, { status: 404 });
    }

    const videoLiked = video.likes.includes(userId);
    const videoDisliked = video.dislikes.includes(userId);

    if (action === "like") {
      if (videoLiked) {
        // User is unliking
        await Video.updateOne({ _id: videoId }, { $pull: { likes: userId } });
        await User.updateOne({ _id: userId }, { $pull: { likedVideos: videoId } });
      } else {
        // User is liking
        await Video.updateOne({ _id: videoId }, { $addToSet: { likes: userId } });
        await User.updateOne({ _id: userId }, { $addToSet: { likedVideos: videoId } });
        if (videoDisliked) {
          await Video.updateOne({ _id: videoId }, { $pull: { dislikes: userId } });
          await User.updateOne({ _id: userId }, { $pull: { dislikedVideos: videoId } });
        }
      }
    } else if (action === "dislike") {
      if (videoDisliked) {
        // User is undisliking
        await Video.updateOne({ _id: videoId }, { $pull: { dislikes: userId } });
        await User.updateOne({ _id: userId }, { $pull: { dislikedVideos: videoId } });
      } else {
        // User is disliking
        await Video.updateOne({ _id: videoId }, { $addToSet: { dislikes: userId } });
        await User.updateOne({ _id: userId }, { $addToSet: { dislikedVideos: videoId } });
        if (videoLiked) {
          await Video.updateOne({ _id: videoId }, { $pull: { likes: userId } });
          await User.updateOne({ _id: userId }, { $pull: { likedVideos: videoId } });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking/disliking video:", error);
    return NextResponse.json(
      { error: "Failed to like/dislike video" },
      { status: 500 }
    );
  }
}
