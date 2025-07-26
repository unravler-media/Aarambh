
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import CategorySection from "../components/CategorySection";
import { usePosts } from "../hooks/usePosts";
import { categories } from "../data/categories";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { Input } from "../components/ui/input";

const Index = () => {
  const { posts, loading, error } = usePosts();
  const isMobile = useIsMobile();
  
  if (loading) {
    return <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-[#151619] rounded-xl w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
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
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 bg-[#151619] border-[#2A2C36] text-white placeholder:text-gray-400 focus:border-tech-red rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      <section className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
          {postsToShow.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
