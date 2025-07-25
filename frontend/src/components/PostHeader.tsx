
import { Calendar, Clock } from "lucide-react";

interface PostHeaderProps {
  title: string;
  categoryName: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
}

const PostHeader = ({ title, categoryName, author, publishedAt, readTime }: PostHeaderProps) => {
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
    <>
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        <span className="px-3 py-1 bg-[#151619] text-tech-red rounded-lg text-xs font-medium uppercase">
          {categoryName}
        </span>
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
        {title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-b border-[#252833] py-4 mb-6 sm:mb-8 gap-4">
        <div className="flex items-center">
          <img 
            src={author.avatar || getAvatarFallback(author.name)} 
            alt={author.name}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full mr-3 sm:mr-4" 
          />
          <div>
            <p className="font-medium text-white">{author.name}</p>
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm gap-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>
            {publishedAt}
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostHeader;
