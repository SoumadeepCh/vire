import { IVideo } from "@/models/Video";
import { IComment } from "@/models/Comment";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/videos");
  }

  async getVideo(id: string) {
    return this.fetch<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async getComments(videoId: string) {
    return this.fetch<IComment[]>(`/comments?videoId=${videoId}`);
  }

  async createComment(commentData: { videoId: string; content: string; parentId?: string }) {
    return this.fetch<IComment>("/comments", {
      method: "POST",
      body: commentData,
    });
  }

  async likeVideo(videoId: string) {
    return this.fetch("/videos/like", {
      method: "POST",
      body: { videoId, action: "like" },
    });
  }

  async dislikeVideo(videoId: string) {
    return this.fetch("/videos/like", {
      method: "POST",
      body: { videoId, action: "dislike" },
    });
  }

  async likeComment(commentId: string) {
    return this.fetch("/comments/like", {
      method: "POST",
      body: { commentId, action: "like" },
    });
  }

  async dislikeComment(commentId: string) {
    return this.fetch("/comments/like", {
      method: "POST",
      body: { commentId, action: "dislike" },
    });
  }
}

export const apiClient = new ApiClient();
