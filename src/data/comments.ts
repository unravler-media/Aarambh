
import { Comment } from "../components/CommentSection";

export const getCommentsByPostId = (postId: string): Comment[] => {
  return dummyComments[postId] || [];
};

// Dummy comments data
const dummyComments: Record<string, Comment[]> = {
  "high-performance-web-services-go": [
    {
      id: "comment-1",
      author: {
        id: "user-1",
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
      content: "Great article! I've been using Go for microservices and the performance is incredible. Have you tried comparing it with Rust for similar use cases?",
      createdAt: "2025-04-25T14:32:00Z",
      likes: 5,
    },
    {
      id: "comment-2",
      author: {
        id: "user-2",
        name: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      content: "This helped me optimize our API endpoints. We saw a 40% reduction in response times after migrating from Node.js to Go.",
      createdAt: "2025-04-27T09:15:00Z",
      likes: 3,
    },
    {
      id: "comment-3",
      author: {
        id: "user-3",
        name: "Ryan Thompson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryan",
      },
      content: "Would love to see a follow-up article on deploying Go services on Kubernetes and best practices for container optimization.",
      createdAt: "2025-05-01T11:42:00Z",
      likes: 2,
    }
  ],
  "machine-learning-for-developers": [
    {
      id: "comment-1",
      author: {
        id: "user-4",
        name: "Jennifer Wu",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      },
      content: "As someone just getting started with ML, I found this breakdown incredibly helpful. The code examples were clear and well-explained.",
      createdAt: "2025-04-22T13:05:00Z",
      likes: 8,
    },
    {
      id: "comment-2",
      author: {
        id: "user-5",
        name: "David Park",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      content: "Have you considered exploring transfer learning in a future article? It's been a game-changer for my projects with limited datasets.",
      createdAt: "2025-04-24T10:30:00Z",
      likes: 4,
    }
  ],
  "react-vs-vue-2023": [
    {
      id: "comment-1",
      author: {
        id: "user-6",
        name: "Emma Roberts",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      content: "After using both frameworks extensively, I still prefer React's ecosystem, but Vue's learning curve is definitely gentler for newcomers.",
      createdAt: "2025-04-18T16:22:00Z",
      likes: 6,
    },
    {
      id: "comment-2",
      author: {
        id: "user-7",
        name: "Miguel Sanchez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel",
      },
      content: "Great comparison! I'd add that Vue's composition API has narrowed the gap between the two frameworks significantly.",
      createdAt: "2025-04-20T08:45:00Z",
      likes: 3,
    },
    {
      id: "comment-3",
      author: {
        id: "user-8",
        name: "Lisa Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      },
      content: "I switched from React to Vue last year and haven't looked back. The documentation alone made it worth it for our team.",
      createdAt: "2025-04-23T14:10:00Z",
      likes: 5,
    }
  ],
  // Add more dummy comments for other posts as needed
};
