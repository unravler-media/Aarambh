import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../layout.tsx";
import { usePost } from "../../hooks/usePost.tsx";
import { getPostsByCategory } from "../../data/posts.ts";
import { ChevronLeft } from "lucide-react";
import CommentSection from "../../components/CommentSection";
import { getCommentsByPostId } from "../../data/comments";
import PostHeader from "../../components/PostHeader";
import PostContent from "../../components/PostContent";
import RelatedPosts from "../../components/RelatedPosts";
import PostSkeleton from "../../components/PostSkeleton";
import PostFooter from "../../components/PostFooter.tsx";

const Post = () => {
  const navigate = useNavigate();
  const url = window.location.pathname;
  const slug = url.replace(/^\/posts\//, ''); // Extract slug

  const { post, loading, error } = usePost(slug);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (!slug) {
      console.log("Slug missing — Not Found");
      window.location.href = "/not-found"
      // navigate("/not-found");
      return;
    }

    if (error) {
      console.error("Error fetching post");
      window.location.href = "/not-found"
      // navigate("/not-found");
      return;
    }

    if (post) {
      const categoryPosts = getPostsByCategory(post.categoryId)
        .filter(p => p.id !== post.id)
        .slice(0, 3);
      setRelatedPosts(categoryPosts);
    }
  }, [slug, error, post, navigate]);

  if (loading || !post) {
    return (
      <Layout>
        <PostSkeleton />
      </Layout>
    );
  }

  const comments = post.comments || [];

  return (
    <Layout>
      <div className="w-full max-w-none overflow-hidden">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-400 hover:text-white hover:cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
        </div>

        <article className="bg-[#0F1013] rounded-xl overflow-hidden mb-8 w-full">
          <div className="w-full overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[450px]"
            />
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
            <PostHeader
              title={post.title}
              categoryName={post.category?.name}
              shortContent={post.short_content}
              author={post.author}
              updated_at={post.updated_at}
              readTime={post.readTime}
            />

            <PostContent content={post.content} />

            <PostFooter author={post.author} />
          </div>
        </article>

        {/* Comment Section */}
        <div className="bg-[#0F1013] rounded-xl overflow-hidden mb-8 w-full">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
            <CommentSection postId={post.id} comments={comments} />
          </div>
        </div>

        {/* More Articles Section */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    </Layout>
  );
};

export default Post;

