"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { IKImage } from "imagekitio-react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";

import CommentSection from "@/app/components/CommentSection";
import VideoPlayerSkeleton from "@/app/components/VideoPlayerSkeleton";
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';

const VideoPage = () => {
	const { id } = useParams();
	const [video, setVideo] = useState<IVideo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const fetchVideo = async () => {
			if (!id) return;
			try {
				const response = await apiClient.getVideo(id as string);
				setVideo(response);
				console.log("Fetched video:", response);
			} catch (err) {
				setError("Failed to load video.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchVideo();
	}, [id]);

	const goBack = () => {
		window.history.back();
	};

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
						<div className="text-red-400 text-6xl mb-4">⚠</div>
						<h2 className="text-red-400 text-xl font-semibold mb-2">
							Error Loading Video
						</h2>
						<p className="text-gray-400">{error}</p>
						<button
							onClick={goBack}
							className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200">
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
				<div className="container mx-auto px-6 py-8">
					<VideoPlayerSkeleton />
				</div>
			</div>
		);
	}

	if (!video) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
						<div className="text-gray-400 text-6xl mb-4">📹</div>
						<h2 className="text-gray-300 text-xl font-semibold mb-2">
							Video Not Found
						</h2>
						<p className="text-gray-400 mb-6">
							The video you're looking for doesn't exist.
						</p>
						<button
							onClick={goBack}
							className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200">
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Helper to resolve video URL (absolute if needed)
	const getVideoUrl = (url: string | undefined | null) => {
		if (!url) return "";
		if (/^https?:\/\//.test(url)) return url;
		// Fixed the URL resolution logic
		const baseUrl =
			process.env.NEXT_PUBLIC_BASE_URL ||
			process.env.NEXT_PUBLIC_PUBLIC_KEY ||
			"http://localhost:3000";
		return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
	};

	// Helper to resolve thumbnail URL
	const getThumbnailUrl = (url: string | undefined | null) => {
		if (!url) return "";
		if (/^https?:\/\//.test(url)) return url;
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
		return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
			{/* Navigation Header */}
			<header className="relative z-10 border-b border-emerald-500/20 bg-gray-900/50 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center space-x-4">
						<button
							onClick={goBack}
							className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200 group">
							<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
							<span className="font-medium">Back</span>
						</button>
						<div className="h-6 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>
						<div className="flex items-center space-x-2">
							<div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
							<span className="text-emerald-400 text-sm font-medium">
								Video Player
							</span>
						</div>
					</div>
				</div>
			</header>

			<main className="relative z-10 container mx-auto px-6 py-12">
				{/* Video Title Section */}
				<div className="mb-8">
					<div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4">
						<div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
						<span className="text-emerald-300 text-sm font-medium">
							HD Quality
						</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
						{video.title ?? "Untitled Video"}
					</h1>
				</div>

				{/* Video Player Section */}
				<div className="mb-12">
					<div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 shadow-2xl">
						<div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-black">
							{isMounted && video.videoUrl && (
								<video
									ref={videoRef}
									src={getVideoUrl(video.videoUrl)}
									controls
									preload="metadata"
									className="w-full h-full object-contain rounded-xl"
									poster={getThumbnailUrl(video.thumbnailUrl)}
									onError={(e) => {
										console.error(
											"Video loading error:",
											e
										);
										console.log(
											"Video URL:",
											getVideoUrl(video.videoUrl)
										);
									}}
									onLoadedMetadata={() => {
										console.log(
											"Video metadata loaded successfully"
										);
									}}
									onCanPlay={() => {
										console.log("Video can start playing");
									}}>
									Your browser does not support the video tag.
								</video>
							)}

							{/* Show warning if videoUrl is not available */}
							{(!video.videoUrl ||
								getVideoUrl(video.videoUrl) === "") && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
									<div className="text-center">
										<div className="text-red-400 text-4xl mb-4">
											⚠️
										</div>
										<div className="text-red-400 text-lg font-semibold mb-2">
											Video Not Available
										</div>
										<div className="text-gray-400 text-sm">
											Video source not found or invalid
											URL
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Video Information Section */}
				{video.description && (
					<div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
						<div className="flex items-center space-x-3 mb-6">
							<div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
							<h2 className="text-xl font-semibold text-white">
								Description
							</h2>
						</div>
						<div className="prose prose-invert max-w-none">
							<p className="text-gray-300 leading-relaxed text-lg">
								{video.description}
							</p>
						</div>
					</div>
				)}

				<div className="flex items-center space-x-4 mt-4">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200">
            <ThumbsUp className="w-5 h-5" />
            <span>{video.likes.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-200">
            <ThumbsDown className="w-5 h-5" />
            <span>{video.dislikes.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        <div className="mt-8">
		  <CommentSection videoId={video._id?.toString() ?? ""} />
        </div>
			</main>
		</div>
	);
};

export default VideoPage;
