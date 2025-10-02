"use client";

import { cn } from "@/utils/cn";
import ReactMarkdown from "react-markdown";

type ResponseLightProps = {
  children: string;
  className?: string;
};

export const ResponseLight = ({ children, className }: ResponseLightProps) => {
  return (
    <div
      className={cn(
        "size-full prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "text-sm text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-bold mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold mb-1">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          code(props) {
            const { children, className, ...rest } = props;

            return (
              <code
                className={cn(
                  className,
                  "block overflow-x-scroll rounded-sm font-mono text-[13px] my-2 p-3 bg-gray-100 leading-relaxed text-zinc-600 dark:text-gray-300 whitespace-pre"
                )}
                {...rest}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
