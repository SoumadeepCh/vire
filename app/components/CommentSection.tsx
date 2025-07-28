import { useState, useEffect } from 'react';
import { IComment } from '@/models/Comment';
import { apiClient } from '@/lib/api-client';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { IUser } from '@/models/User';
import mongoose, { Types } from "mongoose";
import { isIComment } from '@/lib/utils';


interface CommentSectionProps {
  videoId: string;
  session?: Session | null;
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
  const isLiked =
		sessionUserId &&
		comment.likes.some((id) => id.toString() === sessionUserId);
  const isDisliked =
		sessionUserId &&
		comment.dislikes.some((id) => id.toString() === sessionUserId);


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
          onClick={() => handleDislikeComment(comment._id?.toString() || '')}
          className={`flex items-center space-x-1 ${isDisliked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400 transition-colors duration-200`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{comment.dislikes.length}</span>
        </button>
        <button
          onClick={() => setReplyTo(comment._id?.toString() || '')}
          className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>
      {replyTo === comment._id?.toString() && (
        <form
          onSubmit={(e) => handleReplySubmit(e, comment._id?.toString() || '')}
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
        {comment.replies
          .filter(isIComment)
          .map((reply) => (
            <CommentDisplay
              key={reply._id.toString()}
              comment={reply}
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

    setComments([createdComment, ...comments] as IComment[]);
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

    const addReplyToComment = (comments: (IComment | Types.ObjectId)[], parentId: string, reply: IComment): IComment[] => {
      return comments.map(comment => {
        if (isIComment(comment) && comment._id.toString() === parentId) {
          const updatedReplies: (Types.ObjectId | IComment)[] = [...comment.replies, reply];
          return { ...comment, replies: updatedReplies.filter(isIComment) } as IComment;
        }
        if (isIComment(comment) && comment.replies.length > 0) {
          const updatedNestedReplies = addReplyToComment(comment.replies.filter(isIComment), parentId, reply);
          return { ...comment, replies: updatedNestedReplies } as IComment;
        }
        return comment;
      }).filter(isIComment);
    };

    setComments(prevComments => addReplyToComment(prevComments, parentId, createdComment) as IComment[]);
    setReplyTo(null);
    setReplyContent('');
  };

  const updateCommentLikesDislikes = (
    commentsArray: (IComment | Types.ObjectId)[],
    targetCommentId: string,
    userId: string,
    action: 'like' | 'dislike'
  ): IComment[] => {
    return commentsArray.map((comment) => {
      if (isIComment(comment) && comment._id.toString() === targetCommentId) {
        let newLikes = [...comment.likes];
        let newDislikes = [...comment.dislikes];

        const userIdObjectId = new Types.ObjectId(userId);

        if (action === 'like') {
          if (newLikes.some((id) => id.equals(userIdObjectId))) {
            newLikes = newLikes.filter(
              (id) => !id.equals(userIdObjectId)
            );
          } else {
            newLikes.push(userIdObjectId);
            newDislikes = newDislikes.filter(
              (id) => !id.equals(userIdObjectId)
            );
          }
        } else if (action === 'dislike') {
          if (newDislikes.some((id) => id.equals(userIdObjectId))) {
            newDislikes = newDislikes.filter((id) => !id.equals(userIdObjectId));
          } else {
            newDislikes.push(userIdObjectId);
            newLikes = newLikes.filter((id) => !id.equals(userIdObjectId));
          }
        }
        return { ...comment, likes: newLikes, dislikes: newDislikes } as IComment;
      } else if (isIComment(comment) && comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLikesDislikes(
            comment.replies.filter(isIComment),
            targetCommentId,
            userId,
            action
          ),
        } as IComment;
      }
      return comment;
    }).filter(isIComment);
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
        updateCommentLikesDislikes(prevComments, commentId, sessionUserId, 'dislike') as IComment[]
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
            key={(comment._id as Types.ObjectId)?.toString() || ''}
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
