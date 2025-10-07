import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { useShadowRoot } from "@/hooks/useShadowRoot";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const shadowRoot = useShadowRoot();

  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      container={shadowRoot as HTMLElement | undefined}
      {...props}
    />
  );
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dcb:fixed dcb:inset-0 dcb:z-50 dcb:bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "dcb:bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dcb:fixed dcb:top-[50%] dcb:left-[50%] dcb:z-50 dcb:grid dcb:w-full dcb:max-w-[calc(100%-2rem)] dcb:translate-x-[-50%] dcb:translate-y-[-50%] dcb:gap-4 dcb:rounded-lg dcb:border dcb:p-6 dcb:shadow-lg dcb:duration-200 sm:dcb:max-w-lg",
          className
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="dcb:ring-offset-background dcb:bg-background focus:dcb:ring-ring dcb:data-[state=open]:bg-accent dcb:data-[state=open]:text-muted-foreground dcb:absolute dcb:top-4 dcb:right-4 dcb:rounded-xs dcb:opacity-70 dcb:transition-opacity hover:dcb:opacity-100 focus:dcb:ring-2 focus:dcb:ring-offset-2 focus:dcb:outline-hidden disabled:dcb:pointer-events-none dcb:[&_svg]:pointer-events-none dcb:[&_svg]:shrink-0 dcb:[&_svg:not([class*='size-'])]:size-4 dcb:cursor-pointer"
          >
            <XIcon />
            <span className="dcb:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "dcb:flex dcb:flex-col dcb:gap-2 dcb:text-center sm:dcb:text-left",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "dcb:flex dcb:flex-col-reverse dcb:gap-2 sm:dcb:flex-row sm:dcb:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "dcb:text-lg dcb:leading-none dcb:font-semibold",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("dcb:text-muted-foreground dcb:text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
