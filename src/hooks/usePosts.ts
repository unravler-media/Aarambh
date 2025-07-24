import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface ApiPost {
  id: string;
  updated_at: string;
  post_title: string;
  slug: string;
  conver_image: string;
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar: string;
    role: string;
  };
  read_time: string;
  is_featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ApiPostDetail {
  ID: string;
  UpdatedAt: string;
  PostTitle: string;
  Slug: string;
  ShortContent: string;
  Content: string;
  CoverImage: string;
  Author: {
    id: string;
    username: string;
    full_name: string;
    avatar: string;
    role: string;
  };
  Category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  publishedAt: string;
  readTime: number;
  isFeatured: boolean;
}

// Helper function to extract read time number from API string
const extractReadTime = (readTimeString: string): number => {
  const match = readTimeString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5; // Default to 5 minutes if no match
};

// Transform API post to internal format
const transformApiPost = (apiPost: ApiPost): Post => ({
  id: apiPost.id,
  title: apiPost.post_title,
  slug: apiPost.slug,
  excerpt: '', // Not available in list API
  content: '', // Not available in list API
  coverImage: apiPost.conver_image,
  author: {
    id: apiPost.author.id,
    name: apiPost.author.full_name,
    avatar: apiPost.author.avatar,
  },
  category: apiPost.category,
  categoryId: apiPost.category.id,
  publishedAt: apiPost.updated_at,
  readTime: extractReadTime(apiPost.read_time),
  isFeatured: apiPost.is_featured,
});

// Transform API post detail to internal format
const transformApiPostDetail = (apiPost: ApiPostDetail): Post => ({
  id: apiPost.ID,
  title: apiPost.PostTitle,
  slug: apiPost.Slug,
  excerpt: apiPost.ShortContent,
  content: apiPost.Content,
  coverImage: apiPost.CoverImage,
  author: {
    id: apiPost.Author.id,
    name: apiPost.Author.full_name,
    avatar: apiPost.Author.avatar,
  },
  category: apiPost.Category,
  categoryId: apiPost.Category.id,
  publishedAt: apiPost.UpdatedAt,
  readTime: 5, // Default read time for detail API
  isFeatured: false, // Not available in detail API
});

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.posts}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const transformedPosts = data.response.map(transformApiPost);
        setPosts(transformedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export const usePost = (slug: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.post}?post=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        const transformedPost = transformApiPostDetail(data.response);
        setPost(transformedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};