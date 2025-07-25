
import { Share2, Bookmark } from "lucide-react";

interface PostFooterProps {
  author: {
    name: string;
    avatar: string;
  };
}

const PostFooter = ({ author }: PostFooterProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8 pt-6 border-t border-[#252833]">
      <div className="flex items-center">
        {author.avatar ? (
          <img 
            src={author.avatar} 
            alt={author.name}
            className="h-10 w-10 rounded-full mr-3" 
          />
        ) : (
          <div className="h-10 w-10 rounded-full mr-3 bg-tech-red flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-white text-sm">{author.name}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="p-2 bg-[#151619] text-gray-400 hover:text-white rounded-full transition-colors">
          <Share2 size={18} />
        </button>
        <button className="p-2 bg-[#151619] text-gray-400 hover:text-white rounded-full transition-colors">
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostFooter;
