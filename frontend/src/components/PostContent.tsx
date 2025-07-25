import DOMPurify from 'dompurify';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const cleanHTML = DOMPurify.sanitize(content); // ✅ Sanitize here

  return (
    <div className="w-full overflow-hidden">
      <div className="prose prose-invert prose-accent max-w-none mb-8 
           prose-p:text-base md:prose-p:text-lg
           prose-headings:text-lg md:prose-headings:text-xl
           prose-h1:text-2xl md:prose-h1:text-4xl
           prose-h2:text-xl md:prose-h2:text-3xl
           prose-li:text-base md:prose-li:text-lg
           prose-pre:text-sm md:prose-pre:text-base
           prose-img:rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      </div>
  </div>
  );
};

export default PostContent;
