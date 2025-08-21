import { useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/config";

export interface AddPostInterface {
  post_title: string;
  short_content: string;
  content: string;
  cover_image: string;
  category_id: string;
  is_featured: boolean;
}

export interface creatorDashboardResponse {
  recent_posts: Array<{
    post_title: string;
    slug: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    status: string;
  }>,
  total_comments: number;
  total_likes: number;
  total_posts: number;
  total_views: number;
}

const processDashboard = (dashboard: creatorDashboardResponse): creatorDashboardResponse => ({
  total_comments: dashboard.total_comments,
  total_likes: dashboard.total_likes,
  total_posts: dashboard.total_posts,
  total_views: dashboard.total_views,
  recent_posts: dashboard.recent_posts?.map(post => ({
    post_title: post.post_title,
    slug: post.slug,
    views_count: post.views_count,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    status: post.status || "published",
  }))
});


export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<creatorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // fetch user dashboard
        const authToken = localStorage.getItem('authToken');
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creatorDashboard}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Dashboard.");
        }
        const data = await response.json();
        const result = processDashboard(data);
        setDashboard(result);
      }
      catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return { dashboard, loading, error }
};

export const processNewPost = async (data: AddPostInterface) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createPost}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        post_title: data.post_title,
        short_content: data.short_content,
        content: data.content,
        cover_image: data.cover_image,
        category_id: data.category_id,
        is_featured: data.is_featured,
      }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        console.log("unauthorised token")
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.href = "/";
      } else {
        throw new Error(`Unable to create a new post: ${await response.text()}`);
      }
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};

export const processPostEdit = async (data: AddPostInterface, slug: string) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updatePost}/?post=${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        post_title: data.post_title,
        short_content: data.short_content,
        content: data.content,
        cover_image: data.cover_image,
        category_id: data.category_id,
        is_featured: data.is_featured,
      }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        console.log("unauthorised token")
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.href = "/";
      } else {
        throw new Error(`Unable to edit a new post: ${await response.text()}`);
      }
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};

export const deletePost = async (post_slug: string) => {
  try {
    // Implement Post Delete Logic
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.deletePost}/?post=${post_slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 400) {
        console.log("unauthorised token")
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.href = "/";
      } else {
        throw new Error(`Unable to delete the post: ${await response.text()}`);
      }
    }

    return await response.json();
  } catch (err) {
    throw err
  }
}
