
import { Link } from "react-router-dom";
import { Post } from "../data/posts";
import { getCategoryNameById } from "../data/posts";
import { Calendar, Clock } from "lucide-react";

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const categoryName = getCategoryNameById(post.categoryId);

  return (
    <Link 
      to={`/post/${post.slug}`} 
      className="group relative flex flex-col overflow-hidden rounded-xl bg-[#151619] hover:bg-[#1A1B22] card-hover h-full transition-all duration-300"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Link 
            to={`/category/${post.categoryId}`} 
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-xs font-medium uppercase text-tech-red rounded-lg hover:bg-black/70 transition-colors"
          >
            {categoryName}
          </Link>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 text-white group-hover:text-tech-red transition-colors">
          {post.title}
        </h2>
        
        <p className="text-gray-400 text-base line-clamp-3 mb-4 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#222]">
          <div className="flex items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="h-9 w-9 rounded-full mr-3" 
            />
            <div>
              <p className="font-medium text-sm text-white">{post.author.name}</p>
            </div>
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

export default FeaturedPost;
