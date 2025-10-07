import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";
import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes } from "react";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "dcb:group dcb:flex dcb:w-full dcb:items-end dcb:justify-end dcb:gap-2 dcb:py-4",
      from === "user"
        ? "is-user"
        : "is-assistant dcb:flex-row-reverse dcb:justify-end",
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  "is-user:dark dcb:flex dcb:flex-col dcb:gap-2 dcb:overflow-hidden dcb:rounded-lg dcb:text-sm",
  {
    variants: {
      variant: {
        contained: [
          "dcb:max-w-[80%] dcb:px-4 dcb:py-3",
          "dcb:group-[.is-user]:bg-primary dcb:group-[.is-user]:text-primary-foreground",
          "dcb:group-[.is-assistant]:bg-secondary dcb:group-[.is-assistant]:text-foreground",
        ],
        flat: [
          "dcb:group-[.is-user]:max-w-[80%] dcb:group-[.is-user]:bg-secondary dcb:group-[.is-user]:px-4 dcb:group-[.is-user]:py-3 dcb:group-[.is-user]:text-foreground",
          "dcb:group-[.is-assistant]:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      messageContentVariants({ variant, className }),
      "dcb:font-sans"
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar
    className={cn("dcb:size-8 dcb:ring-1 dcb:ring-border", className)}
    {...props}
  >
    <AvatarImage alt="" className="dcb:mt-0 dcb:mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
);
