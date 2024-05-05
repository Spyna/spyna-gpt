import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

interface Props {
  message: string;
}

export default function MarkdownMessage({ message }: Readonly<Props>) {
  const MarkdownComponents: object = {
    code({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: string;
    }) {
      const match = /language-(\w+)/.exec(className ?? "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula}
          PreTag="div"
          language={match[1]}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    },
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="md my-4 max-w-none   "
      components={MarkdownComponents}
    >
      {message}
    </ReactMarkdown>
  );
}
