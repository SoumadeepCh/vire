import { useState, useEffect } from 'react';
import { IComment } from '@/models/Comment';
import { apiClient } from '@/lib/api-client';
import { useSession } from 'next-auth/react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { IUser } from '@/models/User';

interface CommentSectionProps {
  videoId: string;
}

interface CommentDisplayProps {
  comment: IComment;
  level: number;
  videoId: string;
  sessionUserId: string | undefined;
  handleLikeComment: (commentId: string) => Promise<void>;
  handleDislikeComment: (commentId: string) => Promise<void>;
  handleReplySubmit: (e: React.FormEvent, parentId: string) => Promise<void>;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({
  comment,
  level,
  videoId,
  sessionUserId,
  handleLikeComment,
  handleDislikeComment,
  handleReplySubmit,
  replyTo,
  setReplyTo,
  replyContent,
  setReplyContent,
}) => {
  const isLiked = sessionUserId && comment.likes.includes(sessionUserId);
  const isDisliked = sessionUserId && comment.dislikes.includes(sessionUserId);

  return (
    <div className={`mt-4 ${level > 0 ? 'ml-8' : ''}`}>
      <p className="text-gray-300 text-sm">
        {(comment.user as IUser)?.email || 'Anonymous'}
      </p>
      <p className="text-white text-base">{comment.content}</p>
      <div className="flex items-center space-x-4 mt-2">
        <button
          onClick={() => handleLikeComment(comment._id?.toString() || '')}
          className={`flex items-center space-x-1 ${isLiked ? 'text-emerald-400' : 'text-gray-400'} hover:text-emerald-400 transition-colors duration-200`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{comment.likes.length}</span>
        </button>
        <button
          onClick={() => handleDislikeComment(comment._id.toString())}
          className={`flex items-center space-x-1 ${isDisliked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400 transition-colors duration-200`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{comment.dislikes.length}</span>
        </button>
        <button
          onClick={() => setReplyTo(comment._id.toString())}
          className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>
      {replyTo === comment._id.toString() && (
        <form
          onSubmit={(e) => handleReplySubmit(e, comment._id.toString())}
          className="mt-2"
        >
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Add a reply..."
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Reply
          </button>
        </form>
      )}
      <div className="ml-4 mt-2">
        {comment.replies.map((reply) => (
          <CommentDisplay
            key={(reply as IComment)._id.toString()}
            comment={reply as IComment}
            level={level + 1}
            videoId={videoId}
            sessionUserId={sessionUserId}
            handleLikeComment={handleLikeComment}
            handleDislikeComment={handleDislikeComment}
            handleReplySubmit={handleReplySubmit}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
          />
        ))}
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const sessionUserId = session?.user?.id?.toString();

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await apiClient.getComments(videoId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [videoId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const createdComment = await apiClient.createComment({
      videoId,
      content: newComment,
    });

    setComments([createdComment, ...comments]);
    setNewComment('');
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const createdComment = await apiClient.createComment({
      videoId,
      content: replyContent,
      parentId,
    });

    const addReplyToComment = (comments: IComment[], parentId: string, reply: IComment): IComment[] => {
      return comments.map(comment => {
        if (comment._id.toString() === parentId) {
          return { ...comment, replies: [...comment.replies, reply] };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: addReplyToComment(comment.replies as IComment[], parentId, reply) };
        }
        return comment;
      });
    };

    setComments(prevComments => addReplyToComment(prevComments, parentId, createdComment));
    setReplyTo(null);
    setReplyContent('');
  };

  const updateCommentLikesDislikes = (
    commentsArray: IComment[],
    targetCommentId: string,
    userId: string,
    action: 'like' | 'dislike'
  ): IComment[] => {
    return commentsArray.map((comment) => {
      if (comment._id.toString() === targetCommentId) {
        let newLikes = [...comment.likes];
        let newDislikes = [...comment.dislikes];

        if (action === 'like') {
          if (newLikes.includes(userId)) {
            newLikes = newLikes.filter((id) => id.toString() !== userId.toString());
          } else {
            newLikes.push(userId);
            newDislikes = newDislikes.filter((id) => id.toString() !== userId.toString());
          }
        } else if (action === 'dislike') {
          if (newDislikes.includes(userId)) {
            newDislikes = newDislikes.filter((id) => id.toString() !== userId.toString());
          } else {
            newDislikes.push(userId);
            newLikes = newLikes.filter((id) => id.toString() !== userId.toString());
          }
        }
        return { ...comment, likes: newLikes, dislikes: newDislikes };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLikesDislikes(
            comment.replies as IComment[],
            targetCommentId,
            userId,
            action
          ),
        };
      }
      return comment;
    });
  };

  const handleLikeComment = async (commentId: string) => {
    if (!sessionUserId) return;

    try {
      await apiClient.likeComment(commentId);
      setComments((prevComments) =>
        updateCommentLikesDislikes(prevComments, commentId, sessionUserId, 'like')
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    if (!sessionUserId) return;

    try {
      await apiClient.dislikeComment(commentId);
      setComments((prevComments) =>
        updateCommentLikesDislikes(prevComments, commentId, sessionUserId, 'dislike')
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
      <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>
      {session && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
            rows={3}
          />
          <button
            type="submit"
            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Comment
          </button>
        </form>
      )}
      <div>
        {comments.map((comment) => (
          <CommentDisplay
            key={comment._id.toString()}
            comment={comment}
            level={0}
            videoId={videoId}
            sessionUserId={sessionUserId}
            handleLikeComment={handleLikeComment}
            handleDislikeComment={handleDislikeComment}
            handleReplySubmit={handleReplySubmit}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
