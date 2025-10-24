"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { type LucideIcon, XIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";

export type ArtifactProps = HTMLAttributes<HTMLDivElement>;

export const Artifact = ({ className, ...props }: ArtifactProps) => (
  <div
    className={cn(
      "dcb:flex dcb:flex-col dcb:overflow-hidden dcb:rounded-lg dcb:border dcb:bg-background dcb:shadow-sm",
      className
    )}
    {...props}
  />
);

export type ArtifactHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactHeader = ({
  className,
  ...props
}: ArtifactHeaderProps) => (
  <div
    className={cn(
      "dcb:flex dcb:items-center dcb:justify-between dcb:border-b dcb:bg-muted/50 dcb:px-4 dcb:py-3",
      className
    )}
    {...props}
  />
);

export type ArtifactCloseProps = ComponentProps<typeof Button>;

export const ArtifactClose = ({
  className,
  children,
  size = "sm",
  variant = "ghost",
  ...props
}: ArtifactCloseProps) => (
  <Button
    className={cn(
      "dcb:size-8 dcb:p-0 dcb:text-muted-foreground hover:dcb:text-foreground",
      className
    )}
    size={size}
    type="button"
    variant={variant}
    {...props}
  >
    {children ?? <XIcon className="dcb:size-4" />}
    <span className="dcb:sr-only">Close</span>
  </Button>
);

export type ArtifactTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const ArtifactTitle = ({ className, ...props }: ArtifactTitleProps) => (
  <p
    className={cn(
      "dcb:font-medium dcb:text-foreground dcb:text-sm dcb:flex-1 dcb:min-w-0 dcb:truncate dcb:pr-2",
      className
    )}
    {...props}
  />
);

export type ArtifactDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const ArtifactDescription = ({
  className,
  ...props
}: ArtifactDescriptionProps) => (
  <p
    className={cn("dcb:text-muted-foreground dcb:text-sm", className)}
    {...props}
  />
);

export type ArtifactActionsProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactActions = ({
  className,
  ...props
}: ArtifactActionsProps) => (
  <div
    className={cn("dcb:flex dcb:items-center dcb:gap-1 dcb:flex-shrink-0", className)}
    {...props}
  />
);

export type ArtifactActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
  icon?: LucideIcon;
};

export const ArtifactAction = ({
  tooltip,
  label,
  icon: Icon,
  children,
  className,
  size = "sm",
  variant = "ghost",
  ...props
}: ArtifactActionProps) => {
  const button = (
    <Button
      className={cn(
        "dcb:size-8 dcb:p-0 dcb:text-muted-foreground hover:dcb:text-foreground",
        className
      )}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {Icon ? <Icon className="dcb:size-4" /> : children}
      <span className="dcb:sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export type ArtifactContentProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactContent = ({
  className,
  ...props
}: ArtifactContentProps) => (
  <div
    className={cn("dcb:flex-1 dcb:overflow-auto dcb:p-4", className)}
    {...props}
  />
);
