
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="prose prose-dark prose-invert max-w-none w-full overflow-hidden prose-img:rounded-xl prose-img:mx-auto prose-pre:p-0 prose-headings:text-white prose-p:text-gray-300 prose-a:text-tech-red prose-p:break-words prose-headings:break-words kinetic-scroll">
        <ReactMarkdown
          components={{
            code({node, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !match ? (
                <code className="bg-gradient-to-r from-[#151619] to-[#1A1B22] px-2 py-1 rounded-md text-tech-red border border-tech-red/20 text-sm break-all font-mono shadow-sm" {...props}>
                  {children}
                </code>
              ) : (
                <div className="w-full overflow-hidden my-6 sm:my-8 group">
                  <div className="relative">
                    <div className="absolute top-0 right-0 bg-[#2A2C36] text-gray-400 px-3 py-1 rounded-bl-lg text-xs font-mono opacity-70">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={{
                        ...atomDark,
                        'pre[class*="language-"]': {
                          ...atomDark['pre[class*="language-"]'],
                          background: 'linear-gradient(135deg, #0D0E12 0%, #151619 100%)',
                          border: '1px solid #2A2C36',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        },
                        'code[class*="language-"]': {
                          ...atomDark['code[class*="language-"]'],
                          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                        }
                      }}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl text-xs sm:text-sm !overflow-x-auto !max-w-full transition-all duration-300 group-hover:shadow-lg"
                      wrapLines={true}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6B7280',
                        fontSize: '0.75rem',
                        paddingRight: '1rem',
                        borderRight: '1px solid #2A2C36',
                        marginRight: '1rem',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )
            },
            p: ({children}) => <p className="mb-4 text-gray-300 break-words overflow-wrap-anywhere leading-relaxed smooth-transition">{children}</p>,
            h1: ({children}) => <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white my-6 sm:my-8 break-words fade-in-up">{children}</h1>,
            h2: ({children}) => <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white my-5 sm:my-6 break-words fade-in-up">{children}</h2>,
            h3: ({children}) => <h3 className="text-base sm:text-lg md:text-xl font-bold text-white my-4 sm:my-5 break-words fade-in-up">{children}</h3>,
            a: ({children, href}) => <a href={href} className="text-tech-red hover:text-tech-red/80 break-all transition-all duration-300 hover:underline decoration-2 underline-offset-2">{children}</a>,
            ul: ({children}) => <ul className="list-disc pl-6 sm:pl-8 mb-6 text-gray-300 overflow-hidden space-y-2">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal pl-6 sm:pl-8 mb-6 text-gray-300 overflow-hidden space-y-2">{children}</ol>,
            li: ({children}) => <li className="mb-2 break-words overflow-wrap-anywhere leading-relaxed smooth-transition">{children}</li>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-tech-red pl-4 italic my-6 sm:my-8 text-gray-400 break-words overflow-wrap-anywhere bg-[#151619]/30 py-4 rounded-r-lg relative smooth-transition hover:bg-[#151619]/50">{children}</blockquote>,
            img: ({src, alt}) => <img src={src} alt={alt} className="rounded-xl mx-auto my-6 sm:my-8 max-w-full h-auto shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]" />,
            table: ({children}) => (
              <div className="overflow-x-auto my-6 sm:my-8 w-full rounded-xl border border-[#2A2C36] shadow-lg">
                <table className="min-w-full border-collapse bg-[#151619]/50">
                  {children}
                </table>
              </div>
            ),
            pre: ({children}) => (
              <div className="w-full overflow-hidden my-6 sm:my-8">
                <pre className="bg-gradient-to-br from-[#0D0E12] to-[#151619] p-4 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm max-w-full border border-[#2A2C36] shadow-lg font-mono leading-relaxed">
                  {children}
                </pre>
              </div>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostContent;
