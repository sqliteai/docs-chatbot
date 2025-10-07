import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/utils/cn";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "dcb:border-input dcb:data-[placeholder]:text-muted-foreground dcb:[&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:dcb:border-ring focus-visible:dcb:ring-ring/50 aria-invalid:dcb:ring-destructive/20 dark:aria-invalid:dcb:ring-destructive/40 aria-invalid:dcb:border-destructive dark:dcb:bg-input/30 dark:hover:dcb:bg-input/50 dcb:flex dcb:w-fit dcb:items-center dcb:justify-between dcb:gap-2 dcb:rounded-md dcb:border dcb:bg-transparent dcb:px-3 dcb:py-2 dcb:text-sm dcb:whitespace-nowrap dcb:shadow-xs dcb:transition-[color,box-shadow] dcb:outline-none focus-visible:dcb:ring-[3px] disabled:dcb:cursor-not-allowed disabled:dcb:opacity-50 dcb:data-[size=default]:h-9 dcb:data-[size=sm]:h-8 dcb:*:data-[slot=select-value]:line-clamp-1 dcb:*:data-[slot=select-value]:flex dcb:*:data-[slot=select-value]:items-center dcb:*:data-[slot=select-value]:gap-2 dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="dcb:size-4 dcb:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "dcb:bg-popover dcb:text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dcb:relative dcb:z-50 dcb:max-h-(--radix-select-content-available-height) dcb:min-w-[8rem] dcb:origin-(--radix-select-content-transform-origin) dcb:overflow-x-hidden dcb:overflow-y-auto dcb:rounded-md dcb:border dcb:shadow-md",
          position === "popper" &&
            "dcb:data-[side=bottom]:translate-y-1 dcb:data-[side=left]:-translate-x-1 dcb:data-[side=right]:translate-x-1 dcb:data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "dcb:p-1",
            position === "popper" &&
              "dcb:h-[var(--radix-select-trigger-height)] dcb:w-full dcb:min-w-[var(--radix-select-trigger-width)] dcb:scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "dcb:text-muted-foreground dcb:px-2 dcb:py-1.5 dcb:text-xs",
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:dcb:bg-accent focus:dcb:text-accent-foreground dcb:[&_svg:not([class*='text-'])]:text-muted-foreground dcb:relative dcb:flex dcb:w-full dcb:cursor-default dcb:items-center dcb:gap-2 dcb:rounded-sm dcb:py-1.5 dcb:pr-8 dcb:pl-2 dcb:text-sm dcb:outline-hidden dcb:select-none dcb:data-[disabled]:pointer-events-none dcb:data-[disabled]:opacity-50 dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4 dcb:*:[span]:last:flex dcb:*:[span]:last:items-center dcb:*:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="dcb:absolute dcb:right-2 dcb:flex dcb:size-3.5 dcb:items-center dcb:justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="dcb:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "dcb:bg-border dcb:pointer-events-none dcb:-mx-1 dcb:my-1 dcb:h-px",
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "dcb:flex dcb:cursor-default dcb:items-center dcb:justify-center dcb:py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="dcb:size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "dcb:flex dcb:cursor-default dcb:items-center dcb:justify-center dcb:py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="dcb:size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
