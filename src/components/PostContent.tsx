import DOMPurify from 'dompurify';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const cleanHTML = DOMPurify.sanitize(content); // ✅ Sanitize here

  return (
    <div 
      className="w-full overflow-hidden prose prose-dark prose-invert max-w-none prose-img:rounded-xl prose-img:mx-auto prose-pre:p-0 prose-headings:text-white prose-p:text-gray-300 prose-a:text-tech-red prose-p:break-words prose-headings:break-words kinetic-scroll"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PostContent;
