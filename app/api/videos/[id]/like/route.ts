import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import mongoose from "mongoose";

export async function POST(
	req: NextRequest,
	{params}: { params: { id: string } }
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	await connectToDatabase();

	const { id } = params;
	const { action }: { action: "like" | "dislike" } = await req.json();

	try {
		const video = await Video.findById(id);

		if (!video) {
			return NextResponse.json(
				{ message: "Video not found" },
				{ status: 404 }
			);
		}

		const userId = new mongoose.Types.ObjectId(session.user._id);

		if (action === "like") {
			if (video.likes.includes(userId)) {
				video.likes = video.likes.filter(
					(like) => !like.equals(userId)
				);
			} else {
				video.likes.push(userId);
				video.dislikes = video.dislikes.filter(
					(dislike) => !dislike.equals(userId)
				);
			}
		} else if (action === "dislike") {
			if (video.dislikes.includes(userId)) {
				video.dislikes = video.dislikes.filter(
					(dislike) => !dislike.equals(userId)
				);
			} else {
				video.dislikes.push(userId);
				video.likes = video.likes.filter(
					(like) => !like.equals(userId)
				);
			}
		}

		await video.save();

		return NextResponse.json(video);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
