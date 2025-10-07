"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/utils/cn";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "dcb:bg-popover dcb:text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dcb:z-50 dcb:max-h-(--radix-dropdown-menu-content-available-height) dcb:min-w-[8rem] dcb:origin-(--radix-dropdown-menu-content-transform-origin) dcb:overflow-x-hidden dcb:overflow-y-auto dcb:rounded-md dcb:border dcb:p-1 dcb:shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:dcb:bg-accent focus:dcb:text-accent-foreground dcb:data-[variant=destructive]:text-destructive dcb:data-[variant=destructive]:focus:bg-destructive/10 dark:dcb:data-[variant=destructive]:focus:bg-destructive/20 dcb:data-[variant=destructive]:focus:text-destructive dcb:data-[variant=destructive]:*:[svg]:!text-destructive dcb:[&_svg:not([class*='text-'])]:text-muted-foreground dcb:relative dcb:flex dcb:cursor-default dcb:items-center dcb:gap-2 dcb:rounded-sm dcb:px-2 dcb:py-1.5 dcb:text-sm dcb:outline-hidden dcb:select-none dcb:data-[disabled]:pointer-events-none dcb:data-[disabled]:opacity-50 dcb:data-[inset]:pl-8 dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:dcb:bg-accent focus:dcb:text-accent-foreground dcb:relative dcb:flex dcb:cursor-default dcb:items-center dcb:gap-2 dcb:rounded-sm dcb:py-1.5 dcb:pr-2 dcb:pl-8 dcb:text-sm dcb:outline-hidden dcb:select-none dcb:data-[disabled]:pointer-events-none dcb:data-[disabled]:opacity-50 dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="dcb:pointer-events-none dcb:absolute dcb:left-2 dcb:flex dcb:size-3.5 dcb:items-center dcb:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="dcb:size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:dcb:bg-accent focus:dcb:text-accent-foreground dcb:relative dcb:flex dcb:cursor-default dcb:items-center dcb:gap-2 dcb:rounded-sm dcb:py-1.5 dcb:pr-2 dcb:pl-8 dcb:text-sm dcb:outline-hidden dcb:select-none dcb:data-[disabled]:pointer-events-none dcb:data-[disabled]:opacity-50 dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="dcb:pointer-events-none dcb:absolute dcb:left-2 dcb:flex dcb:size-3.5 dcb:items-center dcb:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="dcb:size-2 dcb:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "dcb:px-2 dcb:py-1.5 dcb:text-sm dcb:font-medium dcb:data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("dcb:bg-border dcb:-mx-1 dcb:my-1 dcb:h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "dcb:text-muted-foreground dcb:ml-auto dcb:text-xs dcb:tracking-widest",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:dcb:bg-accent focus:dcb:text-accent-foreground dcb:data-[state=open]:bg-accent dcb:data-[state=open]:text-accent-foreground dcb:flex dcb:cursor-default dcb:items-center dcb:rounded-sm dcb:px-2 dcb:py-1.5 dcb:text-sm dcb:outline-hidden dcb:select-none dcb:data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="dcb:ml-auto dcb:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "dcb:bg-popover dcb:text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dcb:z-50 dcb:min-w-[8rem] dcb:origin-(--radix-dropdown-menu-content-transform-origin) dcb:overflow-hidden dcb:rounded-md dcb:border dcb:p-1 dcb:shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
