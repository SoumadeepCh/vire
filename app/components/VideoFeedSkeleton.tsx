import React from 'react';
import VideoCardSkeleton from './VideoCardSkeleton';

const VideoFeedSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default VideoFeedSkeleton;
