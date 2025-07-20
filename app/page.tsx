"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import VideoFeedSkeleton from "./components/VideoFeedSkeleton";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Background Pattern Overlay */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div> */}
      
      {/* Header Section */}
      <header className="relative z-10 border-b border-emerald-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo/Brand */}
              <div className="relative">
                <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent tracking-tight">
                  vire
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>
              <p className="text-gray-400 text-sm font-medium">
                Discover Amazing Content
              </p>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-400 text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-6">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-300 text-sm font-medium">Fresh Content Daily</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            Explore the Latest{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Video Collection
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Dive into our curated selection of videos, handpicked for quality and engagement
          </p>
        </div>

        {/* Video Feed Section */}
        <div className="relative">
          {/* Feed Header - Always Show */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-white">
                {loading ? "Loading Content..." : "Trending Now"}
              </h3>
              <div className="flex space-x-1">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <div className="h-1 w-4 bg-emerald-500/50 rounded-full"></div>
                <div className="h-1 w-2 bg-emerald-500/30 rounded-full"></div>
              </div>
            </div>
            {!loading && (
              <div className="text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
                {videos.length} videos available
              </div>
            )}
          </div>

          {/* Video Feed - Simplified Container */}
          {loading ? (
            <VideoFeedSkeleton />
          ) : (
            <VideoFeed videos={videos} />
          )}
        </div>

        {/* Footer Stats or Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Content Updates</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400 mb-2">HD</div>
            <div className="text-gray-400 text-sm">Quality Streaming</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400 mb-2">∞</div>
            <div className="text-gray-400 text-sm">Endless Discovery</div>
          </div>
        </div>
      </main>
    </div>
  );
}