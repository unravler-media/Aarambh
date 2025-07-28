
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in again to post a comment.",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createComment}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          comment_text: newComment,
          post_id: postId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const responseData = await response.json();
      
      // Create optimistic comment for immediate UI update using response data
      const optimisticComment: Comment = {
        id: responseData.response.id,
        author: {
          name: user.username, // Use username instead of full name
          avatar: user.avatar || "",
        },
        content: newComment,
        createdAt: responseData.response.updated_at,
        likes: 0,
      };
      
      setComments([optimisticComment, ...comments]);
      setNewComment("");
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-tech-red hover:bg-tech-red/90 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
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
                     {comment.createdAt}
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
