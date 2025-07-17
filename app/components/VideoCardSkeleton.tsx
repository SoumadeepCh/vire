import React from 'react';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="card bg-base-100 shadow-xl rounded-lg overflow-hidden animate-pulse">
      <div className="relative w-full bg-green-200 dark:bg-green-700" style={{ aspectRatio: "4/3" }}>
        {/* Placeholder for video thumbnail */}
      </div>
      <div className="card-body p-4">
        <div className="h-6 bg-green-300 dark:bg-green-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-green-300 dark:bg-green-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
