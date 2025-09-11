import { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import SearchPostCard from "../../components/SearchPostCard";
import { Search as SearchIcon } from "lucide-react";
import { usePostsSearch } from "@/hooks/usePost";

const Search = () => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(""); // 👈 actual query for API
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [allResults, setAllResults] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  // Track whether initial results are loaded
  const [initialLoaded, setInitialLoaded] = useState(false);

  const { searchResult, searchLoading, searchError } = usePostsSearch(
    submittedQuery,
    page,
    pageSize
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reset results when a new query is submitted
  useEffect(() => {
    setPage(1);
    setAllResults([]);
    setHasMore(true);
    setInitialLoaded(false); // 👈 reset this too
  }, [submittedQuery]);

  // Append results when new page arrives
  useEffect(() => {
    console.log("triggered first use effect.")
    if (!searchLoading && searchResult && searchResult.length > 0) {
      setAllResults(prev => {
        const existingIds = new Set(prev.map(p => p.id ?? p.slug));
        const newPosts = searchResult.filter(p => !existingIds.has(p.id ?? p.slug));
        return [...prev, ...newPosts];
      });

      if (page === 1) {
        // 👇 mark that page 1 is done
        setInitialLoaded(true);
      }
    }
  }, [searchResult, searchLoading]);

  useEffect(() => {
    console.log("initialLoaded changed:", initialLoaded);
  }, [initialLoaded]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || searchLoading || !initialLoaded) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (!hasMore) return;
          console.log("Loader in view → fetching next search page");
          setPage(prev => prev + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    const loader = loaderRef.current;
    if (loader) observerRef.current.observe(loader);

    return () => {
      if (loader && observerRef.current) {
        observerRef.current.unobserve(loader);
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, searchLoading, initialLoaded]);
  // Stop infinite scroll on 404
  useEffect(() => {
    if (searchError) {
      try {
        const parsed = JSON.parse(searchError);
        if (parsed.response === "Post Does Not Exist.") {
          setHasMore(false);
          if (observerRef.current && loaderRef.current) {
            observerRef.current.unobserve(loaderRef.current);
            observerRef.current.disconnect();
          }
        }
      } catch {
        console.error("Unexpected search error:", searchError);
      }
    }
  }, [searchError]);

  // useEffect(() => {
  //   // handle the condition where we dont have any search results.
  //   if (allResults.length < 1 && !searchLoading) {
  //     setHasMore(false);
  //     if (observerRef.current && loaderRef.current) {
  //       observerRef.current.unobserve(loaderRef.current);
  //       observerRef.current.disconnect();
  //     }
  //   }
  // }, [searchLoading]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white">
          Search Articles
        </h1>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full bg-[#1A1B22] border border-[#2A2C36] rounded-xl px-4 py-4 pl-12 
                       focus:outline-none focus:ring-2 focus:ring-tech-red/30 focus:border-tech-red/30 text-white"
            />
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </form>

        {/* Results */}
        {submittedQuery && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">
              {allResults.length > 0
                ? `Found ${allResults.length} results for "${submittedQuery}"`
                : !searchLoading
                  ? "No results found"
                  : ""}
            </h2>

            {allResults.length < 1 && !searchLoading ? (
              <div className="text-center py-12 bg-[#1A1B22] rounded-xl border border-[#2A2C36]">
                <h3 className="text-xl font-medium mb-2 text-white">
                  No matching articles
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or browse our categories
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {allResults.map(post => (
                  <a key={post.id ?? post.slug} href={`/posts/${post.slug}`}>
                    <SearchPostCard post={post} />
                  </a>
                ))}
              </div>
            )}

            {/* Infinite loader UI */}
            {searchLoading && page > 1 && (
              <div className="text-center py-6 text-gray-400">
                Loading more...
              </div>
            )}
            {hasMore && <div ref={loaderRef} className="h-10"></div>}
            {!hasMore && allResults.length > 0 && (
              <div className="text-center py-6 text-gray-500">
                Volla! You have reached the end.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout >
  );
};

export default Search;
