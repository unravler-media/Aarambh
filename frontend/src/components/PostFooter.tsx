import { Share2, Bookmark, Heart } from "lucide-react";
import { markPostBookmarked, markPostLiked, markPostUnLiked, markPostUnBookmarked } from "@/hooks/usePost";
import type { Post } from "@/hooks/usePost";
import { useEffect, useState } from "react";

interface PostFooterProps {
  author: {
    full_name: string;
    avatar: string;
  };
  post: Post
}

const PostFooter = ({ author, post }: PostFooterProps) => {
  const [hasLikedState, setHasLikedState] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);

  const handleLikeMethod = async (slug: string) => {
    const liked = await markPostLiked(slug);
    if (liked) {
      setHasLikedState(true);
    } else {
      setHasLikedState(false);
    }
  };

  const handleUnLikeMethod = async (slug: string) => {
    const unliked = await markPostUnLiked(slug);
    if (unliked) {
      setHasLikedState(false);
    } else {
      setHasLikedState(true);
    }
  };


  const handleSaveMethod = async (slug: string) => {
    const saved = await markPostBookmarked(slug);
    if (saved) {
      setHasSavedState(true);
    } else {
      setHasSavedState(false);
    }
  };

  const handleUnSaveMethod = async (slug: string) => {
    const unsaved = await markPostUnBookmarked(slug);
    if (unsaved) {
      setHasSavedState(false);
    } else {
      setHasSavedState(true);
    }
  };




  useEffect(() => {
    console.log("Effect is in place")
    // console.log()
    if (post.hasLiked) {
      console.log("Post is Liked")
      setHasLikedState(true);
    } else {
      console.log("Post is unliked")
      setHasLikedState(false);
    }

    if (post.hasSaved) {
      console.log("Post is saved")
      setHasSavedState(true);
    } else {
      console.log("Post is unsaved")
      setHasSavedState(false);
    }
  }, [])

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8 pt-6 border-t border-[#252833]">
      <div className="flex items-center">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.full_name}
            className="h-10 w-10 rounded-full mr-3"
          />
        ) : (
          <div className="h-10 w-10 rounded-full mr-3 bg-tech-red flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {author.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-white text-sm">{author.full_name}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Liking Post Button */}

        {hasLikedState ? (
          <button
            className="p-2 bg-[#151619] text-red-500 hover:text-white hover:cursor-pointer rounded-full transition-colors"
            onClick={() => handleUnLikeMethod(post.slug)}
          >
            <Heart fill="transparent" size={18} /> {/* Filled look */}
          </button>
        ) : (
          <button
            className="p-2 bg-[#151619] text-gray-400 hover:text-white hover:cursor-pointer rounded-full transition-colors"
            onClick={() => handleLikeMethod(post.slug)}
          >
            <Heart size={18} /> {/* Outline look */}
          </button>
        )}

        {/* Bookmark Post Button */}
        {hasSavedState ? (
          <button
            className="p-2 bg-[#151619] text-red-500 hover:text-white hover:cursor-pointer rounded-full transition-colors"
            onClick={() => handleUnSaveMethod(post.slug)}>
            <Bookmark fill="transparent" size={18} />
          </button>
        ) : (
          <button
            className="p-2 bg-[#151619] text-gray-400 hover:text-white hover:cursor-pointer rounded-full transition-colors"
            onClick={() => handleSaveMethod(post.slug)}>
            <Bookmark size={18} /></button>
        )}

        {/* Sharing Post Button */}
        <button className="p-2 bg-[#151619] text-gray-400 hover:text-white rounded-full transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div >
  );
};

export default PostFooter;

