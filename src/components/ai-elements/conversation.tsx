"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("dcb:relative dcb:flex-1 dcb:overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("dcb:p-4", className)} {...props} />
);

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "dcb:flex dcb:size-full dcb:flex-col dcb:items-center dcb:justify-center dcb:gap-3 dcb:p-8 dcb:text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="dcb:text-muted-foreground">{icon}</div>}
        <div className="dcb:space-y-1">
          <h3 className="dcb:font-medium dcb:text-foreground dcb:font-sans dcb:text-sm">
            {title}
          </h3>
          {description && (
            <p className="dcb:text-muted-foreground dcb:font-sans dcb:text-sm">
              {description}
            </p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "dcb:absolute dcb:bottom-4 dcb:left-[50%] dcb:translate-x-[-50%] dcb:rounded-full",
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="dcb:size-4" />
      </Button>
    )
  );
};
