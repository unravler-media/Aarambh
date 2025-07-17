
import { useState } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { posts } from "../data/posts";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof posts>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    const results = posts.filter(post => {
      const searchContent = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
      return searchContent.includes(query.toLowerCase());
    });
    
    setSearchResults(results);
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
          <button
            type="submit"
            className="mt-4 bg-tech-red hover:bg-tech-red/90 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
        
        {hasSearched && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} results for "${query}"`
                : `No results found for "${query}"`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {searchResults.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {searchResults.length === 0 && (
              <div className="text-center py-12 bg-[#1A1B22] rounded-xl border border-[#2A2C36]">
                <h3 className="text-xl font-medium mb-2 text-white">No matching articles</h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or browse our categories
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
