
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getPostBySlug, getCategoryNameById, getPostsByCategory } from "../data/posts";
import { ChevronLeft } from "lucide-react";
import CommentSection from "../components/CommentSection";
import { getCommentsByPostId } from "../data/comments";
import PostHeader from "../components/PostHeader";
import PostContent from "../components/PostContent";
import PostFooter from "../components/PostFooter";
import RelatedPosts from "../components/RelatedPosts";
import PostSkeleton from "../components/PostSkeleton";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = slug ? getPostBySlug(slug) : null;
  const categoryName = post ? getCategoryNameById(post.categoryId) : "";
  
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  useEffect(() => {
    if (!slug || !post) {
      navigate("/not-found");
      return;
    }
    
    // Get related posts from the same category
    if (post) {
      const categoryPosts = getPostsByCategory(post.categoryId)
        .filter(p => p.id !== post.id)
        .slice(0, 3);
      setRelatedPosts(categoryPosts);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [slug, post, navigate]);
  
  if (isLoading || !post) {
    return (
      <Layout>
        <PostSkeleton />
      </Layout>
    );
  }

  const comments = getCommentsByPostId(slug);

  return (
    <Layout>
      <div className="w-full max-w-none overflow-hidden">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-gray-400 hover:text-tech-red transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
        </div>
        
        <article className="bg-[#0F1013] rounded-xl overflow-hidden mb-8 w-full">
          <div className="w-full overflow-hidden">
            <img 
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[450px]"
            />
          </div>
          
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
            <PostHeader 
              title={post.title}
              categoryName={categoryName}
              author={post.author}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
            />
            
            <PostContent content={post.content} />
            
            <PostFooter author={post.author} />
          </div>
        </article>
        
        {/* Comment Section */}
        <div className="bg-[#0F1013] rounded-xl overflow-hidden mb-8 w-full">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
            <CommentSection postId={slug} comments={comments} />
          </div>
        </div>
        
        {/* More Articles Section */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    </Layout>
  );
};

export default Post;
