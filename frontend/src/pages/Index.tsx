
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import CategorySection from "../components/CategorySection";
import { usePosts } from "../hooks/usePosts";
import { categories } from "../data/categories";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const { posts, loading, error } = usePosts();
  const isMobile = useIsMobile();
  
  if (loading) {
    return <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-[#151619] rounded-xl w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-[#151619] rounded-xl"></div>)}
          </div>
          <div className="h-12 bg-[#151619] rounded-xl w-1/3 mt-10"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-72 bg-[#151619] rounded-xl"></div>)}
          </div>
        </div>
      </Layout>;
  }

  if (error) {
    return <Layout>
        <div className="text-center py-12">
          <p className="text-red-400">Error loading posts: {error}</p>
        </div>
      </Layout>;
  }

  // Show all posts from API
  const postsToShow = posts;
  
  return (
    <Layout>
      {/* Search bar */}
      <div className="mb-8">
        <Link to="/search" className="relative w-full md:w-2/3 lg:w-1/2 block">
          <div className="bg-[#151619] rounded-xl px-4 py-3 pl-11 
                 text-gray-400 hover:border-gray-600 transition-colors flex items-center gap-3 cursor-pointer">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" size={18} />
            <span>Search articles...</span>
          </div>
        </Link>
      </div>
      
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Latest Posts</h1>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {postsToShow.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
