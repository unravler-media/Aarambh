
const PostSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8 w-full">
      <div className="h-64 bg-[#1A1B22] rounded-xl"></div>
      <div className="h-8 w-2/3 bg-[#1A1B22] rounded"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-[#1A1B22] rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default PostSkeleton;
