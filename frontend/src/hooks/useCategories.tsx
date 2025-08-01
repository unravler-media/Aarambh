import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

export interface Category {
  ID: string;
  Name: string;
  Slug: string;
  Description: string;
}

interface CategoriesResponse {
  response: Category[];
}

// Cache to persist data across navigations
let cachedCategories: Category[] | null = null;
let cachePromise: Promise<Category[]> | null = null;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // If we already have cached data, use it
    if (cachedCategories) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    // If we're already fetching, wait for that request
    if (cachePromise) {
      cachePromise.then(data => {
        setCategories(data);
        setLoading(false);
      }).catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      });
      return;
    }

    // Only fetch once per session
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;
    setLoading(true);

    const fetchCategories = async (): Promise<Category[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.categories}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data: CategoriesResponse = await response.json();
        const categoriesArray = Array.isArray(data.response) ? data.response : [];
        
        // Cache the data
        cachedCategories = categoriesArray;
        return categoriesArray;
      } catch (err) {
        throw err;
      }
    };

    // Create and cache the promise
    cachePromise = fetchCategories();
    
    cachePromise
      .then(data => {
        setCategories(data);
        setError(null);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred');
      })
      .finally(() => {
        setLoading(false);
        cachePromise = null;
      });
  }, []);

  return { categories, loading, error };
};