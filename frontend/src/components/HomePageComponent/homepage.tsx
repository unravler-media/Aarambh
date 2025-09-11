import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hooks/usePost";

const Index = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const initialPage = params.get("page") ? Number(params.get("page")) : 1;
  const pageSize = params.get("results") ? Number(params.get("results")) : 10;

  const [page, setPage] = useState(initialPage);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { posts, loading, error } = usePosts(page, pageSize);

  // Append new posts
  useEffect(() => {
    if (!loading && posts) {
      setAllPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPosts = posts.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    }
  }, [posts, loading]);

  // Handle server 404 error → stop fetching
  useEffect(() => {
    if (error) {
      try {
        const parsedError = JSON.parse(error);
        if (parsedError.response === "Post Does Not Exist.") {
          console.log("No more posts → stopping observer");
        }
      } catch {
        console.error("Unexpected error:", error);
      }
      finally { // FailSafe mechanism
        setHasMore(false);
        // disconnect observer immediately
        if (observerRef.current && loaderRef.current) {
          observerRef.current.unobserve(loaderRef.current);
          observerRef.current.disconnect();
        }
      }
    }
  }, [error]);

  // Infinite scroll observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    if (loading) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (!hasMore) return; // 🔑 safeguard
          console.log("Loader in view → fetching next page");
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    const loader = loaderRef.current;
    if (loader) observerRef.current.observe(loader);

    return () => {
      if (loader && observerRef.current) {
        observerRef.current.unobserve(loader);
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  return (
    <Layout>
      <section className="mb-14 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
          {allPosts.map(post => (
            <a key={post.id} href={`/posts/${post.slug}`}>
              <PostCard post={post} />
            </a>
          ))}
        </div>

        {/* Loading / Infinite Scroll Trigger */}
        {loading && (
          <div className="text-center py-6 text-gray-400">Loading more...</div>
        )}
        {hasMore && <div ref={loaderRef} className="h-10"></div>}
        {!hasMore && (
          <div className="text-center py-6 text-gray-500">
            Volla! You have reached the end.
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
