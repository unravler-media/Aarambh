import { useState, useEffect } from "react";
import Layout from "../../components/layout.tsx";
import CategoryHeader from "../../components/CategoryHeader";
import PostCard from "../../components/PostCard";
import { API_BASE_URL } from "../../config/config.ts";

// Helper function to extract read time number from API string
const extractReadTime = (readTimeString: string): number => {
  const match = readTimeString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5; // Default to 5 minutes if no match
};

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  posts: Array<{
    id: string;
    post_title: string;
    slug: string;
    cover_image: string;
    author: {
      id: string;
      avatar: string;
      full_name: string;
    };
    read_time: string;
    is_featured: boolean;
  }> | null;
}

interface CategoryResponse {
  response: CategoryData;
}

const Category = () => {
  const url = window.location.pathname;
  const slug = url.replace(/^\/category\//, ''); // extract slug from url
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      window.location.href = "/not-found"
      // navigate("/not-found");
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/category/get?slug=${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            window.location.href = "/not-found"
            // navigate("/not-found");
            return;
          }
          throw new Error('Failed to fetch category');
        }

        const data: CategoryResponse = await response.json();
        setCategoryData(data.response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        window.location.href = "/not-found"
        // navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

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
    id: categoryData.id,
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description,
    postCount: categoryData.posts?.length || 0
  };

  // Transform posts to match PostCard expectations - handle null Posts
  const transformedPosts = (categoryData.posts || []).map(post => ({
    id: post.id,
    title: post.post_title,
    slug: post.slug,
    excerpt: "", // Not provided in API response
    shortContent: "", // Not provided in API response
    content: "", // Not provided in API response
    date: "", // Not provided in API response
    publishedAt: "", // Not provided in API response
    readTime: extractReadTime(post.read_time),
    author: {
      name: post.author.full_name,
      avatar: post.author.avatar || "",
      id: post.author.id
    },
    category: categoryForHeader,
    categoryId: categoryData.id,
    featuredImage: post.cover_image,
    coverImage: post.cover_image,
    featured: post.is_featured,
    isFeatured: post.is_featured,
    tags: [] // Not provided in API response
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryHeader category={categoryForHeader} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {transformedPosts.map(post => (
            <a href={`/posts/${post.slug}`}><PostCard key={post.id} post={post} /></a>
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
