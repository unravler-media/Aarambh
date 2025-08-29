// Backend Deployment One
// export const API_BASE_URL = 'https://aarambh.zeabur.app';

// Backend Deployment Two
// export const API_BASE_URL = "https://www.unr-c1.eu.org";

// Backend Deployment Three
export const API_BASE_URL = "https://aarambh-server-qco5mrkowq-em.a.run.app";

export const API_ENDPOINTS = {
  // Extra's
  categories: '/api/category/',

  // POST Related CRUD Operations
  createPost: '/api/posts/create/',
  updatePost: '/api/posts/update/',
  deletePost: '/api/posts/delete/',

  // POST Related Extra's
  posts: '/api/posts/',
  post: '/api/posts/get/',

  likePost: '/api/posts/like/',
  unlikePost: '/api/posts/unlike/',


  savePost: '/api/posts/save/',
  unsavePost: '/api/posts/unsave/',
  readPost: '/api/posts/read/',

  createComment: '/api/comment/create/',
  searchPosts: '/api/query/',

  // Dashboard Related
  memberDashboard: '/api/dashboard/member/',
  creatorDashboard: '/api/dashboard/creator/',
  adminDashboard: '/api/dashboard/admin/',
  uploadImage: '/api/upload/image/',
} as const;
