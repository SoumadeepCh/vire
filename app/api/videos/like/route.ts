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

    const userId = session.user._id;

    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    if (!video || !user) {
      return NextResponse.json({ error: "Video or User not found" }, { status: 404 });
    }

    const videoLiked = video.likes.includes(userId);
    const videoDisliked = video.dislikes.includes(userId);
    const userLikedVideo = user.likedVideos.includes(videoId);
    const userDislikedVideo = user.dislikedVideos.includes(videoId);

    if (action === "like") {
      if (videoLiked) {
        // User is unliking
        video.likes.pull(userId);
        user.likedVideos.pull(videoId);
      } else {
        // User is liking
        video.likes.addToSet(userId);
        user.likedVideos.addToSet(videoId);
        if (videoDisliked) {
          video.dislikes.pull(userId);
          user.dislikedVideos.pull(videoId);
        }
      }
    } else if (action === "dislike") {
      if (videoDisliked) {
        // User is undisliking
        video.dislikes.pull(userId);
        user.dislikedVideos.pull(videoId);
      } else {
        // User is disliking
        video.dislikes.addToSet(userId);
        user.dislikedVideos.addToSet(videoId);
        if (videoLiked) {
          video.likes.pull(userId);
          user.likedVideos.pull(videoId);
        }
      }
    }

    await video.save();
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking/disliking video:", error);
    return NextResponse.json(
      { error: "Failed to like/dislike video" },
      { status: 500 }
    );
  }
}
