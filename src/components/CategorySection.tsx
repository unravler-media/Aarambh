
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import { Category } from "../data/categories";
import { getPostsByCategory } from "../data/posts";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  category: Category;
}

const CategorySection = ({ category }: CategorySectionProps) => {
  const posts = getPostsByCategory(category.id).slice(0, 3);
  
  if (posts.length === 0) {
    return null;
  }
  
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <Link to={`/category/${category.slug}`} className="group">
          <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-tech-red transition-colors">
            {category.name}
          </h2>
        </Link>
        
        <Link 
          to={`/category/${category.slug}`}
          className="text-gray-400 hover:text-tech-red transition-colors flex items-center gap-2 text-sm"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
};

export default CategorySection;
