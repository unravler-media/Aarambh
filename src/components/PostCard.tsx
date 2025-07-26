
import { Link } from "react-router-dom";
import { Post } from "../hooks/usePosts";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface PostCardProps {
  post: Post;
  className?: string;
  variant?: "compact" | "default";
}

const PostCard = ({ post, className, variant = "default" }: PostCardProps) => {
  const isCompact = variant === "compact";
  
  // Generate avatar fallback using first name initial
  const getAvatarFallback = (name: string) => {
    const initial = name.split(' ')[0]?.charAt(0)?.toUpperCase() || 'U';
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#151619"/>
        <text x="16" y="20" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="14" font-weight="bold">${initial}</text>
      </svg>
    `)}`;
  };

  return (
    <Link 
      to={`/post/${post.slug}`} 
      className={cn(
        "group block relative overflow-hidden rounded-xl card-hover bg-[#151619] hover:bg-[#1A1B22] h-full transition-all duration-300", 
        className
      )}
    >
      <div className="aspect-video w-full overflow-hidden relative">
        <img 
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Link 
            to={`/category/${post.category?.slug}`} 
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-xs font-medium uppercase text-tech-red rounded-lg hover:bg-black/70 transition-colors"
          >
            {post.category?.name || 'Uncategorized'}
          </Link>
        </div>
      </div>
      
      <div className="p-5">
        <h2 className={cn(
          "font-bold line-clamp-2 mb-3 text-white group-hover:text-tech-red transition-colors", 
          isCompact ? "text-base" : "text-lg md:text-xl"
        )}>
          {post.title}
        </h2>
        
        {!isCompact && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.shortContent}</p>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#222]">
          <div className="flex items-center">
            <img 
              src={post.author.avatar || getAvatarFallback(post.author.name)} 
              alt={post.author.name}
              className="h-7 w-7 rounded-full mr-2" 
            />
            <span className="text-xs font-medium text-white">{post.author.name}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{post.publishedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
