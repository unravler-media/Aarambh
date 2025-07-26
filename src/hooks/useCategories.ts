import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface Category {
  ID: string;
  Name: string;
  Slug: string;
  Description: string;
}

interface CategoriesResponse {
  response: Category[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.categories}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data: CategoriesResponse = await response.json();
        setCategories(Array.isArray(data.response) ? data.response : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};