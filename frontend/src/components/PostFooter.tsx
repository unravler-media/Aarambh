
import { Share2, Bookmark } from "lucide-react";

interface PostFooterProps {
  author: {
    name: string;
    avatar: string;
  };
}

const PostFooter = ({ author }: PostFooterProps) => {
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8 pt-6 border-t border-[#252833]">
      <div className="flex items-center">
        <img 
          src={author.avatar || getAvatarFallback(author.name)}
          alt={author.name}
          className="h-10 w-10 rounded-full mr-3" 
        />
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
