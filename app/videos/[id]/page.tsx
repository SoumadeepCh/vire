'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { IKImage } from 'imagekitio-react';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';

import VideoPlayerSkeleton from '@/app/components/VideoPlayerSkeleton';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      try {
        const response = await apiClient.getVideo(id as string);
        setVideo(response);
      } catch (err) {
        setError('Failed to load video.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (document.fullscreenElement) {
      e.preventDefault();
      const videoElement = videoRef.current;
      if (videoElement) {
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (loading) {
    return <VideoPlayerSkeleton />;
  }

  if (!video) {
    return <div className="text-center mt-10 text-gray-500">Video not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{video.title ?? 'Untitled Video'}</h1>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <video
          ref={videoRef}
          src={video.videoUrl ?? ''}
          controls={video.controls !== undefined ? video.controls : true}
          className="w-full h-full object-contain"
          poster={video.thumbnailUrl ?? ''}
          onClick={handleVideoClick}
        />
      </div>
      <p className="text-gray-600">{video.description ?? ''}</p>
    </div>
  );
};

export default VideoPage;
