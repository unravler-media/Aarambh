
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CategoryHeader from "../components/CategoryHeader";
import PostCard from "../components/PostCard";
import { getPostsByCategory } from "../data/posts";
import { categories } from "../data/categories";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const category = categories.find(cat => cat.slug === slug);
  const posts = category ? getPostsByCategory(category.id) : [];
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!slug || !category) {
      navigate("/not-found");
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [slug, category, navigate]);

  if (isLoading || !category) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-[#1A1B22] rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-[#1A1B22] rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CategoryHeader category={category} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12 bg-[#1A1B22] rounded-xl border border-[#2A2C36]">
          <h3 className="text-xl font-medium mb-2 text-white">No articles found</h3>
          <p className="text-gray-400">
            We haven't published any articles in this category yet.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Category;
