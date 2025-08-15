import { useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/config";

export interface memberDashboardResponse {
  comments_total: number;
  comments_weekly: number;
  liked_posts_total: number;
  liked_posts_weekly: number;
  posts_read_total: number;
  posts_read_weekly: number;
  recently_liked: Array<{
    updated_at: string;
    post_title: string;
    Slug: string;
    short_content: string;
    cover_image: string;
    Author: {
      Username: string,
      full_name: string,
      Avatar: string
    }
  }>;
  recently_saved: Array<{
    updated_at: string;
    post_title: string;
    Slug: string;
    short_content: string;
    cover_image: string;
    Author: {
      Username: string,
      full_name: string,
      Avatar: string
    }
  }>
  saved_posts_total: number;
  saved_posts_weekly: number;
}

const processDashboard = (dashboard: memberDashboardResponse): memberDashboardResponse => ({
  comments_total: dashboard.comments_total,
  comments_weekly: dashboard.comments_weekly,
  liked_posts_total: dashboard.liked_posts_total,
  liked_posts_weekly: dashboard.liked_posts_weekly,
  posts_read_total: dashboard.posts_read_total,
  posts_read_weekly: dashboard.posts_read_weekly,
  recently_liked: dashboard.recently_liked?.map(post => ({
    updated_at: post.updated_at,
    post_title: post.post_title,
    Slug: post.Slug,
    short_content: post.short_content,
    cover_image: post.cover_image,
    Author: {
      Username: post.Author.Username,
      full_name: post.Author.full_name,
      Avatar: post.Author.Avatar
    }
  })),
  recently_saved: dashboard.recently_saved?.map(post => ({
    updated_at: post.updated_at,
    post_title: post.post_title,
    Slug: post.Slug,
    short_content: post.short_content,
    cover_image: post.cover_image,
    Author: {
      Username: post.Author.Username,
      full_name: post.Author.full_name,
      Avatar: post.Author.Avatar
    }
  })),
  saved_posts_total: dashboard.saved_posts_total,
  saved_posts_weekly: dashboard.saved_posts_weekly
});

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<memberDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // fetch user dashboard
        const authToken = localStorage.getItem('authToken');
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.memberDashboard}`, {
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
