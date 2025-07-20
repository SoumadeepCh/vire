'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { IKImage } from 'imagekitio-react';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

import VideoPlayerSkeleton from '@/app/components/VideoPlayerSkeleton';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
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
          setIsPlaying(true);
        } else {
          videoElement.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setIsMuted(videoElement.muted);
    }
  };

  const handleFullscreen = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      }
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <h2 className="text-red-400 text-xl font-semibold mb-2">Error Loading Video</h2>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={goBack}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
            >
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
            <h2 className="text-gray-300 text-xl font-semibold mb-2">Video Not Found</h2>
            <p className="text-gray-400 mb-6">The video you're looking for doesn't exist.</p>
            <button 
              onClick={goBack}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Background Pattern Overlay */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div> */}
      
      {/* Navigation Header */}
      <header className="relative z-10 border-b border-emerald-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-400 text-sm font-medium">Now Playing</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Video Title Section */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4">
            <div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
            <span className="text-emerald-300 text-sm font-medium">HD Quality</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {video.title ?? 'Untitled Video'}
          </h1>
        </div>

        {/* Video Player Section */}
        <div className="mb-12">
          <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 shadow-2xl">
            <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-black">
              {/* Video Element */}
              <video
                ref={videoRef}
                src={video.videoUrl ?? ''}
                controls={video.controls !== undefined ? video.controls : true}
                className="w-full h-full object-contain rounded-xl"
                poster={video.thumbnailUrl ?? ''}
                onClick={handleVideoClick}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Custom Control Overlay (Optional) */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-emerald-400 transition-colors duration-200"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleMuteToggle}
                      className="text-white hover:text-emerald-400 transition-colors duration-200"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-emerald-400 transition-colors duration-200"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Information Section */}
        {video.description && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white">Description</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                {video.description}
              </p>
            </div>
          </div>
        )}

        {/* Additional Stats/Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-2">HD</div>
            <div className="text-gray-400 text-sm">Video Quality</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-2">🎬</div>
            <div className="text-gray-400 text-sm">Premium Content</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-2">📱</div>
            <div className="text-gray-400 text-sm">All Devices</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;