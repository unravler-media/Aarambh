import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import prism from 'prismjs';

// Import the language grammars you expect to use.
// This ensures they are bundled and available for Prism on the client.
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
// Add any other languages you need

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const cleanHTML = DOMPurify.sanitize(content);

  // 1. Create a ref for the container div
  const contentRef = useRef(null);

  // 2. Use useEffect to run highlighting after render
  useEffect(() => {
    if (contentRef.current) {
      // 3. Tell Prism to highlight all code blocks within the ref'd element
      prism.highlightAllUnder(contentRef.current);
    }
  }, [cleanHTML]); // 4. Re-run the effect if the HTML content changes

  return (
    <div
      ref={contentRef} // Attach the ref here
      className="text-white prose prose-invert prose-accent max-w-none mb-8 
                 prose-p:text-base md:prose-p:text-lg
                 prose-headings:text-lg md:prose-headings:text-xl
                 prose-h1:text-2xl md:prose-h1:text-4xl
                 prose-h2:text-xl md:prose-h2:text-3xl
                 prose-li:text-base md:prose-li:text-lg
                 prose-pre:text-sm md:prose-pre:text-base
                 prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default PostContent;
