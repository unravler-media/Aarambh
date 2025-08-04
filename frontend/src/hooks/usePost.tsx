import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

export interface ApiSearchPost {
  updated_at: string;
  post_title: string;
  slug: string;
  cover_image: string;
  short_content: string | any;
  Author: {
    username: string;
    full_name: string;
    avatar: string;
  };
  read_time?: string; // optional
  Category: {
    name: string;
    slug: string;
  };
}

export interface ApiPost {
  id: string;
  updated_at: string;
  post_title: string;
  slug: string;
  cover_image: string;
  short_content: string | any;
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
  cover_image: string;
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
  Comments: Array<{
    ID: string;
    UpdatedAt: string;
    Author: {
      id: string;
      username: string;
      full_name: string;
      avatar: string;
      role: string;
    };
    CommentText: string;
  }>;
}

export interface SearchPost {
  updated_at: string;
  post_title: string;
  slug: string;
  short_content: string;
  cover_image: string;
  author: {
    username: string;
    full_name: string;
    avatar: string;
  };
  read_time: string | any;
  category: {
    name: string;
    slug: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  short_content: string;
  content?: string;
  cover_image: string;
  author: {
    id: string;
    full_name: string;
    avatar: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  updated_at: string;
  readTime: number;
  isFeatured: boolean;
  comments?: Array<{
    id: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
    likes: number;
  }>;
}

const extractReadTime = (readTimeString?: string): number => {
  if (typeof readTimeString !== 'string') return 5; // fallback default
  const match = readTimeString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
};

// Transform API post to internal format
const transformApiPost = (apiPost: ApiPost): Post => ({
  id: apiPost.id,
  title: apiPost.post_title,
  slug: apiPost.slug,
  short_content: apiPost.short_content, // Not available in list API
  cover_image: apiPost.cover_image,
  author: {
    id: apiPost.author.id,
    full_name: apiPost.author.full_name,
    avatar: apiPost.author.avatar,
  },
  category: apiPost.category,
  categoryId: apiPost.category.id,
  updated_at: apiPost.updated_at,
  readTime: extractReadTime(apiPost.read_time),
  isFeatured: apiPost.is_featured,
});

const transformApiSearchPost = (apiPost: ApiSearchPost): SearchPost => ({
  post_title: apiPost.post_title,
  slug: apiPost.slug,
  short_content: apiPost.short_content,
  cover_image: apiPost.cover_image,
  author: {
    username: apiPost.Author?.username ?? '',
    full_name: apiPost.Author?.full_name ?? '',
    avatar: apiPost.Author?.avatar ?? '',
  },
  category: {
    name: apiPost.Category?.name ?? '',
    slug: apiPost.Category?.slug ?? '',
  },
  updated_at: apiPost.updated_at,
  read_time: extractReadTime(apiPost.read_time), // safe usage now
});

// Transform API post detail to internal format
const transformApiPostDetail = (apiPost: ApiPostDetail): Post => ({
  id: apiPost.ID,
  title: apiPost.PostTitle,
  slug: apiPost.Slug,
  short_content: apiPost.ShortContent,
  content: apiPost.Content,
  cover_image: apiPost.cover_image,
  author: {
    id: apiPost.Author.id,
    full_name: apiPost.Author.full_name,
    avatar: apiPost.Author.avatar,
  },
  category: apiPost.Category,
  categoryId: apiPost.Category.id,
  updated_at: apiPost.UpdatedAt,
  readTime: 5, // Default read time for detail API
  isFeatured: false, // Not available in detail API
  comments: apiPost.Comments?.map(comment => ({
    id: comment.ID,
    author: {
      id: comment.Author.id,
      name: comment.Author.username,
      avatar: comment.Author.avatar,
    },
    content: comment.CommentText,
    createdAt: comment.UpdatedAt,
    likes: 0,
  })) || [],
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

export const usePostsSearch = (slug: string) => {
  const [searchResult, setPosts] = useState<Post[]>([]);
  const [searchLoading, setLoading] = useState(false);
  const [searchError, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug.trim()) {
      setPosts([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchSearchPosts = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.searchPosts}?q=${slug}`);

          if (!response.ok) {
            if (response.status === 404) {
              setPosts([]);
              setError(null);
            } else {
              throw new Error("Failed to fetch posts");
            }
          }

          const data = await response.json();
          const transformedPosts = data.response.map(transformApiSearchPost);
          setPosts(transformedPosts);
          setError(null);
        } catch (err) {
          console.log(err instanceof Error ? err.message : "An Error occurred");
          setError(null);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchPosts();
    }, 500); // 👈 800ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [slug]);

  return { searchResult, searchLoading, searchError };
};
