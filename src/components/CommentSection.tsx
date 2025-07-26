
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments: initialComments }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: user.name,
        avatar: user.avatar || "",
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="py-6 w-full">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-tech-red" />
        <h2 className="text-xl md:text-2xl font-bold text-white">Comments ({comments.length})</h2>
      </div>

      {/* Add new comment */}
      {isAuthenticated && (
        <div className="mb-8 bg-[#151619] p-4 sm:p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Leave a comment</h3>
          <form onSubmit={handleSubmitComment}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm text-gray-300">Comment *</Label>
                <Textarea 
                  id="comment" 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Write your comment here..."
                  required
                  className="min-h-[120px] bg-[#1A1B22] border-[#252833] text-white"
                />
              </div>
              <Button type="submit" className="bg-tech-red hover:bg-tech-red/90 text-white">
                Post Comment
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="bg-[#151619] p-4 sm:p-6 rounded-xl border border-[#252833] transition-all"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {comment.author.avatar ? (
                <Avatar className="h-10 w-10 border border-[#252833]">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback className="bg-[#1A1B22] text-white">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 rounded-full bg-tech-red flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                  <h4 className="font-medium text-white">{comment.author.name}</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
