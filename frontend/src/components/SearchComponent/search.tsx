import { useState } from "react";
import Layout from "../../components/layout";
import SearchPostCard from "../../components/SearchPostCard";
import { Search as SearchIcon } from "lucide-react";
import { usePostsSearch } from "@/hooks/usePost";

const Search = () => {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { searchResult, searchLoading, searchError } = usePostsSearch(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white">Search Articles</h1>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full bg-[#1A1B22] border border-[#2A2C36] rounded-xl px-4 py-4 pl-12 
                       focus:outline-none focus:ring-2 focus:ring-tech-red/30 focus:border-tech-red/30 text-white"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </form>

        {searchLoading && (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-[#151619] rounded-xl w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-[#151619] rounded-xl"></div>
              ))}
            </div>
          </div>
        )}

        {!searchLoading && !searchError && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">
              {searchResult.length > 0
                ? `Found ${searchResult.length} results for "${query}"`
                : "No results found"}
            </h2>

            {searchResult.length < 1 ? (
              <div className="text-center py-12 bg-[#1A1B22] rounded-xl border border-[#2A2C36]">
                <h3 className="text-xl font-medium mb-2 text-white">No matching articles</h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or browse our categories
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {searchResult.map((post, i) => (
                  <a href={`/posts/${post.slug}`}><SearchPostCard key={i} post={post} /></a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
