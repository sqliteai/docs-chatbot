import * as React from "react";

import { cn } from "@/utils/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "dcb:border-input placeholder:dcb:text-muted-foreground focus-visible:dcb:border-ring focus-visible:dcb:ring-ring/50 aria-invalid:dcb:ring-destructive/20 dark:aria-invalid:dcb:ring-destructive/40 aria-invalid:dcb:border-destructive dark:dcb:bg-input/30 dcb:flex dcb:field-sizing-content dcb:min-h-16 dcb:w-full dcb:rounded-md dcb:border dcb:bg-transparent dcb:px-3 dcb:py-2 dcb:text-base dcb:shadow-xs dcb:transition-[color,box-shadow] dcb:outline-none focus-visible:dcb:ring-[3px] disabled:dcb:cursor-not-allowed disabled:dcb:opacity-50 md:dcb:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
