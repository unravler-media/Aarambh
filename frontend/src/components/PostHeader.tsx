
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
            src={author.avatar} 
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
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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
