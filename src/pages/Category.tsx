import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CategoryHeader from "../components/CategoryHeader";
import PostCard from "../components/PostCard";
import { API_BASE_URL } from "../config/api";

// Helper function to extract read time number from API string
const extractReadTime = (readTimeString: string): number => {
  const match = readTimeString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5; // Default to 5 minutes if no match
};

interface CategoryData {
  ID: string;
  Name: string;
  Slug: string;
  Description: string;
  Posts: Array<{
    ID: string;
    PostTitle: string;
    Slug: string;
    CoverImage: string;
    Author: {
      ID: string;
      Avatar: string;
      FullName: string;
    };
    ReadTime: string;
    IsFeatured: boolean;
  }> | null;
}

interface CategoryResponse {
  response: CategoryData;
}

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) {
      navigate("/not-found");
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/category/get?slug=${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            navigate("/not-found");
            return;
          }
          throw new Error('Failed to fetch category');
        }
        
        const data: CategoryResponse = await response.json();
        setCategoryData(data.response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug, navigate]);

  if (isLoading || !categoryData) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-8">
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

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2 text-white">Error loading category</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Transform the category data to match the expected format
  const categoryForHeader = {
    id: categoryData.ID,
    name: categoryData.Name,
    slug: categoryData.Slug,
    description: categoryData.Description,
    postCount: categoryData.Posts?.length || 0
  };

  // Transform posts to match PostCard expectations - handle null Posts
  const transformedPosts = (categoryData.Posts || []).map(post => ({
    id: post.ID,
    title: post.PostTitle,
    slug: post.Slug,
    excerpt: "", // Not provided in API response
    shortContent: "", // Not provided in API response
    content: "", // Not provided in API response
    date: "", // Not provided in API response
    publishedAt: "", // Not provided in API response
    readTime: extractReadTime(post.ReadTime),
    author: {
      name: post.Author.FullName,
      avatar: post.Author.Avatar || "",
      id: post.Author.ID
    },
    category: categoryForHeader,
    categoryId: categoryData.ID,
    featuredImage: post.CoverImage,
    coverImage: post.CoverImage,
    featured: post.IsFeatured,
    isFeatured: post.IsFeatured,
    tags: [] // Not provided in API response
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryHeader category={categoryForHeader} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {transformedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        {transformedPosts.length === 0 && (
          <div className="text-center py-12 bg-[#1A1B22] rounded-xl border border-[#2A2C36] mt-8">
            <h3 className="text-xl font-medium mb-2 text-white">No articles found</h3>
            <p className="text-gray-400">
              We haven't published any articles in this category yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Category;