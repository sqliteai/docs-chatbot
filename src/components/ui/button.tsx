import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "dcb:inline-flex dcb:items-center dcb:justify-center dcb:gap-2 dcb:whitespace-nowrap dcb:rounded-md dcb:text-sm dcb:font-medium dcb:transition-all disabled:dcb:pointer-events-none disabled:dcb:opacity-50 dcb:[&_svg]:pointer-events-none dcb:[&_svg:not([class*='size-'])]:size-4 dcb:shrink-0 dcb:[&_svg]:shrink-0 dcb:outline-none focus-visible:dcb:border-ring focus-visible:dcb:ring-ring/50 focus-visible:dcb:ring-[3px] aria-invalid:dcb:ring-destructive/20 dark:aria-invalid:dcb:ring-destructive/40 aria-invalid:dcb:border-destructive",
  {
    variants: {
      variant: {
        default:
          "dcb:bg-primary dcb:text-primary-foreground hover:dcb:bg-primary/90",
        destructive:
          "dcb:bg-destructive dcb:text-white hover:dcb:bg-destructive/90 focus-visible:dcb:ring-destructive/20 dark:focus-visible:dcb:ring-destructive/40 dark:dcb:bg-destructive/60",
        outline:
          "dcb:border dcb:bg-background dcb:shadow-xs hover:dcb:bg-accent hover:dcb:text-accent-foreground dark:dcb:bg-input/30 dark:dcb:border-input dark:hover:dcb:bg-input/50",
        secondary:
          "dcb:bg-secondary dcb:text-secondary-foreground hover:dcb:bg-secondary/80",
        ghost:
          "hover:dcb:bg-accent hover:dcb:text-accent-foreground dark:hover:dcb:bg-accent/50",
        link: "dcb:text-primary dcb:underline-offset-4 hover:dcb:underline",
      },
      size: {
        default: "dcb:h-9 dcb:px-4 dcb:py-2 dcb:has-[>svg]:px-3",
        sm: "dcb:h-8 dcb:rounded-md dcb:gap-1.5 dcb:px-3 dcb:has-[>svg]:px-2.5",
        lg: "dcb:h-10 dcb:rounded-md dcb:px-6 dcb:has-[>svg]:px-4",
        icon: "dcb:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
