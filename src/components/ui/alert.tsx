import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const alertVariants = cva(
  "dcb:relative dcb:w-full dcb:rounded-lg dcb:border dcb:px-4 dcb:py-3 dcb:text-sm dcb:grid has-[>svg]:dcb:grid-cols-[calc(var(--spacing)*4)_1fr] dcb:grid-cols-[0_1fr] has-[>svg]:dcb:gap-x-3 dcb:gap-y-0.5 dcb:items-start [&>svg]:dcb:size-4 [&>svg]:dcb:translate-y-0.5 [&>svg]:dcb:text-current",
  {
    variants: {
      variant: {
        default: "dcb:bg-card dcb:text-card-foreground",
        destructive:
          "dcb:text-destructive dcb:bg-card [&>svg]:dcb:text-current *:data-[slot=alert-description]:dcb:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "dcb:col-start-2 dcb:line-clamp-1 dcb:min-h-4 dcb:font-medium dcb:tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "dcb:text-muted-foreground dcb:col-start-2 dcb:grid dcb:justify-items-start dcb:gap-1 dcb:text-sm [&_p]:dcb:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
