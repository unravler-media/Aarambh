
import { Category } from "../data/categories";
import { Tag, Hash } from "lucide-react";

interface CategoryHeaderProps {
  category: Category;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  return (
    <div className="bg-[#151619]/80 border border-[#2A2C36] py-8 px-6 rounded-xl mb-8 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Hash className="text-tech-red" size={18} strokeWidth={2.5} />
        <span className="text-sm text-tech-red font-medium uppercase tracking-wider">
          Category
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{category.name}</h1>
      <p className="text-gray-400 text-lg mb-4">{category.description}</p>
      <div className="flex items-center mt-2">
        <div className="flex items-center bg-tech-red/10 text-tech-red text-sm py-1.5 px-4 rounded-full">
          <Tag size={14} className="mr-1.5" strokeWidth={2.5} />
          <span>{category.postCount} articles</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
