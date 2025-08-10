import Post from '@/components/PostDetailComponen/PostDetail';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { posts } from '@/data/posts';

// Category Routes Logic Handled firstly
export interface Category {
  ID: string;
  Name: string;
  Slug: string;
  Description: string;
  PostCount: number;
}

export interface CategoriesResponse {
  response: Category[];
}

// To fetch all categories
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.categories}`);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data: CategoriesResponse = await response.json();
    const categoriesArray = Array.isArray(data.response) ? data.response : [];

    return { response: categoriesArray };
  } catch (err) {
    throw err;
  }
};

export interface SingleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  posts: Array<{
    id: string;
    post_title: string;
    slug: string;
    cover_image: string;
    short_content?: string;
    author: {
      id: string;
      avatar: string;
      full_name: string;
    };
    read_time: string;
    is_featured: boolean;
  }>;

}

// This function takes in the SingleCategory interface and maps it properply.
const transformSingleCategory = (Post: SingleCategory): SingleCategory => ({
  id: Post.id,
  name: Post.name,
  slug: Post.slug,
  description: Post.description,
  posts: Post.posts?.map(categoryPosts => ({
    id: categoryPosts.id,
    post_title: categoryPosts.post_title,
    slug: categoryPosts.slug,
    cover_image: categoryPosts.cover_image,
    short_content: categoryPosts.short_content,
    author: {
      id: categoryPosts.author.id,
      avatar: categoryPosts.author.avatar,
      full_name: categoryPosts.author.full_name,
    },
    read_time: categoryPosts.read_time,
    is_featured: categoryPosts.is_featured,
  }))
});


// To fetch single category 
export const fetchCategory = async (slug: string): Promise<SingleCategory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/get?slug=${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    const data = await response.json();
    const transforedResponse: SingleCategory = transformSingleCategory(data.response);
    return transforedResponse;
  } catch (err) {
    throw err;
  }
};

// Articles / posts Routes logic handled here

// This interface is used to fetch HomePage Posts.
export interface Post {
  post_title: string;
  slug: string;
  short_content: string;
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
  updated_at: string;
  readTime?: string;
  isFeatured: boolean;
};

// The Post interface will be consumed via the TransformedPost function.
// This function takes in the 
const transformApiPost = (Post: Post): Post => ({
  post_title: Post.post_title,
  slug: Post.slug,
  short_content: Post.short_content, // Not available in list API
  cover_image: Post.cover_image,
  author: {
    id: Post.author.id,
    full_name: Post.author.full_name,
    avatar: Post.author.avatar,
  },
  category: Post.category,
  updated_at: Post.updated_at,
  // readTime: extractReadTime(Post.readTime), // TODO: Sort this in backend later.
  isFeatured: Post.isFeatured,
});

// To fetch all posts
export const fetchPosts = async (): Promise<Post> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.posts}`);

    if (!response.ok) {
      throw new Error("response not ok.")
    }

    const postsResponse = await response.json();
    const mappedPosts: Post = postsResponse.data.map(transformApiPost);
    return mappedPosts;
  } catch (err) {
    throw err
  }
};

// This interface is used to fetch post detail page.
export interface PostDetail {
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

// The ApiPostDetail interface will be consumed by TransformedPostDetail
const transformApiPostDetail = (apiPost: PostDetail): PostDetail => ({
  ID: apiPost.ID,
  PostTitle: apiPost.PostTitle,
  Slug: apiPost.Slug,
  ShortContent: apiPost.ShortContent,
  Content: apiPost.Content,
  cover_image: apiPost.cover_image,
  Author: {
    id: apiPost.Author.id,
    full_name: apiPost.Author.full_name,
    avatar: apiPost.Author.avatar,
    username: apiPost.Author.username,
    role: apiPost.Author.role
  },
  Category: apiPost.Category,
  UpdatedAt: apiPost.UpdatedAt,
  Comments: apiPost.Comments?.map(comment => ({
    ID: comment.ID,
    Author: {
      id: comment.Author.id,
      full_name: comment.Author.full_name,
      avatar: comment.Author.avatar,
      username: comment.Author.username,
      role: comment.Author.role
    },
    CommentText: comment.CommentText,
    UpdatedAt: comment.UpdatedAt,
  })) || [],
});


// To fetch the post
export const fetchPost = async (slug: string): Promise<PostDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.post}?post=${slug}`)
    if (!response.ok) {
      throw new Error("response not ok.")
    }
    const data = await response.json();
    const formattedResponse: PostDetail = transformApiPostDetail(data.response);
    return formattedResponse;
  } catch (err) {
    throw err
  }
};

export interface UserRegistration {
  name: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}

// To handle yser registrations.
export const registerUser = async (User: UserRegistration) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: User.username,
        full_name: User.name,
        password: User.password,
        email: User.email,
      }),
    })
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return true;
  } catch (err) {
    throw err
  }
};

export interface UserLogin {
  username: string,
  password: string
}

export const loginUser = async (User: UserLogin) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: User.username,
        password: User.password
      }),
    })
    if (!response.ok) {
      throw new Error('Login Failed')
    }
    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.response));
    return true
  } catch (err) {
    throw err
  }
};
