import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/Comment";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const comments = await Comment.find({ video: videoId, parent: null })
      .populate("user", "email")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "email",
          model: "User",
        },
      })
      .populate({
        path: "replies",
        populate: {
          path: "replies",
          populate: {
            path: "user",
            select: "email",
            model: "User",
          },
        },
      })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId, content, parentId } = await req.json();

  if (!videoId || !content) {
    return NextResponse.json(
      { error: "Video ID and content are required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const newComment = new Comment({
      user: session.user.id,
      video: videoId,
      content,
      parent: parentId,
    });

    await newComment.save();

    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: newComment._id },
      });
    } else {
      await Video.findByIdAndUpdate(videoId, {
        $push: { comments: newComment._id },
      });
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
