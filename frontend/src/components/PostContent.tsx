import DOMPurify from 'dompurify';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const cleanHTML = DOMPurify.sanitize(content); // ✅ Sanitize here

  return (
    <div className="text-white" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default PostContent;

