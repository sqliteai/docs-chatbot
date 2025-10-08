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
        "dcb:size-full dcb:prose dcb:prose-sm dark:dcb:prose-invert dcb:max-w-none dcb:[&>*:first-child]:mt-0 dcb:[&>*:last-child]:mb-0",
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
            <h3 className="dcb:text-sm dcb:font-bold dcb:mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="dcb:mb-4">{children}</p>,
          strong: ({ children }) => (
            <strong className="dcb:font-bold">{children}</strong>
          ),
          hr: () => <hr className="dcb:my-4" />,
          code(props) {
            const { children, className, ...rest } = props;
            const isInline = !className?.includes("language-");
            const isMultiline =
              typeof children === "string" && children.includes("\n");

            // Inline code styling
            if (isInline && !isMultiline) {
              return (
                <code
                  className={cn(
                    className,
                    "dcb:px-1.5 dcb:py-0.5 dcb:rounded dcb:font-mono dcb:text-[13px] dcb:bg-gray-100 dcb:text-zinc-600 dark:dcb:bg-gray-800 dark:dcb:text-gray-300"
                  )}
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            // Code block styling
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
