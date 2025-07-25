
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  return (
    <div 
      className="w-full overflow-hidden prose prose-dark prose-invert max-w-none prose-img:rounded-xl prose-img:mx-auto prose-pre:p-0 prose-headings:text-white prose-p:text-gray-300 prose-a:text-tech-red prose-p:break-words prose-headings:break-words kinetic-scroll"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PostContent;
