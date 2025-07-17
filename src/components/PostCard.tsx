
import { Link } from "react-router-dom";
import { Post } from "../data/posts";
import { getCategoryNameById } from "../data/posts";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
  className?: string;
  variant?: "compact" | "default";
}

const PostCard = ({ post, className, variant = "default" }: PostCardProps) => {
  const isCompact = variant === "compact";
  const categoryName = getCategoryNameById(post.categoryId);

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
            to={`/category/${post.categoryId}`} 
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-xs font-medium uppercase text-tech-red rounded-lg hover:bg-black/70 transition-colors"
          >
            {categoryName}
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
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#222]">
          <div className="flex items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="h-7 w-7 rounded-full mr-2" 
            />
            <span className="text-xs font-medium text-white">{post.author.name}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <div className="flex items-center mr-3">
              <Calendar size={12} className="mr-1" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
