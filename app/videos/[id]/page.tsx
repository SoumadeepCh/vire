"use client";

import { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import CommentSection from "@/app/components/CommentSection";
import { useSession } from "next-auth/react";
import VideoComponent from "@/app/components/VideoComponent";

interface VideoPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function VideoPage({ params }: VideoPageProps) {
  const { id } = params;
  const [video, setVideo] = useState<IVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await res.json();
        setVideo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">Video not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoComponent video={video} />
        </div>
        <div>
          <CommentSection videoId={id} session={session} />
        </div>
      </div>
    </div>
  );
}

