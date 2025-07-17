import React from 'react';

const VideoPlayerSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-green-300 dark:bg-green-700 rounded w-3/4 mb-4"></div>
      <div className="aspect-w-16 aspect-h-9 mb-4 bg-green-300 dark:bg-green-700 rounded">
        {/* Placeholder for video player */}
      </div>
      <div className="h-6 bg-green-300 dark:bg-green-700 rounded w-full mb-2"></div>
      <div className="h-6 bg-green-300 dark:bg-green-700 rounded w-5/6"></div>
    </div>
  );
};

export default VideoPlayerSkeleton;
