"use client";

import { Children, isValidElement, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { Copy, Check, MoreHorizontal } from "lucide-react";

export function Markdown({ content, role }: { content: string; role: string }) {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={{
          code({ className, children, ...props }) {
            const isBlock = Boolean(className);

            const codeString = getTextFromChildren(children).replace(/\n$/, "");

            if (!isBlock) {
              return (
                <code className="px-2 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }

            const language = className?.replace("language-", "") || "text";

            return (
              <CodeBlock
                code={codeString}
                language={language}
                className={className}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {role === "assistant" && (
        <div className="flex gap-2.5">
          <Copy size={16} />
          <MoreHorizontal size={16} />
        </div>
      )}
    </>
  );
}

function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl overflow-hidden border my-4">
      <div className="flex items-center justify-between px-4 py-2 text-xs">
        <span className="uppercase tracking-wide">{language}</span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 transition"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-sm">
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}

function getTextFromChildren(children: React.ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);

      if (isValidElement<{ children?: React.ReactNode }>(child)) {
        return getTextFromChildren(child.props.children);
      }

      return "";
    })
    .join("");
}
