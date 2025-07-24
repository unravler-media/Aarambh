
import { BookOpen } from "lucide-react";
import PostCard from "./PostCard";
import { Post } from "../hooks/usePosts";

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;
  
  return (
    <div className="mb-8 w-full">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={20} className="text-tech-red" />
        <h2 className="text-xl md:text-2xl font-bold text-white">More Articles Like This</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
