import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="relative">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "9/16" }}
        >
          <IKVideo
            path={video.videoUrl}
            transformation={[
              {
                height: "1920",
                width: "1080",
              },
            ]}
            controls={isHovered}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          {!isHovered && (
            <Link href={`/videos/${video._id}`} className="absolute inset-0">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-base font-semibold truncate">
            {video.title}
          </h2>
        </Link>

        <p className="text-sm text-base-content/70 mt-1 truncate">
          {video.description}
        </p>

        <div className="flex items-center mt-4">
          <button className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H9.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0112.236 10H14z"
              />
            </svg>
            <span>{video.likes?.length || 0}</span>
          </button>
          <button className="flex items-center space-x-2 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.527a2 2 0 011.789 2.894l-3.5 7A2 2 0 0110.764 14H10z"
              />
            </svg>
            <span>{video.dislikes?.length || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
