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
        "dcb:size-full dcb:prose dcb:prose-sm dark:dcb:prose-invert dcb:max-w-none [&>*:first-child]:dcb:mt-0 [&>*:last-child]:dcb:mb-0",
        "dcb:text-sm dcb:text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="dcb:text-base dcb:font-bold dcb:mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="dcb:text-sm dcb:font-bold dcb:mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="dcb:text-sm dcb:font-bold dcb:mb-1">{children}</h3>
          ),
          p: ({ children }) => <p className="dcb:mb-4">{children}</p>,
          strong: ({ children }) => (
            <strong className="dcb:font-bold">{children}</strong>
          ),
          code(props) {
            const { children, className, ...rest } = props;

            return (
              <code
                className={cn(
                  className,
                  "dcb:block dcb:overflow-x-scroll dcb:rounded-sm dcb:font-mono dcb:text-[13px] dcb:my-2 dcb:p-3 dcb:bg-gray-100 dcb:leading-relaxed dcb:text-zinc-600 dark:dcb:text-gray-300 dcb:whitespace-pre"
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
